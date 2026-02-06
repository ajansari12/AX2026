/*
  # Create Product Previews Table & Seed Email Templates

  1. New Tables
    - `product_previews`
      - `id` (uuid, primary key)
      - `product_slug` (text) - Links to the product this preview belongs to
      - `preview_type` (text) - Type of preview content (email_template, etc.)
      - `title` (text) - Display title for the preview item
      - `subject_line` (text) - Email subject line
      - `preview_text` (text) - Short teaser/description
      - `content` (jsonb, nullable) - Full content (null for locked items)
      - `industry` (text) - Industry this template targets
      - `sequence_name` (text) - Which sequence this belongs to
      - `sequence_position` (integer) - Position within the sequence
      - `sort_order` (integer) - Display ordering
      - `is_locked` (boolean) - Whether this is behind the paywall
      - `created_at` (timestamptz)

  2. Security
    - RLS enabled
    - Public select for all rows (locked rows have null content)
    - Admin insert/update

  3. Seed Data
    - 3 unlocked email templates per industry (general, dental, legal, real_estate)
    - 8 locked templates per industry showing subject line and sequence name only
*/

CREATE TABLE IF NOT EXISTS product_previews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text NOT NULL,
  preview_type text NOT NULL DEFAULT 'email_template',
  title text NOT NULL DEFAULT '',
  subject_line text NOT NULL DEFAULT '',
  preview_text text NOT NULL DEFAULT '',
  content jsonb,
  industry text NOT NULL DEFAULT 'general',
  sequence_name text NOT NULL DEFAULT '',
  sequence_position integer NOT NULL DEFAULT 1,
  sort_order integer NOT NULL DEFAULT 0,
  is_locked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE product_previews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product previews"
  ON product_previews FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert product previews"
  ON product_previews FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can update product previews"
  ON product_previews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
      AND admin_users.is_active = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_product_previews_slug ON product_previews (product_slug);
CREATE INDEX IF NOT EXISTS idx_product_previews_industry ON product_previews (industry);
CREATE INDEX IF NOT EXISTS idx_product_previews_sort ON product_previews (sort_order);

-- Seed: General industry templates (3 unlocked)
INSERT INTO product_previews (product_slug, preview_type, title, subject_line, preview_text, content, industry, sequence_name, sequence_position, sort_order, is_locked)
VALUES
(
  'email-sequence-templates', 'email_template',
  'Welcome & Onboarding', 'Welcome to [Business Name] -- here''s what happens next',
  'Set the right tone from the first interaction.',
  '{"from": "Your Business <hello@yourbusiness.com>", "body": "<p>Hi [First Name],</p><p>Thanks for reaching out! We''re excited to work with you.</p><p>Here''s what you can expect over the next few days:</p><ul><li><strong>Today:</strong> You''ll receive a brief intake form to help us understand your needs</li><li><strong>Within 24 hours:</strong> Our team will review your information and prepare a personalized plan</li><li><strong>Within 48 hours:</strong> You''ll get a follow-up call to discuss next steps</li></ul><p>In the meantime, here are a few resources that might be helpful:</p><ul><li><a href=\"#\">Our FAQ page</a> -- answers to the most common questions</li><li><a href=\"#\">Client success stories</a> -- see what others have achieved</li></ul><p>If you have any questions before then, just reply to this email. We''re here to help.</p><p>Best,<br/>[Your Name]<br/>[Business Name]</p>"}'::jsonb,
  'general', 'Lead Nurture Sequence', 1, 10, false
),
(
  'email-sequence-templates', 'email_template',
  'Appointment Reminder', 'Reminder: Your appointment is tomorrow at [Time]',
  'Reduce no-shows with a friendly, helpful reminder.',
  '{"from": "Your Business <hello@yourbusiness.com>", "body": "<p>Hi [First Name],</p><p>Just a friendly reminder that your appointment is scheduled for:</p><p style=\"padding: 16px; background: #f3f4f6; border-radius: 8px; font-size: 18px;\"><strong>[Day], [Date] at [Time]</strong><br/>[Location or Video Link]</p><p><strong>A few things to prepare:</strong></p><ul><li>Please arrive 10 minutes early</li><li>Bring any relevant documents or information</li><li>Have a list of questions ready -- we want to make the most of our time together</li></ul><p>Need to reschedule? No problem. <a href=\"#\">Click here to pick a new time</a> or reply to this email.</p><p>Looking forward to seeing you!</p><p>Best,<br/>[Your Name]<br/>[Business Name]</p>"}'::jsonb,
  'general', 'Appointment Reminder Sequence', 1, 20, false
),
(
  'email-sequence-templates', 'email_template',
  'Review Request', '[First Name], how did we do?',
  'Turn happy clients into 5-star reviews on autopilot.',
  '{"from": "Your Business <hello@yourbusiness.com>", "body": "<p>Hi [First Name],</p><p>It was great working with you! We hope everything went well.</p><p>We have a quick favor to ask: Would you mind sharing your experience with a brief review? It only takes 60 seconds and helps others find us.</p><p style=\"text-align: center; padding: 20px;\"><a href=\"#\" style=\"display: inline-block; padding: 12px 32px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;\">Leave a Quick Review</a></p><p>Your feedback means the world to us. If there''s anything we could have done better, we''d love to hear that too -- just reply to this email.</p><p>Thank you for choosing [Business Name]!</p><p>Warm regards,<br/>[Your Name]</p>"}'::jsonb,
  'general', 'Post-Service Sequence', 2, 30, false
),

