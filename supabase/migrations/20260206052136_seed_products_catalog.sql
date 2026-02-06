/*
  # Seed Products Catalog

  Populates the products table with initial product offerings across three categories:
  
  1. Micro Products (digital, one-time purchase)
    - Website Teardown Report ($297)
    - Industry Automation Playbook ($67)
    - Email Sequence Template Pack ($37)
    - DIY Bundle ($197)

  2. Standalone Subscriptions (monthly)
    - AI Chat Widget ($199/mo)
    - Appointment Reminder System ($99/mo)
    - Review Generation Autopilot ($79/mo)
    - Speed-to-Lead Auto-Responder ($99/mo)

  3. Productized Services (fixed-scope, one-time)
    - Google Business Profile Optimization ($497)
    - CRM Quick-Start ($997)
    - Landing Page Sprint ($1,497)
    - Analytics Setup ($497)
*/

INSERT INTO products (slug, name, tagline, description, type, category, price_cents, price_display, setup_fee_cents, billing_period, industry, icon, features, proof_point, cta_text, sort_order, is_active, is_featured)
VALUES
-- Micro Products
(
  'website-teardown-report',
  'Website Teardown Report',
  'Find out exactly why your website isn''t converting.',
  'A detailed 20+ page report analyzing your website''s conversion bottlenecks, UX issues, SEO gaps, and mobile experience. Includes a video walkthrough and prioritized action plan. Delivered within 48 hours.',
  'digital',
  'micro_product',
  29700,
  '$297',
  0,
  'one_time',
  'all',
  'FileSearch',
  '["20+ page PDF report with screenshots", "15-minute video walkthrough of findings", "Prioritized action plan (quick wins first)", "Mobile & desktop UX analysis", "SEO health check", "Competitor comparison", "Conversion rate benchmarks for your industry"]'::jsonb,
  'Every report naturally identifies $3K-$15K in missed revenue opportunities.',
  'Get My Teardown',
  10,
  true,
  true
),
(
  'automation-playbook',
  'Industry Automation Playbook',
  'Step-by-step guide to automate your business operations.',
  'A comprehensive playbook tailored to your industry with exact tool recommendations, workflow diagrams, and copy-paste templates. Stop paying for expensive consultants to tell you what tools to use.',
  'digital',
  'micro_product',
  6700,
  '$67',
  0,
  'one_time',
  'all',
  'BookOpen',
  '["Industry-specific workflow diagrams", "Tool comparison matrix (with pricing)", "Copy-paste email and SMS templates", "Step-by-step Zapier/Make.com setup guides", "ROI calculator spreadsheet", "30-day implementation timeline"]'::jsonb,
  'Based on the exact systems we build for our $7,500+ clients.',
  'Get the Playbook',
  20,
  true,
  false
),
(
  'email-sequence-templates',
  'Email Sequence Template Pack',
  '15 copy-paste email sequences that bring leads back to life.',
  'Professionally written email sequences for lead nurturing, appointment reminders, review requests, re-engagement, and post-service follow-ups. Just fill in your business details and load them into your email tool.',
  'digital',
  'micro_product',
  3700,
  '$37',
  0,
  'one_time',
  'all',
  'Mail',
  '["15 complete email sequences (75+ emails)", "Lead nurture sequence (7 emails)", "Dead lead revival sequence (5 emails)", "Post-service review request sequence", "Appointment reminder sequence", "Seasonal re-engagement campaigns", "Subject line variations for A/B testing"]'::jsonb,
  'Our clients see 15-30% of "dead" leads respond within 7 days of sending the revival sequence.',
  'Get the Templates',
  30,
  true,
  false
),
(
  'diy-automation-bundle',
  'DIY Automation Bundle',
  'Everything you need to automate your business yourself.',
  'All playbooks, all template packs, plus bonus tools and calculators. The complete toolkit for business owners who want to set up their own systems before graduating to done-for-you services.',
  'digital',
  'micro_product',
  19700,
  '$197',
  0,
  'one_time',
  'all',
  'Package',
  '["All industry automation playbooks", "All email sequence template packs", "ROI calculator spreadsheet", "Tool comparison & selection guide", "CRM setup checklist", "Quarterly business review template", "Priority email support for 30 days"]'::jsonb,
  'Save $200+ vs. buying everything separately.',
  'Get the Bundle',
  40,
  true,
  true
),

