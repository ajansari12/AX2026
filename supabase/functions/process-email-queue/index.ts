import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SequenceStep {
  id: string;
  sequence_id: string;
  step_order: number;
  subject: string;
  body_html: string;
  body_text: string | null;
  delay_days: number;
  delay_hours: number;
}

interface SubscriberSequence {
  id: string;
  subscriber_email: string;
  sequence_id: string;
  current_step: number;
  status: string;
  next_email_scheduled_at: string;
}

interface EmailSequence {
  id: string;
  name: string;
}

// Personalization helper
function personalizeContent(
  content: string,
  email: string,
  metadata: Record<string, unknown> = {}
): string {
  const firstName = (metadata.first_name as string) || email.split("@")[0];
  const lastName = (metadata.last_name as string) || "";

  return content
    .replace(/{{email}}/g, email)
    .replace(/{{first_name}}/g, firstName)
    .replace(/{{last_name}}/g, lastName)
    .replace(/{{full_name}}/g, `${firstName} ${lastName}`.trim());
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get pending emails to send
    const now = new Date().toISOString();
    const { data: pendingSequences, error: fetchError } = await supabase
      .from("subscriber_sequences")
      .select(
        `
        *,
        email_sequences!inner(id, name, is_active)
      `
      )
      .eq("status", "active")
      .lte("next_email_scheduled_at", now)
      .limit(50);

    if (fetchError) {
      throw new Error(`Failed to fetch pending sequences: ${fetchError.message}`);
    }

    const results = {
      processed: 0,
      sent: 0,
      completed: 0,
      errors: [] as string[],
    };

    for (const enrollment of pendingSequences || []) {
      results.processed++;

      try {
        // Get the current step
        const { data: step, error: stepError } = await supabase
          .from("email_sequence_steps")
          .select("*")
          .eq("sequence_id", enrollment.sequence_id)
          .eq("step_order", enrollment.current_step)
          .eq("is_active", true)
          .single();

        if (stepError || !step) {
          // No more steps - mark sequence as completed
          await supabase
            .from("subscriber_sequences")
            .update({
              status: "completed",
              completed_at: now,
              next_email_scheduled_at: null,
            })
            .eq("id", enrollment.id);

          results.completed++;
          continue;
        }

        // Get subscriber metadata
        const { data: subscriber } = await supabase
          .from("newsletter_subscribers")
          .select("*")
          .eq("email", enrollment.subscriber_email)
          .single();

        const metadata = subscriber?.metadata || {};

        // Personalize content
        const personalizedSubject = personalizeContent(
          step.subject,
          enrollment.subscriber_email,
          metadata
        );
        const personalizedBody = personalizeContent(
          step.body_html,
          enrollment.subscriber_email,
          metadata
        );

        // Send email via Resend
        if (resendApiKey) {
          const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: "Axrategy <hello@axrategy.com>",
              to: [enrollment.subscriber_email],
              subject: personalizedSubject,
              html: personalizedBody,
              text: step.body_text || undefined,
            }),
          });

          if (!emailResponse.ok) {
            const errorText = await emailResponse.text();
            throw new Error(`Resend API error: ${errorText}`);
          }
        }

        // Log the send
        await supabase.from("email_sends").insert({
          recipient_email: enrollment.subscriber_email,
          subject: personalizedSubject,
          sequence_id: enrollment.sequence_id,
          step_id: step.id,
          email_type: "sequence",
          status: "sent",
          sent_at: now,
        });

        // Get next step
        const { data: nextStep } = await supabase
          .from("email_sequence_steps")
          .select("*")
          .eq("sequence_id", enrollment.sequence_id)
          .eq("step_order", enrollment.current_step + 1)
          .eq("is_active", true)
          .single();

        if (nextStep) {
          // Calculate next send time
          const nextSendTime = new Date();
          nextSendTime.setDate(nextSendTime.getDate() + nextStep.delay_days);
          nextSendTime.setHours(nextSendTime.getHours() + nextStep.delay_hours);

          await supabase
            .from("subscriber_sequences")
            .update({
              current_step: enrollment.current_step + 1,
              last_email_sent_at: now,
              next_email_scheduled_at: nextSendTime.toISOString(),
            })
            .eq("id", enrollment.id);
        } else {
          // No more steps - mark as completed
          await supabase
            .from("subscriber_sequences")
            .update({
              status: "completed",
              completed_at: now,
              last_email_sent_at: now,
              next_email_scheduled_at: null,
            })
            .eq("id", enrollment.id);

          results.completed++;
        }

        results.sent++;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        results.errors.push(
          `Failed to process ${enrollment.subscriber_email}: ${errorMsg}`
        );
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