-- General industry: Locked templates (8)
('email-sequence-templates', 'email_template', 'Follow-Up After No Response', 'Quick follow-up: Are you still interested?', 'Re-engage leads who went cold after initial contact.', NULL, 'general', 'Lead Nurture Sequence', 3, 40, true),
('email-sequence-templates', 'email_template', 'Dead Lead Revival', 'It''s been a while -- special offer inside', 'Bring dormant leads back with a compelling offer.', NULL, 'general', 'Dead Lead Revival Sequence', 1, 50, true),
('email-sequence-templates', 'email_template', 'Case Study Share', '[Client Name] achieved [Result] -- here''s how', 'Build trust with social proof and real results.', NULL, 'general', 'Lead Nurture Sequence', 5, 60, true),
('email-sequence-templates', 'email_template', 'Seasonal Re-engagement', '[Season] is coming -- is your business ready?', 'Timely outreach tied to seasonal business cycles.', NULL, 'general', 'Seasonal Campaign', 1, 70, true),
('email-sequence-templates', 'email_template', 'Referral Request', 'Know someone who could use our help?', 'Turn satisfied clients into referral machines.', NULL, 'general', 'Post-Service Sequence', 3, 80, true),
('email-sequence-templates', 'email_template', 'Quote Follow-Up', 'Your quote is ready -- any questions?', 'Nudge prospects who received a quote but haven''t committed.', NULL, 'general', 'Sales Sequence', 2, 90, true),
('email-sequence-templates', 'email_template', 'Onboarding Checklist', 'Your getting-started checklist', 'Help new clients get up to speed quickly.', NULL, 'general', 'Onboarding Sequence', 2, 100, true),
('email-sequence-templates', 'email_template', 'Win-Back Campaign', 'We miss you -- here''s 15% off your next visit', 'Re-engage lapsed customers with a special incentive.', NULL, 'general', 'Win-Back Sequence', 1, 110, true),