-- Standalone Subscriptions
(
  'ai-chat-widget',
  'AI Chat Widget',
  'An AI assistant on your website that books appointments 24/7.',
  'A fully trained AI chatbot embedded on your website that answers visitor questions, qualifies leads, and books appointments directly on your calendar. Pre-trained for your industry with your business details, hours, and services.',
  'subscription',
  'standalone_subscription',
  19900,
  '$199/mo',
  0,
  'monthly',
  'all',
  'MessageSquare',
  '["AI trained on YOUR business info", "Books directly into your calendar", "Qualifies leads before they reach you", "Hands off complex questions via text/email", "Works 24/7/365 including holidays", "Monthly performance reports", "Unlimited conversations", "Customizable appearance to match your brand"]'::jsonb,
  'Harrison & Co. Law closed 12 new cases in 30 days after adding AI chat - estimated $180K+ in new revenue.',
  'Start Free Trial',
  50,
  true,
  true
),
(
  'appointment-reminders',
  'Appointment Reminder System',
  'Automated reminders that cut no-shows by 30%.',
  'Automatic SMS and email reminders sent at 48 hours, 24 hours, and 2 hours before every appointment. One-tap confirm/reschedule. When someone cancels, the system automatically texts your waitlist to fill the slot.',
  'subscription',
  'standalone_subscription',
  9900,
  '$99/mo',
  0,
  'monthly',
  'all',
  'Bell',
  '["SMS + email reminders at 48h, 24h, 2h", "One-tap confirm or reschedule", "Automatic waitlist fill on cancellation", "Customizable message templates", "No-show tracking dashboard", "Calendar sync (Google, Outlook, Calendly)", "Unlimited appointments"]'::jsonb,
  'Apex Dental reduced no-shows by 30% and saved $32K/year with automated reminders.',
  'Start Free Trial',
  60,
  true,
  true
),
(
  'review-generation',
  'Review Generation Autopilot',
  'Get more 5-star Google reviews on autopilot.',
  'Automatically sends review requests 2 days after service completion. Happy customers get directed to Google Reviews. Unhappy customers get routed to private feedback so you can fix issues before they go public.',
  'subscription',
  'standalone_subscription',
  7900,
  '$79/mo',
  0,
  'monthly',
  'all',
  'Star',
  '["Automatic review request after service", "Smart routing: happy -> Google, unhappy -> private", "Pre-written templates per industry", "SMS + email delivery", "Review monitoring dashboard", "Response templates for reviews", "Monthly review growth report"]'::jsonb,
  'Businesses using automated review requests see 3-5x more Google reviews within 60 days.',
  'Start Free Trial',
  70,
  true,
  false
),
(
  'speed-to-lead',
  'Speed-to-Lead Auto-Responder',
  'Respond to every web lead in under 60 seconds.',
  'When any form is submitted on your website, the lead gets an instant SMS + email within 60 seconds. You get a text notification. If they don''t respond, a 5-touch follow-up sequence runs automatically over the next 14 days.',
  'subscription',
  'standalone_subscription',
  9900,
  '$99/mo',
  0,
  'monthly',
  'all',
  'Zap',
  '["Instant SMS + email to leads (under 60 seconds)", "Text notification to you for every new lead", "5-touch follow-up sequence over 14 days", "Works with any web form", "Lead tracking dashboard", "A/B tested message templates", "Industry-specific follow-up sequences"]'::jsonb,
  'Prestige Properties generated $2M in new business in 90 days with speed-to-lead automation.',
  'Start Free Trial',
  80,
  true,
  true
),

-- Productized Services
(
  'gbp-optimization',
  'Google Business Profile Optimization',
  'Get found by local customers searching for your services.',
  'Complete optimization of your Google Business Profile including category selection, photo strategy, review response templates, and local SEO setup. Everything you need to rank higher in Google Maps and local search.',
  'productized_service',
  'productized_service',
  49700,
  '$497',
  0,
  'one_time',
  'all',
  'MapPin',
  '["Full profile audit and optimization", "Category and attribute setup", "Photo strategy with recommendations", "Review response templates", "Google Posts content calendar (3 months)", "Local SEO keyword research", "Competitor analysis", "30-minute strategy walkthrough"]'::jsonb,
  'Properly optimized GBP listings see 2-3x more calls and direction requests within 30 days.',
  'Optimize My Profile',
  90,
  true,
  false
),
(
  'crm-quickstart',
  'CRM Quick-Start',
  'Go from spreadsheets to a real CRM in one week.',
  'We set up your CRM (HubSpot, Pipedrive, or GoHighLevel), migrate up to 500 contacts, configure 3 deal stages that match your sales process, and give you a 1-hour training session. No more tracking leads in your head.',
  'productized_service',
  'productized_service',
  99700,
  '$997',
  0,
  'one_time',
  'all',
  'Database',
  '["CRM selection consultation", "Account setup and configuration", "Migrate up to 500 contacts", "3 custom deal stages", "Email templates for outreach", "Automated follow-up reminders", "1-hour live training session", "30-day email support"]'::jsonb,
  'Businesses with organized CRMs close 20-30% more deals by never forgetting to follow up.',
  'Set Up My CRM',
  100,
  true,
  true
),
(
  'landing-page-sprint',
  'Landing Page Sprint',
  'A high-converting landing page delivered in 5 business days.',
  'One professionally designed, conversion-optimized landing page with compelling copy, booking integration, and mobile-first design. Perfect for a specific service, campaign, or lead magnet. Delivered in 5 business days or less.',
  'productized_service',
  'productized_service',
  149700,
  '$1,497',
  0,
  'one_time',
  'all',
  'Layout',
  '["Custom responsive design", "Conversion-focused copywriting", "Booking/calendar integration", "Mobile-first optimization", "Contact form with email notification", "Basic SEO setup", "2 rounds of revisions", "Delivered in 5 business days"]'::jsonb,
  'Elena Ross Consulting tripled her project fees after getting a professional web presence.',
  'Start My Sprint',
  110,
  true,
  false
),
(
  'analytics-setup',
  'Analytics Setup',
  'Finally know which marketing is actually working.',
  'Proper Google Analytics 4 setup with conversion tracking for forms, calls, and bookings. Source attribution so you see where leads come from. A simple dashboard with the 5 numbers that matter, plus a 30-minute walkthrough.',
  'productized_service',
  'productized_service',
  49700,
  '$497',
  0,
  'one_time',
  'all',
  'BarChart',
  '["Google Analytics 4 setup (done right)", "Conversion tracking for forms, calls, bookings", "Traffic source attribution", "Simple dashboard with 5 key metrics", "Monthly comparison view", "30-minute video walkthrough", "Setup documentation for your team"]'::jsonb,
  'Most businesses discover 30-40% of their ad spend is wasted once they set up proper tracking.',
  'Set Up My Analytics',
  120,
  true,
  false
)
ON CONFLICT (slug) DO NOTHING;
