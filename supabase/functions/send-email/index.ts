import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Email payload types
interface LeadEmailPayload {
  type: "new_lead";
  lead: {
    name: string;
    email: string;
    service_interest?: string;
    message?: string;
    source: string;
    pricing_preference?: string;
  };
}

interface BookingEmailPayload {
  type: "new_booking";
  booking: {
    name: string;
    email: string;
    scheduled_time: string;
    notes?: string;
  };
}

interface DailyDigestPayload {
  type: "daily_digest";
  stats: {
    newLeads: number;
    newBookings: number;
    newSubscribers: number;
    newConversations: number;
    topSource?: string;
  };
  date: string;
}

interface LeadStatusChangePayload {
  type: "lead_status_change";
  lead: {
    name: string;
    email: string;
    oldStatus: string;
    newStatus: string;
  };
}

interface ProposalEmailPayload {
  type: "proposal";
  proposal: {
    title: string;
    client_name: string;
    client_email: string;
    share_token: string;
    total: number;
    valid_until?: string;
  };
}

interface ResourceDownloadEmailPayload {
  type: "resource_download";
  resource: {
    email: string;
    resourceName: string;
    resourceTitle: string;
    downloadUrl: string;
  };
}

type EmailPayload = LeadEmailPayload | BookingEmailPayload | DailyDigestPayload | LeadStatusChangePayload | ProposalEmailPayload | ResourceDownloadEmailPayload;

// Admin notification email address
const ADMIN_EMAIL = "hi@axrategy.com";
const FROM_EMAIL = "Axrategy <noreply@axrategy.com>";