-- Dental industry templates (3 unlocked)
(
  'email-sequence-templates', 'email_template',
  'New Patient Welcome', 'Welcome to [Practice Name] -- Your smile is in good hands',
  'Make new patients feel at home from day one.',
  '{"from": "[Practice Name] <hello@yourpractice.com>", "body": "<p>Hi [First Name],</p><p>Welcome to [Practice Name]! We''re thrilled to have you as a new patient.</p><p>Here''s what to expect at your first visit:</p><ul><li><strong>Comprehensive exam</strong> including digital X-rays</li><li><strong>Personalized treatment plan</strong> based on your needs</li><li><strong>Meet our team</strong> -- we''re a friendly bunch!</li></ul><p><strong>Please bring:</strong></p><ul><li>Photo ID and insurance card</li><li>List of current medications</li><li>Any dental records from your previous dentist</li></ul><p>Your appointment is on <strong>[Date] at [Time]</strong>. Need to reschedule? <a href=\"#\">Click here</a>.</p><p>We look forward to seeing your smile!</p><p>Warmly,<br/>The [Practice Name] Team</p>"}'::jsonb,
  'dental', 'New Patient Sequence', 1, 120, false
),
(
  'email-sequence-templates', 'email_template',
  'Cleaning Reminder', 'Time for your 6-month checkup, [First Name]!',
  'Automated recall that keeps the schedule full.',
  '{"from": "[Practice Name] <hello@yourpractice.com>", "body": "<p>Hi [First Name],</p><p>It''s been about 6 months since your last visit -- time flies! Regular cleanings are one of the best things you can do for your oral health.</p><p>We''d love to get you scheduled for your next cleaning and checkup.</p><p style=\"text-align: center; padding: 20px;\"><a href=\"#\" style=\"display: inline-block; padding: 12px 32px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;\">Book My Cleaning</a></p><p><strong>Did you know?</strong> Regular cleanings can help prevent cavities, gum disease, and even detect early signs of oral cancer.</p><p>We have appointments available this week. Book online or call us at [Phone].</p><p>See you soon!</p><p>The [Practice Name] Team</p>"}'::jsonb,
  'dental', 'Recall Sequence', 1, 130, false
),
(
  'email-sequence-templates', 'email_template',
  'Treatment Follow-Up', 'How are you feeling after your procedure?',
  'Show patients you care about their recovery.',
  '{"from": "[Practice Name] <hello@yourpractice.com>", "body": "<p>Hi [First Name],</p><p>We wanted to check in and see how you''re doing after your [procedure] yesterday.</p><p><strong>Quick recovery tips:</strong></p><ul><li>Take any prescribed medication as directed</li><li>Avoid hot foods and drinks for 24 hours</li><li>Stick to soft foods today</li><li>Gently rinse with warm salt water after meals</li></ul><p>Some mild discomfort is normal for the first 24-48 hours. If you experience severe pain, swelling, or bleeding, please call us immediately at [Phone].</p><p>We''re here for you!</p><p>Best,<br/>Dr. [Name] and the [Practice Name] Team</p>"}'::jsonb,
  'dental', 'Post-Treatment Sequence', 1, 140, false
),

-- Dental: Locked templates (8)
('email-sequence-templates', 'email_template', 'Insurance Benefit Reminder', 'Don''t lose your dental benefits -- they expire [Date]', 'Drive year-end bookings by reminding patients about expiring benefits.', NULL, 'dental', 'Seasonal Campaign', 1, 150, true),
('email-sequence-templates', 'email_template', 'Whitening Promotion', 'Brighten your smile this [Season] -- Special offer inside', 'Promote cosmetic services with seasonal campaigns.', NULL, 'dental', 'Promotional Sequence', 1, 160, true),
('email-sequence-templates', 'email_template', 'Missed Appointment', 'We missed you today -- let''s reschedule', 'Recover no-shows with a gentle, no-guilt follow-up.', NULL, 'dental', 'No-Show Sequence', 1, 170, true),
('email-sequence-templates', 'email_template', 'Family Referral', '[First Name], bring the whole family!', 'Encourage family referrals with a group discount.', NULL, 'dental', 'Referral Sequence', 1, 180, true),
('email-sequence-templates', 'email_template', 'Post-Whitening Care', 'Keep your smile bright -- aftercare tips', 'Extend the value of cosmetic procedures.', NULL, 'dental', 'Post-Treatment Sequence', 2, 190, true),
('email-sequence-templates', 'email_template', 'Google Review Request', 'Loved your visit? Share it with others!', 'Build online reputation with targeted review requests.', NULL, 'dental', 'Review Sequence', 1, 200, true),
('email-sequence-templates', 'email_template', 'New Service Announcement', 'Now offering [Service] at [Practice Name]', 'Announce new services to existing patients.', NULL, 'dental', 'Announcement Sequence', 1, 210, true),
('email-sequence-templates', 'email_template', 'Birthday Greeting', 'Happy Birthday, [First Name]! A gift from us', 'Personal touch that builds loyalty.', NULL, 'dental', 'Birthday Sequence', 1, 220, true),

