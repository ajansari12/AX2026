import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface LeadEmailPayload {
  type: "new_lead";
  lead: {
    name: string;
    email: string;
    service_interest?: string;
    message?: string;
    source: string;
  };
}

type EmailPayload = LeadEmailPayload;

function generateAdminEmailHtml(lead: LeadEmailPayload["lead"]): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background-color: #18181b; padding: 32px 40px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">New Lead Received</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
                A new inquiry has been submitted through the website.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 14px;">Name</span><br>
                          <span style="color: #18181b; font-size: 16px; font-weight: 500;">${lead.name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 14px;">Email</span><br>
                          <a href="mailto:${lead.email}" style="color: #2563eb; font-size: 16px; font-weight: 500; text-decoration: none;">${lead.email}</a>
                        </td>
                      </tr>
                      ${lead.service_interest ? `
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 14px;">Service Interest</span><br>
                          <span style="color: #18181b; font-size: 16px; font-weight: 500;">${lead.service_interest}</span>
                        </td>
                      </tr>
                      ` : ""}
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 14px;">Source</span><br>
                          <span style="color: #18181b; font-size: 16px; font-weight: 500;">${lead.source}</span>
                        </td>
                      </tr>
                      ${lead.message ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #71717a; font-size: 14px;">Message</span><br>
                          <span style="color: #18181b; font-size: 16px; line-height: 1.5;">${lead.message}</span>
                        </td>
                      </tr>
                      ` : ""}
                    </table>
                  </td>
                </tr>
              </table>
              
              <a href="mailto:${lead.email}" style="display: inline-block; background-color: #18181b; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px;">
                Reply to ${lead.name.split(" ")[0]}
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #fafafa; padding: 24px 40px; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; color: #a1a1aa; font-size: 13px; text-align: center;">
                This is an automated notification from Axrategy
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function generateConfirmationEmailHtml(name: string): string {
  const firstName = name.split(" ")[0];
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background-color: #18181b; padding: 32px 40px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Thanks for Reaching Out</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #18181b; font-size: 18px; font-weight: 500;">
                Hi ${firstName},
              </p>
              
              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Thank you for your interest in Axrategy. We have received your inquiry and a member of our team will be in touch within 24 hours.
              </p>
              
              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                In the meantime, feel free to explore our latest insights and case studies on our website.
              </p>
              
              <div style="margin: 32px 0; padding: 24px; background-color: #fafafa; border-radius: 6px; border-left: 4px solid #18181b;">
                <p style="margin: 0 0 8px; color: #18181b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  What Happens Next?
                </p>
                <ul style="margin: 12px 0 0; padding-left: 20px; color: #52525b; font-size: 15px; line-height: 1.8;">
                  <li>Our team reviews your inquiry</li>
                  <li>We will reach out to schedule a brief call</li>
                  <li>We discuss your goals and explore how we can help</li>
                </ul>
              </div>
              
              <p style="margin: 0; color: #52525b; font-size: 16px; line-height: 1.6;">
                We look forward to speaking with you.
              </p>
              
              <p style="margin: 24px 0 0; color: #18181b; font-size: 16px;">
                Best regards,<br>
                <strong>The Axrategy Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #fafafa; padding: 24px 40px; border-top: 1px solid #e4e4e7;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px; color: #71717a; font-size: 13px;">
                      Axrategy - Strategic Consulting
                    </p>
                    <p style="margin: 0; color: #a1a1aa; font-size: 12px;">
                      This email was sent because you submitted an inquiry on our website.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

async function sendEmail(
  resendApiKey: string,
  to: string,
  from: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      return { success: false, error: errorData.message || "Failed to send email" };
    }

    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Email service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const payload: EmailPayload = await req.json();

    if (payload.type === "new_lead") {
      const { lead } = payload;

      const adminEmailResult = await sendEmail(
        resendApiKey,
        "hi@axrategy.com",
        "Axrategy <noreply@axrategy.com>",
        `New Lead: ${lead.name} - ${lead.service_interest || lead.source}`,
        generateAdminEmailHtml(lead)
      );

      if (!adminEmailResult.success) {
        console.error("Failed to send admin email:", adminEmailResult.error);
      }

      const confirmationResult = await sendEmail(
        resendApiKey,
        lead.email,
        "Axrategy <noreply@axrategy.com>",
        "Thanks for Reaching Out - Axrategy",
        generateConfirmationEmailHtml(lead.name)
      );

      if (!confirmationResult.success) {
        console.error("Failed to send confirmation email:", confirmationResult.error);
      }

      return new Response(
        JSON.stringify({
          success: true,
          adminEmail: adminEmailResult.success,
          confirmationEmail: confirmationResult.success,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Unknown email type" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
