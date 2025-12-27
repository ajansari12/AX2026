import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BookingConfirmationPayload {
  type: "confirmation" | "reminder_24h" | "reminder_1h" | "reschedule" | "cancel";
  booking: {
    id: string;
    name: string;
    email: string;
    scheduled_time: string;
    notes?: string;
    meeting_type?: string;
  };
  reschedule_url?: string;
  cancel_url?: string;
}

// Generate ICS calendar file content
function generateICS(booking: BookingConfirmationPayload["booking"]): string {
  const startDate = new Date(booking.scheduled_time);
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 min meeting

  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const uid = `${booking.id}@axrategy.com`;
  const now = formatDate(new Date());

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Axrategy//Booking System//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Strategy Call with Axrategy
DESCRIPTION:${booking.notes ? booking.notes.replace(/\n/g, '\\n') : 'Strategy consultation call'}
LOCATION:Video Call (link will be sent separately)
ORGANIZER;CN=Axrategy:mailto:hi@axrategy.com
ATTENDEE;CN=${booking.name};RSVP=TRUE:mailto:${booking.email}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`.trim();
}

function generateConfirmationEmailHtml(
  booking: BookingConfirmationPayload["booking"],
  rescheduleUrl?: string,
  cancelUrl?: string
): string {
  const date = new Date(booking.scheduled_time);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

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
            <td style="background-color: #059669; padding: 32px 40px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Your Call is Confirmed!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #18181b; font-size: 18px; font-weight: 500;">
                Hi ${booking.name.split(' ')[0]},
              </p>

              <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Your strategy call with Axrategy has been confirmed. We're looking forward to speaking with you!
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ecfdf5; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #a7f3d0;">
                          <span style="color: #047857; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Date</span><br>
                          <span style="color: #065f46; font-size: 18px; font-weight: 600;">${formattedDate}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <span style="color: #047857; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Time</span><br>
                          <span style="color: #065f46; font-size: 18px; font-weight: 600;">${formattedTime}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <div style="margin: 32px 0; padding: 24px; background-color: #fafafa; border-radius: 6px; border-left: 4px solid #18181b;">
                <p style="margin: 0 0 8px; color: #18181b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  What to Expect
                </p>
                <ul style="margin: 12px 0 0; padding-left: 20px; color: #52525b; font-size: 15px; line-height: 1.8;">
                  <li>We'll discuss your business goals and challenges</li>
                  <li>Explore how AI and automation can help</li>
                  <li>Share relevant case studies and solutions</li>
                  <li>Answer any questions you have</li>
                </ul>
              </div>

              <p style="margin: 0 0 24px; color: #52525b; font-size: 14px; line-height: 1.6;">
                A calendar invite (.ics file) is attached to this email. Add it to your calendar to get a reminder before the call.
              </p>

              ${rescheduleUrl || cancelUrl ? `
              <div style="margin: 24px 0; text-align: center;">
                ${rescheduleUrl ? `<a href="${rescheduleUrl}" style="display: inline-block; margin: 0 8px; padding: 12px 24px; background-color: #f4f4f5; color: #18181b; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">Reschedule</a>` : ''}
                ${cancelUrl ? `<a href="${cancelUrl}" style="display: inline-block; margin: 0 8px; padding: 12px 24px; background-color: #fef2f2; color: #dc2626; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">Cancel</a>` : ''}
              </div>
              ` : ''}

              <p style="margin: 24px 0 0; color: #18181b; font-size: 16px;">
                See you soon!<br>
                <strong>The Axrategy Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #fafafa; padding: 24px 40px; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; color: #a1a1aa; font-size: 13px; text-align: center;">
                If you have any questions before the call, reply to this email or contact us at hi@axrategy.com
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

function generateReminderEmailHtml(
  booking: BookingConfirmationPayload["booking"],
  hoursUntil: number,
  rescheduleUrl?: string
): string {
  const date = new Date(booking.scheduled_time);
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const timeLabel = hoursUntil === 24 ? "tomorrow" : "in 1 hour";

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
            <td style="background-color: #2563eb; padding: 32px 40px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">⏰ Reminder: Your Call is ${timeLabel}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #18181b; font-size: 18px; font-weight: 500;">
                Hi ${booking.name.split(' ')[0]},
              </p>

              <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
                This is a friendly reminder that your strategy call with Axrategy is coming up ${timeLabel} at <strong>${formattedTime}</strong>.
              </p>

              <div style="margin: 32px 0; padding: 24px; background-color: #eff6ff; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 8px; color: #1e40af; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Your call time</p>
                <p style="margin: 0; color: #1e3a8a; font-size: 28px; font-weight: 700;">${formattedTime}</p>
              </div>

              ${rescheduleUrl ? `
              <p style="margin: 24px 0; color: #52525b; font-size: 14px; text-align: center;">
                Need to reschedule? <a href="${rescheduleUrl}" style="color: #2563eb; text-decoration: underline;">Click here</a>
              </p>
              ` : ''}

              <p style="margin: 24px 0 0; color: #18181b; font-size: 16px;">
                See you soon!<br>
                <strong>The Axrategy Team</strong>
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

async function sendEmail(
  resendApiKey: string,
  to: string,
  from: string,
  subject: string,
  html: string,
  attachments?: { filename: string; content: string }[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const body: Record<string, unknown> = {
      from,
      to,
      subject,
      html,
    };

    if (attachments && attachments.length > 0) {
      body.attachments = attachments.map(att => ({
        filename: att.filename,
        content: btoa(att.content), // Base64 encode
      }));
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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

const FROM_EMAIL = "Axrategy <noreply@axrategy.com>";

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

    const payload: BookingConfirmationPayload = await req.json();
    const { type, booking, reschedule_url, cancel_url } = payload;

    let subject: string;
    let html: string;
    let attachments: { filename: string; content: string }[] | undefined;

    switch (type) {
      case "confirmation":
        subject = `Your Call is Confirmed - ${new Date(booking.scheduled_time).toLocaleDateString()}`;
        html = generateConfirmationEmailHtml(booking, reschedule_url, cancel_url);
        attachments = [{
          filename: "axrategy-call.ics",
          content: generateICS(booking),
        }];
        break;

      case "reminder_24h":
        subject = "Reminder: Your Strategy Call is Tomorrow";
        html = generateReminderEmailHtml(booking, 24, reschedule_url);
        break;

      case "reminder_1h":
        subject = "Reminder: Your Strategy Call is in 1 Hour";
        html = generateReminderEmailHtml(booking, 1, reschedule_url);
        break;

      case "reschedule":
        subject = "Your Call Has Been Rescheduled";
        html = generateConfirmationEmailHtml(booking, reschedule_url, cancel_url);
        attachments = [{
          filename: "axrategy-call.ics",
          content: generateICS(booking),
        }];
        break;

      case "cancel":
        subject = "Your Call Has Been Cancelled";
        html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 24px; color: #18181b; font-size: 24px;">Call Cancelled</h1>
              <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Hi ${booking.name.split(' ')[0]}, your strategy call has been cancelled.
                If you'd like to reschedule, please visit our website.
              </p>
              <a href="https://axrategy.com/#/contact" style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500;">
                Book a New Call
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `.trim();
        break;

      default:
        return new Response(
          JSON.stringify({ success: false, error: "Unknown email type" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }

    const result = await sendEmail(
      resendApiKey,
      booking.email,
      FROM_EMAIL,
      subject,
      html,
      attachments
    );

    console.log(`Booking ${type} email sent to ${booking.email}`);

    return new Response(
      JSON.stringify({ success: result.success }),
      {
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