-- Legal industry templates (3 unlocked)
(
  'email-sequence-templates', 'email_template',
  'Consultation Follow-Up', 'Thank you for your consultation with [Firm Name]',
  'Convert consultations into retained clients.',
  '{"from": "[Firm Name] <info@yourfirm.com>", "body": "<p>Dear [First Name],</p><p>Thank you for taking the time to meet with us regarding your [case type] matter.</p><p>As discussed, here is a summary of the key points we covered:</p><ul><li>Your situation and the legal options available</li><li>Recommended next steps and timeline</li><li>Our fee structure and payment options</li></ul><p>We understand that legal matters can be stressful. Our goal is to make the process as smooth and straightforward as possible.</p><p><strong>Next steps:</strong></p><ol><li>Review the attached engagement letter</li><li>Gather the documents we discussed</li><li>Schedule your follow-up meeting</li></ol><p style=\"text-align: center; padding: 20px;\"><a href=\"#\" style=\"display: inline-block; padding: 12px 32px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;\">Schedule Follow-Up</a></p><p>Please don''t hesitate to reach out with any questions.</p><p>Sincerely,<br/>[Attorney Name]<br/>[Firm Name]</p>"}'::jsonb,
  'legal', 'Consultation Sequence', 1, 230, false
),
(
  'email-sequence-templates', 'email_template',
  'Case Update', 'Update on your case: [Case Reference]',
  'Keep clients informed and reduce anxiety calls.',
  '{"from": "[Firm Name] <info@yourfirm.com>", "body": "<p>Dear [First Name],</p><p>I wanted to provide you with an update on your case.</p><p><strong>Current Status:</strong> [Status]</p><p><strong>Recent Activity:</strong></p><ul><li>[Activity 1]</li><li>[Activity 2]</li></ul><p><strong>Next Steps:</strong></p><ul><li>[Next step with timeline]</li><li>[Any action required from client]</li></ul><p>We continue to work diligently on your behalf. If you have any questions or concerns, please don''t hesitate to contact our office.</p><p>Sincerely,<br/>[Attorney Name]<br/>[Firm Name]</p>"}'::jsonb,
  'legal', 'Case Management Sequence', 3, 240, false
),
(
  'email-sequence-templates', 'email_template',
  'Client Intake', 'Getting started: What we need from you',
  'Streamline document collection with clear instructions.',
  '{"from": "[Firm Name] <info@yourfirm.com>", "body": "<p>Dear [First Name],</p><p>Welcome to [Firm Name]. We''re ready to get started on your case. To move forward efficiently, we''ll need a few things from you.</p><p><strong>Documents to Gather:</strong></p><ul><li>Government-issued photo ID</li><li>Any relevant contracts or agreements</li><li>Correspondence related to your matter</li><li>Timeline of key events</li></ul><p><strong>How to Submit:</strong></p><p>You can securely upload documents through our <a href=\"#\">client portal</a>, email them to us, or bring them to your next appointment.</p><p><strong>Deadline:</strong> Please submit by [Date] to keep your case on track.</p><p>If you have any questions about what to include, just reply to this email or call us at [Phone].</p><p>Sincerely,<br/>[Attorney Name]<br/>[Firm Name]</p>"}'::jsonb,
  'legal', 'Onboarding Sequence', 1, 250, false
),

