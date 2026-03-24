import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.89.0";
import Anthropic from "npm:@anthropic-ai/sdk@0.39.0";

const allowedOrigins = ["https://axrategy.com", "https://www.axrategy.com"];

const FROM_EMAIL = "Ali at Axrategy <hello@axrategy.com>";

const SEQUENCE_STEPS = [
  { step: 1, subject: "Quick question about your business, {name}", delayDays: 0 },
  { step: 2, subject: "Did you get a chance to look at this?", delayDays: 3 },
  { step: 3, subject: "One thing I noticed about your industry, {name}", delayDays: 7 },
  { step: 4, subject: "Should I close your file?", delayDays: 14 },
];

async function generateEmailContent(
  anthropic: Anthropic,
  step: number,
  leadName: string,
  leadEmail: string,
  industry: string,
  _metadata: Record<string, unknown>
): Promise<{ subject: string; body: string }> {
  const stepInfo = SEQUENCE_STEPS.find((s) => s.step === step);
  const firstName = leadName.split(" ")[0];
  const subject = (stepInfo?.subject || "Following up").replace("{name}", firstName);

  const prompts: Record<number, string> = {
    1: `Write a brief, warm welcome email (4-6 sentences) from Ali at Axrategy to a new lead named ${leadName} who works in ${industry}. They reached out about AI automation. Sound like a real person, not a company. End with one soft CTA to book a 15-min call at cal.com/axrategy/15min. No bullet points. Plain text.`,
    2: `Write a 3-4 sentence follow-up email to ${leadName} in ${industry}. They haven't responded to the first email. Be casual and direct, not salesy. Ask if they had a chance to think about it. Include the booking link cal.com/axrategy/15min. Plain text only.`,
    3: `Write a value email (5-6 sentences) to ${leadName} in ${industry}. Share ONE specific insight about how ${industry} businesses typically lose time or leads without automation. Be specific. End with a soft question: "Is this something you're dealing with?" No CTA links. Plain text.`,
    4: `Write a gentle breakup email to ${leadName}. They haven't responded to 3 emails. Be respectful and leave the door open. Say you'll close their file unless they want to connect. 2-3 sentences max. Include cal.com/axrategy/15min one final time. Plain text.`,
  };

  const fallbacks: Record<number, string> = {
    1: `Hi ${firstName},\n\nThanks for reaching out to Axrategy. I'd love to learn more about what you're trying to automate.\n\nWould you be open to a quick 15-minute call this week? You can grab a time here: cal.com/axrategy/15min\n\nLooking forward to connecting.\n\nAli`,
    2: `Hi ${firstName},\n\nJust checking in — did you get a chance to look at my last message?\n\nHappy to answer any questions. You can book a quick call here: cal.com/axrategy/15min\n\nAli`,
    3: `Hi ${firstName},\n\nOne thing I've noticed with a lot of ${industry} businesses: they're losing 3-5 leads per week simply because follow-up is manual and inconsistent.\n\nIs that something you're dealing with?\n\nAli`,
    4: `Hi ${firstName},\n\nI don't want to clutter your inbox. If the timing isn't right, no problem at all — I'll close this thread.\n\nIf you do want to chat, cal.com/axrategy/15min is always open.\n\nAll the best,\nAli`,
  };

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: prompts[step] || prompts[1] }],
    });
    const body =
      response.content[0].type === "text" ? response.content[0].text : fallbacks[step];
    return { subject, body };
  } catch {
    return { subject, body: fallbacks[step] || fallbacks[1] };
  }
}

async function sendEmail(
  resendApiKey: string,
  to: string,
  subject: string,
  body: string
): Promise<boolean> {
  try {
    const htmlBody = body
      .split("\n\n")
      .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
      .join("");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        text: body,
        html: `<div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; color: #111; line-height: 1.6; padding: 40px 20px;">${htmlBody}<hr style="border:none;border-top:1px solid #eee;margin-top:40px"><p style="font-size:11px;color:#999">Axrategy · Toronto, ON · <a href="https://axrategy.com/unsubscribe?email=${encodeURIComponent(to)}" style="color:#999">Unsubscribe</a></p></div>`,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

    const body = await req.json().catch(() => ({}));
    const { action, leadId, leadEmail, leadName, industry, metadata } = body;

    if (action === "start_sequence") {
      if (!leadEmail) {
        return new Response(
          JSON.stringify({ error: "Missing leadEmail" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { subject, body: emailBody } = await generateEmailContent(
        anthropic,
        1,
        leadName || "there",
        leadEmail,
        industry || "your industry",
        metadata || {}
      );

      await sendEmail(resendApiKey, leadEmail, subject, emailBody);

      const nextStepInfo = SEQUENCE_STEPS.find((s) => s.step === 2);
      const delayDays = nextStepInfo?.delayDays ?? 3;

      await supabase.from("lead_sequences").insert({
        lead_id: leadId || null,
        lead_email: leadEmail,
        lead_name: leadName || null,
        industry: industry || null,
        sequence_type: "new_lead",
        current_step: 1,
        status: "active",
        next_send_at: new Date(Date.now() + delayDays * 24 * 60 * 60 * 1000).toISOString(),
        last_sent_at: new Date().toISOString(),
        metadata: metadata || {},
      });

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "process_due") {
      const { data: dueSequences, error } = await supabase
        .from("lead_sequences")
        .select("*")
        .eq("status", "active")
        .lte("next_send_at", new Date().toISOString())
        .limit(50);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let processed = 0;

      for (const seq of dueSequences || []) {
        const nextStep = seq.current_step + 1;

        if (nextStep > 4) {
          await supabase
            .from("lead_sequences")
            .update({ status: "completed" })
            .eq("id", seq.id);
          continue;
        }

        const { subject, body: emailBody } = await generateEmailContent(
          anthropic,
          nextStep,
          seq.lead_name || "there",
          seq.lead_email,
          seq.industry || "your industry",
          seq.metadata || {}
        );

        const sent = await sendEmail(resendApiKey, seq.lead_email, subject, emailBody);

        if (sent) {
          const isLastStep = nextStep >= 4;
          let nextSendAt: string | null = null;

          if (!isLastStep) {
            const nextStepInfo = SEQUENCE_STEPS.find((s) => s.step === nextStep + 1);
            const delayDays = nextStepInfo?.delayDays ?? 7;
            nextSendAt = new Date(Date.now() + delayDays * 24 * 60 * 60 * 1000).toISOString();
          }

          await supabase
            .from("lead_sequences")
            .update({
              current_step: nextStep,
              last_sent_at: new Date().toISOString(),
              next_send_at: nextSendAt,
              status: isLastStep ? "completed" : "active",
            })
            .eq("id", seq.id);

          processed++;
        }
      }

      return new Response(
        JSON.stringify({ success: true, processed }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Automation function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
