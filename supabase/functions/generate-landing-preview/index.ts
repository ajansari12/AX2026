import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") || "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { businessName, industry, primaryService, targetAudience, tone } =
      await req.json();

    if (!businessName || !industry) {
      return new Response(
        JSON.stringify({ error: "Business name and industry are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!ANTHROPIC_API_KEY) {
      const fallback = generateFallbackCopy(
        businessName,
        industry,
        primaryService,
        targetAudience,
        tone
      );
      return new Response(JSON.stringify(fallback), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are an expert copywriter specializing in high-converting landing pages for local businesses. Generate landing page copy for this business:

Business Name: ${businessName}
Industry: ${industry}
Primary Service: ${primaryService || "General services"}
Target Audience: ${targetAudience || "Local customers"}
Tone: ${tone || "Professional and friendly"}

Return a JSON object with exactly these fields (no markdown, no code fences, just raw JSON):
{
  "heroHeadline": "A compelling headline (max 10 words)",
  "heroSubheadline": "A persuasive subheadline (max 25 words)",
  "ctaText": "A strong call-to-action button text (max 5 words)",
  "features": [
    {"title": "Feature 1 title (3-5 words)", "description": "Feature 1 description (max 15 words)"},
    {"title": "Feature 2 title (3-5 words)", "description": "Feature 2 description (max 15 words)"},
    {"title": "Feature 3 title (3-5 words)", "description": "Feature 3 description (max 15 words)"}
  ],
  "socialProof": "A realistic testimonial quote (max 30 words)",
  "socialProofAuthor": "Realistic first name and last initial",
  "aboutSnippet": "A brief about section (max 40 words)",
  "urgencyText": "A subtle urgency/scarcity line (max 15 words)"
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const fallback = generateFallbackCopy(
        businessName,
        industry,
        primaryService,
        targetAudience,
        tone
      );
      return new Response(JSON.stringify(fallback), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const text =
      data.content?.[0]?.text ||
      data.content?.[0]?.value ||
      "";

    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch {
      const fallback = generateFallbackCopy(
        businessName,
        industry,
        primaryService,
        targetAudience,
        tone
      );
      return new Response(JSON.stringify(fallback), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred. Please try again.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateFallbackCopy(
  businessName: string,
  industry: string,
  primaryService: string,
  targetAudience: string,
  tone: string
) {
  const service = primaryService || `${industry} services`;
  const audience = targetAudience || "local customers";

  return {
    heroHeadline: `${businessName}: ${industry} You Can Trust`,
    heroSubheadline: `Expert ${service.toLowerCase()} designed for ${audience.toLowerCase()}. Results you'll see from day one.`,
    ctaText: "Book a Free Consultation",
    features: [
      {
        title: "Proven Track Record",
        description: `Trusted by hundreds of satisfied ${audience.toLowerCase()} in your area.`,
      },
      {
        title: "Personalized Approach",
        description: `Every solution tailored specifically to your unique needs and goals.`,
      },
      {
        title: "Fast, Reliable Results",
        description: `Get started quickly with our streamlined, efficient process.`,
      },
    ],
    socialProof: `"${businessName} transformed our experience. Professional, thorough, and truly cares about results. Highly recommend to anyone looking for quality ${service.toLowerCase()}."`,
    socialProofAuthor: "Sarah M.",
    aboutSnippet: `${businessName} has been serving ${audience.toLowerCase()} with dedication and expertise. We combine ${industry.toLowerCase()} knowledge with a personal touch to deliver exceptional ${service.toLowerCase()}.`,
    urgencyText: `Limited availability this month -- book your consultation today.`,
  };
}