-- Legal: Locked templates (8)
('email-sequence-templates', 'email_template', 'Retainer Renewal', 'Your retainer agreement is up for renewal', 'Automate retainer renewals to maintain revenue.', NULL, 'legal', 'Retention Sequence', 1, 260, true),
('email-sequence-templates', 'email_template', 'Legal Newsletter', '[Month] Legal Update: What you need to know', 'Position the firm as a thought leader.', NULL, 'legal', 'Newsletter Sequence', 1, 270, true),
('email-sequence-templates', 'email_template', 'Testimonial Request', 'Would you recommend [Firm Name]?', 'Collect testimonials from satisfied clients.', NULL, 'legal', 'Review Sequence', 1, 280, true),
('email-sequence-templates', 'email_template', 'Case Resolution', 'Your case has been resolved -- next steps', 'Close cases professionally with clear next steps.', NULL, 'legal', 'Case Management Sequence', 5, 290, true),
('email-sequence-templates', 'email_template', 'Referral Thank You', 'Thank you for referring [Name] to us', 'Reinforce the referral habit with gratitude.', NULL, 'legal', 'Referral Sequence', 1, 300, true),
('email-sequence-templates', 'email_template', 'Consultation No-Show', 'We missed you today -- let''s reschedule', 'Recover consultation no-shows politely.', NULL, 'legal', 'No-Show Sequence', 1, 310, true),
('email-sequence-templates', 'email_template', 'Payment Reminder', 'Invoice [#] is due on [Date]', 'Reduce late payments with automated reminders.', NULL, 'legal', 'Billing Sequence', 1, 320, true),
('email-sequence-templates', 'email_template', 'Annual Check-In', 'Time for your annual legal review', 'Drive repeat business with proactive outreach.', NULL, 'legal', 'Retention Sequence', 2, 330, true),