function generateAdminEmailHtml(lead: LeadEmailPayload["lead"]): string {
  const pricingLabel = lead.pricing_preference === 'one_time' ? 'One-time (Own Everything)'
    : lead.pricing_preference === 'monthly' ? 'Monthly (Ongoing Partnership)'
    : 'Undecided';

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
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">🎯 New Lead Received</h1>
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
                          <span style="color: #71717a; font-size: 14px;">Pricing Preference</span><br>
                          <span style="color: #18181b; font-size: 16px; font-weight: 500;">${pricingLabel}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 14px;">Source</span><br>
                          <span style="color: #18181b; font-size: 16px; font-weight: 500;">${lead.source.replace(/_/g, ' ')}</span>
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

function generateBookingEmailHtml(booking: BookingEmailPayload["booking"]): string {
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
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">📅 New Booking Confirmed</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
                A new call has been scheduled.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ecfdf5; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #a7f3d0;">
                          <span style="color: #047857; font-size: 14px;">Name</span><br>
                          <span style="color: #065f46; font-size: 16px; font-weight: 500;">${booking.name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #a7f3d0;">
                          <span style="color: #047857; font-size: 14px;">Email</span><br>
                          <a href="mailto:${booking.email}" style="color: #059669; font-size: 16px; font-weight: 500; text-decoration: none;">${booking.email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #a7f3d0;">
                          <span style="color: #047857; font-size: 14px;">Date</span><br>
                          <span style="color: #065f46; font-size: 16px; font-weight: 500;">${formattedDate}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;${booking.notes ? ' border-bottom: 1px solid #a7f3d0;' : ''}">
                          <span style="color: #047857; font-size: 14px;">Time</span><br>
                          <span style="color: #065f46; font-size: 18px; font-weight: 600;">${formattedTime}</span>
                        </td>
                      </tr>
                      ${booking.notes ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #047857; font-size: 14px;">Notes</span><br>
                          <span style="color: #065f46; font-size: 16px; line-height: 1.5;">${booking.notes}</span>
                        </td>
                      </tr>
                      ` : ""}
                    </table>
                  </td>
                </tr>
              </table>

              <a href="mailto:${booking.email}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px;">
                Send Pre-Call Info
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

function generateDailyDigestHtml(stats: DailyDigestPayload["stats"], date: string): string {
  const totalActivity = stats.newLeads + stats.newBookings + stats.newSubscribers + stats.newConversations;

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
            <td style="background-color: #7c3aed; padding: 32px 40px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">📊 Daily Activity Digest</h1>
              <p style="margin: 8px 0 0; color: #c4b5fd; font-size: 14px;">${date}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Here's a summary of yesterday's activity on your website.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #fafafa; border-radius: 6px; text-align: center; width: 25%;">
                    <p style="margin: 0; font-size: 32px; font-weight: 700; color: #18181b;">${stats.newLeads}</p>
                    <p style="margin: 4px 0 0; font-size: 12px; color: #71717a; text-transform: uppercase;">New Leads</p>
                  </td>
                  <td style="width: 8px;"></td>
                  <td style="padding: 16px; background-color: #fafafa; border-radius: 6px; text-align: center; width: 25%;">
                    <p style="margin: 0; font-size: 32px; font-weight: 700; color: #18181b;">${stats.newBookings}</p>
                    <p style="margin: 4px 0 0; font-size: 12px; color: #71717a; text-transform: uppercase;">Bookings</p>
                  </td>
                  <td style="width: 8px;"></td>
                  <td style="padding: 16px; background-color: #fafafa; border-radius: 6px; text-align: center; width: 25%;">
                    <p style="margin: 0; font-size: 32px; font-weight: 700; color: #18181b;">${stats.newSubscribers}</p>
                    <p style="margin: 4px 0 0; font-size: 12px; color: #71717a; text-transform: uppercase;">Subscribers</p>
                  </td>
                  <td style="width: 8px;"></td>
                  <td style="padding: 16px; background-color: #fafafa; border-radius: 6px; text-align: center; width: 25%;">
                    <p style="margin: 0; font-size: 32px; font-weight: 700; color: #18181b;">${stats.newConversations}</p>
                    <p style="margin: 4px 0 0; font-size: 12px; color: #71717a; text-transform: uppercase;">Chats</p>
                  </td>
                </tr>
              </table>

              ${stats.topSource ? `
              <div style="padding: 16px; background-color: #f5f3ff; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0; color: #5b21b6; font-size: 14px;">
                  <strong>Top Source:</strong> ${stats.topSource.replace(/_/g, ' ')}
                </p>
              </div>
              ` : ""}

              ${totalActivity === 0 ? `
              <div style="padding: 24px; background-color: #fef9c3; border-radius: 6px; text-align: center;">
                <p style="margin: 0; color: #854d0e; font-size: 14px;">
                  No activity yesterday. Consider promoting your services! 🚀
                </p>
              </div>
              ` : ""}
            </td>
          </tr>
          <tr>
            <td style="background-color: #fafafa; padding: 24px 40px; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; color: #a1a1aa; font-size: 13px; text-align: center;">
                This is your daily digest from Axrategy
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

function generateProposalEmailHtml(proposal: ProposalEmailPayload["proposal"], proposalUrl: string): string {
  const firstName = proposal.client_name.split(" ")[0];
  const validUntilText = proposal.valid_until
    ? new Date(proposal.valid_until).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : "30 days";

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
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Your Proposal is Ready</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #18181b; font-size: 18px; font-weight: 500;">
                Hi ${firstName},
              </p>

              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Thank you for your interest in working with Axrategy. We're excited to share a customized proposal for your project.
              </p>

              <div style="margin: 32px 0; padding: 24px; background-color: #fafafa; border-radius: 6px;">
                <p style="margin: 0 0 8px; color: #71717a; font-size: 14px;">Proposal Title</p>
                <p style="margin: 0 0 16px; color: #18181b; font-size: 18px; font-weight: 600;">${proposal.title}</p>

                <p style="margin: 0 0 8px; color: #71717a; font-size: 14px;">Investment</p>
                <p style="margin: 0 0 16px; color: #18181b; font-size: 24px; font-weight: 700;">$${proposal.total.toLocaleString()}</p>

                <p style="margin: 0 0 8px; color: #71717a; font-size: 14px;">Valid Until</p>
                <p style="margin: 0; color: #18181b; font-size: 16px; font-weight: 500;">${validUntilText}</p>
              </div>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${proposalUrl}" style="display: inline-block; background-color: #18181b; color: #ffffff; padding: 16px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  View Your Proposal
                </a>
              </div>

              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                This proposal includes detailed information about the scope, timeline, deliverables, and investment required for your project.
              </p>

              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                If you have any questions or would like to discuss the proposal, please don't hesitate to reach out.
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
                      This proposal link is confidential and intended only for ${proposal.client_name}.
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

function generateResourceDownloadEmailHtml(resourceTitle: string, downloadUrl: string): string {
  const resourceMap: Record<string, { title: string; value: string }> = {
    "the-20-point-ai-audit.pdf": {
      title: "The 20-Point AI Audit",
      value: "Use this checklist to identify the high-ROI workflows that deserve automation. Focus on what matters most."
    },
    "the-homepage-scorecard.pdf": {
      title: "The Homepage Scorecard",
      value: "Grade your site in 5 minutes and find conversion leaks before spending another dollar on ads."
    },
    "5-emails-that-revive-dead-leads.pdf": {
      title: "5 Emails That Revive Dead Leads",
      value: "Copy-paste templates to re-engage cold leads without sounding desperate. Includes 'The 9-Word Email' with 35% response rates."
    },
    "the-lean-ops-blueprint.pdf": {
      title: "The Lean Ops Blueprint",
      value: "Our exact SOPs, tech stack, and hiring triggers. Work 40 hours, not 70."
    }
  };

  const resource = resourceMap[resourceTitle] || { title: resourceTitle, value: "Your free resource guide." };

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
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Your Resource is Ready</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #18181b; font-size: 18px; font-weight: 500;">
                Thanks for downloading!
              </p>

              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Here's your copy of <strong>${resource.title}</strong>. ${resource.value}
              </p>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${downloadUrl}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 16px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  Download Your Guide
                </a>
              </div>

              <div style="margin: 32px 0; padding: 24px; background-color: #fafafa; border-radius: 6px;">
                <p style="margin: 0 0 16px; color: #18181b; font-size: 16px; font-weight: 600;">
                  Want help implementing these strategies?
                </p>
                <p style="margin: 0 0 16px; color: #52525b; font-size: 15px; line-height: 1.6;">
                  We work with service businesses to automate operations, improve websites, and build systems that scale. Book a free consultation to see how we can help.
                </p>
                <a href="https://axrategy.com/contact" style="display: inline-block; background-color: #18181b; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px;">
                  Schedule a Call
                </a>
              </div>

              <div style="margin: 32px 0; padding: 20px; background-color: #ecfdf5; border-radius: 6px; border-left: 4px solid #059669;">
                <p style="margin: 0 0 8px; color: #065f46; font-size: 14px; font-weight: 600;">
                  More Free Resources
                </p>
                <p style="margin: 0; color: #047857; font-size: 14px; line-height: 1.6;">
                  Check out our other guides, templates, and tools at <a href="https://axrategy.com/resources" style="color: #059669; text-decoration: underline;">axrategy.com/resources</a>
                </p>
              </div>

              <p style="margin: 0; color: #52525b; font-size: 15px; line-height: 1.6;">
                If you have any questions, just hit reply. We read every email.
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
                    <p style="margin: 0 0 8px; color: #a1a1aa; font-size: 12px;">
                      You received this email because you downloaded a resource from our website.
                    </p>
                    <p style="margin: 0; color: #a1a1aa; font-size: 12px;">
                      <a href="https://axrategy.com/unsubscribe" style="color: #71717a; text-decoration: underline;">Unsubscribe</a>
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

    // Handle new lead notification
    if (payload.type === "new_lead") {
      const { lead } = payload;

      // Send admin notification
      const adminEmailResult = await sendEmail(
        resendApiKey,
        ADMIN_EMAIL,
        FROM_EMAIL,
        `🎯 New Lead: ${lead.name} - ${lead.service_interest || lead.source}`,
        generateAdminEmailHtml(lead)
      );

      if (!adminEmailResult.success) {
        console.error("Failed to send admin email:", adminEmailResult.error);
      }

      // Send confirmation to user
      const confirmationResult = await sendEmail(
        resendApiKey,
        lead.email,
        FROM_EMAIL,
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

    // Handle new booking notification
    if (payload.type === "new_booking") {
      const { booking } = payload;

      const adminEmailResult = await sendEmail(
        resendApiKey,
        ADMIN_EMAIL,
        FROM_EMAIL,
        `📅 New Booking: ${booking.name} - ${new Date(booking.scheduled_time).toLocaleDateString()}`,
        generateBookingEmailHtml(booking)
      );

      return new Response(
        JSON.stringify({
          success: adminEmailResult.success,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle daily digest
    if (payload.type === "daily_digest") {
      const { stats, date } = payload;

      const adminEmailResult = await sendEmail(
        resendApiKey,
        ADMIN_EMAIL,
        FROM_EMAIL,
        `📊 Daily Digest - ${date}`,
        generateDailyDigestHtml(stats, date)
      );

      return new Response(
        JSON.stringify({
          success: adminEmailResult.success,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle proposal sending
    if (payload.type === "proposal") {
      const { proposal } = payload;
      const proposalUrl = `${req.headers.get("origin") || "https://axrategy.com"}/proposal/${proposal.share_token}`;

      const clientEmailResult = await sendEmail(
        resendApiKey,
        proposal.client_email,
        FROM_EMAIL,
        `Your Proposal from Axrategy - ${proposal.title}`,
        generateProposalEmailHtml(proposal, proposalUrl)
      );

      return new Response(
        JSON.stringify({
          success: clientEmailResult.success,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle resource download
    if (payload.type === "resource_download") {
      const { resource } = payload;
      const baseUrl = req.headers.get("origin") || "https://axrategy.com";
      const downloadUrl = `${baseUrl}/${resource.downloadUrl}`;

      const resourceEmailResult = await sendEmail(
        resendApiKey,
        resource.email,
        FROM_EMAIL,
        `Your Free Guide: ${resource.resourceTitle}`,
        generateResourceDownloadEmailHtml(resource.resourceName, downloadUrl)
      );

      return new Response(
        JSON.stringify({
          success: resourceEmailResult.success,
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
