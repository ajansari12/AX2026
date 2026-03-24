import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.89.0";

const allowedOrigins = ["https://axrategy.com", "https://www.axrategy.com"];

interface PageSpeedCategory {
  score: number;
}

interface PageSpeedAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  numericValue?: number;
}

interface PageSpeedResult {
  categories: {
    performance: PageSpeedCategory;
    seo: PageSpeedCategory;
    accessibility: PageSpeedCategory;
    "best-practices": PageSpeedCategory;
  };
  audits: Record<string, PageSpeedAudit>;
}

interface RequestBody {
  url: string;
  visitorId?: string;
}

function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url;
}

function extractScores(result: PageSpeedResult) {
  return {
    performance: Math.round((result.categories.performance?.score || 0) * 100),
    seo: Math.round((result.categories.seo?.score || 0) * 100),
    accessibility: Math.round(
      (result.categories.accessibility?.score || 0) * 100
    ),
    bestPractices: Math.round(
      (result.categories["best-practices"]?.score || 0) * 100
    ),
  };
}

function extractMetrics(audits: Record<string, PageSpeedAudit>) {
  const metric = (id: string) => ({
    value: audits[id]?.numericValue || 0,
    display: audits[id]?.displayValue || "N/A",
    score: audits[id]?.score ?? 0,
  });

  return {
    lcp: metric("largest-contentful-paint"),
    fcp: metric("first-contentful-paint"),
    cls: metric("cumulative-layout-shift"),
    tbt: metric("total-blocking-time"),
    si: metric("speed-index"),
    tti: metric("interactive"),
  };
}

function extractTopIssues(
  audits: Record<string, PageSpeedAudit>,
  limit = 5
): { title: string; description: string; severity: string }[] {
  const failingAudits = Object.values(audits)
    .filter(
      (a) =>
        a.score !== null &&
        a.score < 0.5 &&
        a.title &&
        !a.id.startsWith("diagnostic") &&
        a.description
    )
    .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
    .slice(0, limit);

  return failingAudits.map((a) => ({
    title: a.title,
    description: (a.description || "").replace(/\[.*?\]\(.*?\)/g, "").slice(0, 200),
    severity: (a.score ?? 0) === 0 ? "critical" : "warning",
  }));
}

async function fetchPageSpeed(
  url: string,
  strategy: "mobile" | "desktop"
): Promise<PageSpeedResult | null> {
  const apiKey = Deno.env.get("GOOGLE_PAGESPEED_API_KEY");
  const categories =
    "category=PERFORMANCE&category=SEO&category=ACCESSIBILITY&category=BEST_PRACTICES";
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&${categories}${apiKey ? `&key=${apiKey}` : ""}`;

  const resp = await fetch(endpoint);
  if (!resp.ok) {
    console.error(`PageSpeed API error (${strategy}):`, await resp.text());
    return null;
  }

  const data = await resp.json();
  return data.lighthouseResult as PageSpeedResult;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  const corsHeaders = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: RequestBody = await req.json();
    const { visitorId } = body;

    if (!body.url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const url = normalizeUrl(body.url);

    const [mobileResult, desktopResult] = await Promise.all([
      fetchPageSpeed(url, "mobile"),
      fetchPageSpeed(url, "desktop"),
    ]);

    if (!mobileResult && !desktopResult) {
      return new Response(
        JSON.stringify({
          error:
            "Could not analyze this website. Please check the URL and try again.",
        }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const primary = mobileResult || desktopResult!;

    const mobileScores = mobileResult
      ? extractScores(mobileResult)
      : { performance: 0, seo: 0, accessibility: 0, bestPractices: 0 };
    const desktopScores = desktopResult
      ? extractScores(desktopResult)
      : { performance: 0, seo: 0, accessibility: 0, bestPractices: 0 };

    const metrics = extractMetrics(primary.audits);
    const topIssues = extractTopIssues(primary.audits, 5);

    const hostname = new URL(url).hostname;
    const screenshotUrl = `https://image.thum.io/get/width/1280/crop/800/https://${hostname}`;

    const auditData = {
      url,
      mobile_scores: mobileScores,
      desktop_scores: desktopScores,
      metrics,
      top_issues: topIssues,
      screenshot_url: screenshotUrl,
      visitor_id: visitorId || "",
    };

    const { data: auditRecord, error: insertError } = await supabase
      .from("website_audits")
      .insert(auditData)
      .select("id")
      .single();

    if (insertError) {
      console.error("Failed to save audit:", insertError);
    }

    await supabase.from("product_events").insert({
      event_type: "audit_completed",
      product_slug: "website-teardown-report",
      visitor_id: visitorId || "",
      metadata: { url, auditId: auditRecord?.id },
    });

    return new Response(
      JSON.stringify({
        id: auditRecord?.id,
        url,
        mobileScores,
        desktopScores,
        metrics,
        topIssues,
        screenshotUrl,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Website audit error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to analyze website" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