-- Real Estate templates (3 unlocked)
(
  'email-sequence-templates', 'email_template',
  'New Listing Alert', 'New listing alert: [Property Address]',
  'Keep buyers engaged with personalized property alerts.',
  '{"from": "[Agent Name] <agent@realestate.com>", "body": "<p>Hi [First Name],</p><p>I just came across a property that matches what you''re looking for!</p><p style=\"padding: 16px; background: #f3f4f6; border-radius: 12px;\"><strong>[Property Address]</strong><br/>[Bedrooms] BD | [Bathrooms] BA | [Sqft] sq ft<br/><strong>$[Price]</strong></p><p><strong>Why I think you''ll love it:</strong></p><ul><li>[Feature 1 matching their criteria]</li><li>[Feature 2 matching their criteria]</li><li>[Neighborhood highlight]</li></ul><p>Properties in this area are moving fast. Want to schedule a showing?</p><p style=\"text-align: center; padding: 20px;\"><a href=\"#\" style=\"display: inline-block; padding: 12px 32px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;\">Schedule a Showing</a></p><p>Talk soon,<br/>[Agent Name]<br/>[Brokerage]</p>"}'::jsonb,
  'real_estate', 'Buyer Nurture Sequence', 2, 340, false
),
(
  'email-sequence-templates', 'email_template',
  'Open House Invite', 'You''re invited: Open House at [Address]',
  'Drive foot traffic to open houses with targeted invites.',
  '{"from": "[Agent Name] <agent@realestate.com>", "body": "<p>Hi [First Name],</p><p>You''re invited to an exclusive open house this weekend!</p><p style=\"padding: 16px; background: #f3f4f6; border-radius: 12px;\"><strong>Open House</strong><br/>[Property Address]<br/>[Day], [Date] | [Time Range]<br/><strong>$[Price]</strong></p><p><strong>What to expect:</strong></p><ul><li>Tour the entire property at your own pace</li><li>Ask questions directly to the listing agent</li><li>Get neighborhood and school information</li><li>Complimentary refreshments</li></ul><p>Can''t make it? I''m happy to set up a private showing at a time that works for you.</p><p style=\"text-align: center; padding: 20px;\"><a href=\"#\" style=\"display: inline-block; padding: 12px 32px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;\">RSVP for Open House</a></p><p>See you there!</p><p>[Agent Name]<br/>[Brokerage]</p>"}'::jsonb,
  'real_estate', 'Open House Sequence', 1, 350, false
),
(
  'email-sequence-templates', 'email_template',
  'Post-Closing Thank You', 'Congratulations on your new home!',
  'Build referral relationships starting from day one.',
  '{"from": "[Agent Name] <agent@realestate.com>", "body": "<p>Hi [First Name],</p><p>Congratulations -- you''re officially a homeowner! It was an absolute pleasure helping you find your perfect home at [Address].</p><p><strong>A few helpful resources for your first weeks:</strong></p><ul><li><a href=\"#\">New homeowner checklist</a> -- utilities, address changes, and more</li><li><a href=\"#\">Local service providers</a> -- trusted contractors, cleaners, and handymen</li><li><a href=\"#\">Neighborhood guide</a> -- restaurants, parks, and hidden gems</li></ul><p>I''m always here if you need anything -- whether it''s a contractor recommendation or just someone to answer a real estate question.</p><p>And if you know anyone else looking to buy or sell, I''d love the referral. The best compliment I can receive is a recommendation to someone you care about.</p><p>Enjoy your new home!</p><p>Warmly,<br/>[Agent Name]<br/>[Brokerage]</p>"}'::jsonb,
  'real_estate', 'Post-Closing Sequence', 1, 360, false
),

-- Real Estate: Locked templates (8)
('email-sequence-templates', 'email_template', 'Market Update', '[Month] Market Update: [Area] Real Estate Trends', 'Position yourself as the local market expert.', NULL, 'real_estate', 'Newsletter Sequence', 1, 370, true),
('email-sequence-templates', 'email_template', 'Buyer Pre-Approval', 'Get pre-approved in 15 minutes', 'Move leads from browsing to buying.', NULL, 'real_estate', 'Buyer Nurture Sequence', 1, 380, true),
('email-sequence-templates', 'email_template', 'Listing Presentation Follow-Up', 'Here''s your custom marketing plan', 'Win more listings with professional follow-ups.', NULL, 'real_estate', 'Seller Sequence', 2, 390, true),
('email-sequence-templates', 'email_template', 'Price Reduction Alert', 'Price reduced: [Address] is now $[Price]', 'Re-engage interested buyers with price updates.', NULL, 'real_estate', 'Buyer Nurture Sequence', 4, 400, true),
('email-sequence-templates', 'email_template', 'Home Anniversary', 'Happy home-iversary, [First Name]!', 'Stay top-of-mind with past clients annually.', NULL, 'real_estate', 'Retention Sequence', 1, 410, true),
('email-sequence-templates', 'email_template', 'Home Valuation Offer', 'Curious what your home is worth in today''s market?', 'Generate seller leads with free valuations.', NULL, 'real_estate', 'Seller Lead Gen Sequence', 1, 420, true),
('email-sequence-templates', 'email_template', 'Showing Feedback', 'What did you think of [Address]?', 'Gather buyer feedback to improve matching.', NULL, 'real_estate', 'Buyer Nurture Sequence', 3, 430, true),
('email-sequence-templates', 'email_template', 'Referral Request', 'Know anyone looking to buy or sell?', 'Systematically ask for referrals from past clients.', NULL, 'real_estate', 'Referral Sequence', 1, 440, true)

ON CONFLICT DO NOTHING;
