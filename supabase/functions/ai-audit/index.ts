import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Anthropic from "npm:@anthropic-ai/sdk@0.39.0";

const allowedOrigins = ["https://axrategy.com", "https://www.axrategy.com"];

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  const corsHeaders = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  };

  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { industry, teamSize, painPoint, leadVolume, tools, websiteUrl, score, monthlyImpact, hoursSaved } = await req.json();

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) throw new Error("Missing ANTHROPIC_API_KEY");

    const anthropic = new Anthropic({ apiKey: anthropicKey });

    const toolsList = Array.isArray(tools) ? tools.join(", ") : tools;

    const prompt = `You are an AI automation consultant at Axrategy. A small business owner just completed a quick assessment. Based on their answers, provide a personalized analysis.

Business profile:
- Industry: ${industry}
- Team size: ${teamSize} employees
- Biggest pain point: ${painPoint}
- Monthly leads: ${leadVolume}
- Current tools: ${toolsList}
- Website URL: ${websiteUrl || "not provided"}
- Automation readiness score: ${score}/100
- Estimated monthly value of automation: $${monthlyImpact?.toLocaleString()}
- Hours that could be saved per month: ${hoursSaved}

Write a concise, personalized analysis with exactly these 4 sections. Be specific to their industry and situation. Do not use generic filler language. Be direct and honest.

FORMAT YOUR RESPONSE AS JSON with these exact keys:
{
  "headline": "One punchy sentence (max 12 words) about their biggest opportunity. Use their industry.",
  "insight": "2-3 sentences. Specific insight about their situation based on their pain point and tools. Reference their industry. Include one specific number or statistic relevant to their situation.",
  "topRecommendation": {
    "title": "Most important thing they should do first (5-8 words)",
    "description": "2 sentences. What it is and why it matters for their specific situation.",
    "effort": "Low | Medium | High",
    "impact": "Low | Medium | High",
    "timeline": "e.g. 2-3 weeks"
  },
  "riskIfDelayed": "1-2 sentences. What happens to their business if they don't act in the next 90 days. Be specific and honest."
}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    const analysis = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ success: true, analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI audit error:", error);
    return new Response(JSON.stringify({ success: false, error: "Analysis failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
