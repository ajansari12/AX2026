import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CheckResult {
  name: string;
  found: boolean;
  detail: string;
  weight: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    let html = "";
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(normalizedUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; AnalyticsChecker/1.0)",
        },
      });
      clearTimeout(timeout);
      html = await response.text();
    } catch {
      return new Response(
        JSON.stringify({ error: "Could not reach the website. Please check the URL and try again." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const checks: CheckResult[] = [];

    const hasGA4 = /gtag.*G-[A-Z0-9]+/i.test(html) || /googletagmanager.*gtag/i.test(html) || /G-[A-Z0-9]{7,12}/i.test(html);
    checks.push({
      name: "Google Analytics 4 (GA4)",
      found: hasGA4,
      detail: hasGA4
        ? "GA4 tracking code detected. You're collecting basic website data."
        : "No GA4 tracking found. You're missing all visitor behavior data.",
      weight: 25,
    });

    const hasGTM = /googletagmanager\.com\/gtm\.js/i.test(html) || /GTM-[A-Z0-9]+/i.test(html);
    checks.push({
      name: "Google Tag Manager",
      found: hasGTM,
      detail: hasGTM
        ? "GTM is installed. Good foundation for managing all your tracking tags."
        : "No GTM detected. Without it, adding new tracking requires code changes every time.",
      weight: 20,
    });

    const hasFBPixel = /fbq\s*\(/i.test(html) || /connect\.facebook\.net.*fbevents/i.test(html) || /facebook\.com\/tr/i.test(html);
    checks.push({
      name: "Facebook / Meta Pixel",
      found: hasFBPixel,
      detail: hasFBPixel
        ? "Meta Pixel detected. You can retarget visitors on Facebook and Instagram."
        : "No Meta Pixel found. If you run Facebook/Instagram ads, you're wasting ad spend without conversion tracking.",
      weight: 15,
    });

    const hasConversionTracking = /gtag.*conversion/i.test(html) || /google_conversion/i.test(html) || /AW-[0-9]+/i.test(html);
    checks.push({
      name: "Google Ads Conversion Tracking",
      found: hasConversionTracking,
      detail: hasConversionTracking
        ? "Google Ads conversion tracking detected."
        : "No Google Ads conversion tracking found. If running Google Ads, you can't measure ROI without this.",
      weight: 15,
    });

    const hasHotjar = /hotjar\.com/i.test(html) || /hj\s*\(/i.test(html);
    const hasClarity = /clarity\.ms/i.test(html);
    const hasBehavior = hasHotjar || hasClarity;
    checks.push({
      name: "Behavior Analytics (Hotjar/Clarity)",
      found: hasBehavior,
      detail: hasBehavior
        ? `${hasHotjar ? "Hotjar" : "Microsoft Clarity"} detected. You can see heatmaps and session recordings.`
        : "No behavior analytics found. Heatmaps and session recordings reveal what numbers alone can't.",
      weight: 10,
    });

    const hasStructuredData = /application\/ld\+json/i.test(html) || /itemtype.*schema\.org/i.test(html);
    checks.push({
      name: "Structured Data (Schema.org)",
      found: hasStructuredData,
      detail: hasStructuredData
        ? "Structured data found. Search engines can better understand your content."
        : "No structured data detected. Adding it can improve rich snippet appearances in search results.",
      weight: 10,
    });

    const hasViewport = /name=["']viewport["']/i.test(html);
    checks.push({
      name: "Mobile Viewport Meta Tag",
      found: hasViewport,
      detail: hasViewport
        ? "Viewport meta tag present. Your site is configured for mobile devices."
        : "No viewport meta tag. Your site may not display correctly on mobile devices.",
      weight: 5,
    });

    let totalWeight = 0;
    let earnedWeight = 0;
    for (const check of checks) {
      totalWeight += check.weight;
      if (check.found) earnedWeight += check.weight;
    }
    const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

    return new Response(
      JSON.stringify({
        url: normalizedUrl,
        score,
        checks,
        foundCount: checks.filter((c) => c.found).length,
        totalChecks: checks.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
