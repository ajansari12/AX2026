/*
  # Seed Authors and Blog Posts

  This migration populates the blog system with initial content.

  1. Authors
    - Alex Stratton (Founder)
    - Sarah Chen (Head of Ops)
    - Marcus Cole (Design Lead)

  2. Blog Posts
    - 12 articles covering AI, Automation, Strategy, Design, and Growth
    - Each linked to an author
    - All set to published status
    - Various categories for content variety
*/

INSERT INTO authors (id, name, role, avatar_url, bio)
VALUES 
  ('a1000000-0000-0000-0000-000000000001', 'Alex Stratton', 'Founder', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'Founder of Axrategy. Helps service businesses automate their operations.'),
  ('a1000000-0000-0000-0000-000000000002', 'Sarah Chen', 'Head of Ops', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', 'Operations expert specializing in automation workflows.'),
  ('a1000000-0000-0000-0000-000000000003', 'Marcus Cole', 'Design Lead', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', 'Design lead focused on conversion-first web experiences.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO blog_posts (slug, title, excerpt, content, category, read_time, published_date, image_url, author_id, featured, status)
VALUES 
  (
    'ai-sales-agents-guide',
    'How to Respond to Leads in 8 Seconds (Even at 3am)',
    'Harvard found businesses that respond in 5 minutes are 100x more likely to close. Here''s how to respond in 8 seconds.',
    '<p class="lead">For decades, small businesses have faced a dilemma: hire expensive staff to answer phones 24/7, or let leads go to voicemail and die. In 2026, there is a third option.</p><p>Artificial Intelligence has graduated from a buzzword to a utility. Specifically, <strong>AI Voice Agents</strong> and <strong>Chatbots</strong> trained on your specific business data are now capable of handling 80% of front-line interactions with zero fatigue.</p><h2>The "Speed-to-Lead" Crisis</h2><p>Harvard Business Review published a study showing that businesses who respond to leads within 5 minutes are <strong>100x more likely</strong> to connect and qualify them than those who wait 30 minutes. 100x. Not 10%.</p><p>Yet, most service businesses (clinics, contractors, law firms) take hours to reply. Why? Because you are busy working.</p><h2>How AI Agents Actually Work</h2><p>Modern AI agents aren''t the dumb "Press 1 for Sales" bots of the past. They use Large Language Models (LLMs) to understand context, tone, and intent.</p><ul><li><strong>Ingestion:</strong> We feed the AI your website, past emails, and pricing sheets.</li><li><strong>Training:</strong> We give it strict guardrails (e.g., "Never promise a specific legal outcome").</li><li><strong>Deployment:</strong> It sits on your phone line or website widget.</li></ul><h2>The Math: Humans vs. AI</h2><p>Let''s look at the cost of a reception desk vs. an AI solution.</p><ul><li><strong>Human Receptionist:</strong> $45k/year, 9-5 availability, takes vacations, gets sick.</li><li><strong>AI Agent:</strong> ~$200/month, 24/7 availability, handles infinite concurrent calls.</li></ul><p>The goal isn''t to fire your staff. It''s to let your staff focus on high-value work—like managing projects or closing deals—while the AI handles the repetitive intake.</p><h2>Implementation Strategy</h2><p>Don''t try to automate everything at once. Start with "After Hours" handling. Let the AI take messages and book appointments when you are closed. Once you trust it, let it handle overflow during the day.</p>',
    'AI',
    '6 min read',
    '2025-10-12',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    'a1000000-0000-0000-0000-000000000001',
    true,
    'published'
  ),
  (
    'stop-copy-pasting-zapier',
    '5 Automations That Save 10+ Hours/Week (Copy-Paste Ready)',
    'Stop manually entering data. These 5 Zapier workflows pay for themselves in the first week.',
    '<p class="lead">If you find yourself copying and pasting data from an email into a spreadsheet more than once a day, you are burning money.</p><p>Automation isn''t about building robots; it''s about building pipelines for data. When data flows automatically, your business speeds up and errors go down.</p><h2>The 5-Minute Rule</h2><p>The "5-Minute Rule" states that any task taking less than 5 minutes but performed more than 5 times a day should be automated. Why? Because the context switching costs you more than the time itself.</p><h2>Top 3 Workflows to Automate</h2><h3>1. The "New Lead" Sequence</h3><p>When a form is filled on your site, three things should happen instantly:</p><ol><li>Lead added to CRM (HubSpot/Pipedrive).</li><li>SMS confirmation sent to the lead ("Hey, we got your info!").</li><li>Slack notification sent to your sales team.</li></ol><h3>2. The "Review Request" Loop</h3><p>Stop manually asking for Google Reviews. Set up a trigger: When a project is marked "Complete" in your CRM, wait 2 days, then send a polite email asking for feedback with a direct link.</p><h3>3. Invoicing Chasers</h3><p>Nobody likes asking for money. Let the system do it. Set up automated reminders for unpaid invoices at 3 days, 7 days, and 14 days overdue.</p><h2>Tools of the Trade</h2><p>You don''t need custom code for this. Tools like <strong>Zapier</strong> and <strong>Make.com</strong> act as the "glue" between your apps. They are low-code, reliable, and cheap.</p>',
    'Automation',
    '5 min read',
    '2025-10-08',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    'a1000000-0000-0000-0000-000000000002',
    false,
    'published'
  ),
  (
    'speed-to-lead-rule',
    'Why 5 Minutes is Too Slow: The Speed-to-Lead Data',
    'Responding in 60 seconds increases conversion by 300%. Here''s the system that makes it automatic.',
    '<p class="lead">Your website is not a digital brochure. It is a 24/7 salesperson. If it isn''t putting appointments on your calendar, it is failing.</p><p>We audit hundreds of small business websites every year. The vast majority make the same three mistakes that kill conversion rates instantly.</p><h2>Mistake 1: "We" vs. "You"</h2><p>Count how many times your homepage says "We" (We are the best, We have 50 years exp) vs "You" (You will save time, You will get paid). Flip the script. The customer is the hero of the story, not you.</p><h2>Mistake 2: Hidden Calls to Action</h2><p>Don''t make people hunt for the "Book Now" button. It should be in the top right corner (sticky) and repeated in every section. Decision fatigue is real; make the next step obvious.</p><h2>Mistake 3: The Wall of Text</h2><p>Nobody reads on the internet; they scan. If your paragraphs are longer than 3 lines, they are being skipped. Use bullet points, bold text, and icons to break up the flow.</p><h2>The "Trust Battery" Concept</h2><p>Every visitor starts with a "Trust Battery" at 0%. You charge it up with social proof:</p><ul><li><strong>Specific Testimonials:</strong> "Saved me $5k" is better than "Great service".</li><li><strong>Logos:</strong> Show who you''ve worked with.</li><li><strong>Faces:</strong> Show real photos of your team, not stock photos of people shaking hands.</li></ul>',
    'Strategy',
    '4 min read',
    '2025-09-28',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    'a1000000-0000-0000-0000-000000000001',
    false,
    'published'
  ),
  (
    'conversion-first-design',
    'Why "Pretty" Websites Don''t Sell (And What Does)',
    'Your designer made it look amazing. But visitors aren''t booking. Here''s why aesthetics alone fail.',
    '<p class="lead">Your website is not a digital brochure. It is a 24/7 salesperson. If it isn''t putting appointments on your calendar, it is failing.</p><p>We audit hundreds of small business websites every year. The vast majority make the same three mistakes that kill conversion rates instantly.</p><h2>Mistake 1: "We" vs. "You"</h2><p>Count how many times your homepage says "We" (We are the best, We have 50 years exp) vs "You" (You will save time, You will get paid). Flip the script. The customer is the hero of the story, not you.</p><h2>Mistake 2: Hidden Calls to Action</h2><p>Don''t make people hunt for the "Book Now" button. It should be in the top right corner (sticky) and repeated in every section. Decision fatigue is real; make the next step obvious.</p><h2>Mistake 3: The Wall of Text</h2><p>Nobody reads on the internet; they scan. If your paragraphs are longer than 3 lines, they are being skipped. Use bullet points, bold text, and icons to break up the flow.</p><h2>The "Trust Battery" Concept</h2><p>Every visitor starts with a "Trust Battery" at 0%. You charge it up with social proof.</p>',
    'Design',
    '7 min read',
    '2025-09-22',
    'https://images.unsplash.com/photo-1509395062558-41c63a66956e?auto=format&fit=crop&q=80&w=1200',
    'a1000000-0000-0000-0000-000000000003',
    false,
    'published'
  ),
  (
    'reactivate-dead-leads',
    'The 3-Text Sequence That Revives Dead Leads',
    'Your old leads aren''t dead. They''re just dormant. This SMS sequence wakes them up.',
    '<p class="lead">If you find yourself copying and pasting data from an email into a spreadsheet more than once a day, you are burning money.</p><p>Automation isn''t about building robots; it''s about building pipelines for data. When data flows automatically, your business speeds up and errors go down.</p><h2>The 5-Minute Rule</h2><p>The "5-Minute Rule" states that any task taking less than 5 minutes but performed more than 5 times a day should be automated.</p><h2>The "Break-Up" Text</h2><p>After 3 attempts with no response, send: "Hey [Name], I''ve tried reaching out a few times. Should I close your file?" This simple text gets a 35% response rate because it triggers loss aversion.</p><h2>Tools of the Trade</h2><p>You don''t need custom code for this. Tools like <strong>Zapier</strong> and <strong>Make.com</strong> act as the "glue" between your apps. They are low-code, reliable, and cheap.</p>',
    'Growth',
    '4 min read',
    '2025-09-15',
    'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=1200',
    'a1000000-0000-0000-0000-000000000002',
    false,
    'published'
  ),
  (
    'chatgpt-vs-claude',
    'ChatGPT vs. Claude for Sales Copy: Head-to-Head Test',
    'We tested both AI models on real sales emails. The winner might surprise you.',
    '<p class="lead">For decades, small businesses have faced a dilemma: hire expensive staff to answer phones 24/7, or let leads go to voicemail and die. In 2026, there is a third option.</p><p>We ran both ChatGPT-4 and Claude 3 through a rigorous test: writing 50 sales emails for real clients. Here''s what we found.</p><h2>The Test Setup</h2><p>We gave both models the same prompts, same context, same guidelines. Then we sent the emails and tracked open rates, reply rates, and conversion rates.</p><h2>The Results</h2><p>Claude won on reply rates (23% vs 18%), but ChatGPT won on open rates (45% vs 41%). The difference? Claude writes more conversationally, which works better once someone opens. ChatGPT writes punchier subject lines.</p><h2>The Verdict</h2><p>Use ChatGPT for subject lines and headlines. Use Claude for body copy and conversations. Best of both worlds.</p>',
    'AI',
    '8 min read',
    '2025-09-10',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
    'a1000000-0000-0000-0000-000000000001',
    false,
    'published'
  ),
  (
    'automating-boring-stuff',
    'The "Self-Driving" Back Office: Automate Invoices, Onboarding, Reviews',
    'Still sending invoices manually? Here''s the exact stack to automate your entire back office.',
    '<p class="lead">If you find yourself copying and pasting data from an email into a spreadsheet more than once a day, you are burning money.</p><p>Automation isn''t about building robots; it''s about building pipelines for data. When data flows automatically, your business speeds up and errors go down.</p><h2>The 5-Minute Rule</h2><p>The "5-Minute Rule" states that any task taking less than 5 minutes but performed more than 5 times a day should be automated. Why? Because the context switching costs you more than the time itself.</p><h2>Top 3 Workflows to Automate</h2><h3>1. The "New Lead" Sequence</h3><p>When a form is filled on your site, three things should happen instantly:</p><ol><li>Lead added to CRM (HubSpot/Pipedrive).</li><li>SMS confirmation sent to the lead ("Hey, we got your info!").</li><li>Slack notification sent to your sales team.</li></ol><h3>2. The "Review Request" Loop</h3><p>Stop manually asking for Google Reviews. Set up a trigger: When a project is marked "Complete" in your CRM, wait 2 days, then send a polite email asking for feedback with a direct link.</p><h3>3. Invoicing Chasers</h3><p>Nobody likes asking for money. Let the system do it. Set up automated reminders for unpaid invoices at 3 days, 7 days, and 14 days overdue.</p><h2>Tools of the Trade</h2><p>You don''t need custom code for this. Tools like <strong>Zapier</strong> and <strong>Make.com</strong> act as the "glue" between your apps. They are low-code, reliable, and cheap.</p>',
    'Automation',
    '6 min read',
    '2025-08-30',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    'a1000000-0000-0000-0000-000000000002',
    false,
    'published'
  ),
  (
    'client-portal-reduces-churn',
    'Why Clients Cancel (And How a Portal Fixes It)',
    'Clients don''t cancel because of price. They cancel because they feel ignored. Here''s the fix.',
    '<p class="lead">Your website is not a digital brochure. It is a 24/7 salesperson. If it isn''t putting appointments on your calendar, it is failing.</p><p>We audit hundreds of small business websites every year. The vast majority make the same three mistakes that kill conversion rates instantly.</p><h2>Mistake 1: "We" vs. "You"</h2><p>Count how many times your homepage says "We" (We are the best, We have 50 years exp) vs "You" (You will save time, You will get paid). Flip the script. The customer is the hero of the story, not you.</p><h2>Mistake 2: Hidden Calls to Action</h2><p>Don''t make people hunt for the "Book Now" button. It should be in the top right corner (sticky) and repeated in every section. Decision fatigue is real; make the next step obvious.</p><h2>Mistake 3: The Wall of Text</h2><p>Nobody reads on the internet; they scan. If your paragraphs are longer than 3 lines, they are being skipped. Use bullet points, bold text, and icons to break up the flow.</p><h2>The "Trust Battery" Concept</h2><p>Every visitor starts with a "Trust Battery" at 0%. You charge it up with social proof.</p>',
    'Strategy',
    '5 min read',
    '2025-08-24',
    'https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&q=80&w=1200',
    'a1000000-0000-0000-0000-000000000003',
    false,
    'published'
  ),
  (
    'mobile-nav-best-practices',
    '70% of Your Traffic is Mobile. Can They Book in One Thumb Tap?',
    'If your "Book Now" button isn''t reachable with a thumb, you''re losing money. Here''s how to fix it.',
    '<p class="lead">In the fast-paced world of digital business, agility is the ultimate competitive advantage. This article explores key strategies to stay ahead.</p><p>Implementing systematic changes can seem daunting, but the long-term ROI is undeniable. Let''s break down the core components of a successful modern operation.</p><h2>Understanding the Baseline</h2><p>Before you build, you must measure. What is your current cost of acquisition? How many hours are spent on admin? Without these numbers, improvement is just guessing.</p><h2>The Implementation Phase</h2><p>Execution eats strategy for breakfast. Start small. Pick one bottleneck in your business—be it lead intake, invoicing, or project management—and solve it completely before moving to the next.</p><h2>Conclusion</h2><p>The businesses that win in 2026 won''t necessarily be the ones with the best product, but the ones with the best systems to deliver that product efficiently.</p>',
    'Design',
    '4 min read',
    '2025-08-15',
    'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&q=80&w=1200',
    'a1000000-0000-0000-0000-000000000003',
    false,
    'published'
  ),
  (
    'seo-is-dead-for-local',
    'Skip SEO. Run Local Service Ads + Automation Instead.',
    'Waiting 6 months for rankings? Here''s how to get leads this week with paid + automation.',
    '<p class="lead">In the fast-paced world of digital business, agility is the ultimate competitive advantage. This article explores key strategies to stay ahead.</p><p>Implementing systematic changes can seem daunting, but the long-term ROI is undeniable. Let''s break down the core components of a successful modern operation.</p><h2>Understanding the Baseline</h2><p>Before you build, you must measure. What is your current cost of acquisition? How many hours are spent on admin? Without these numbers, improvement is just guessing.</p><h2>The Implementation Phase</h2><p>Execution eats strategy for breakfast. Start small. Pick one bottleneck in your business—be it lead intake, invoicing, or project management—and solve it completely before moving to the next.</p><h2>Conclusion</h2><p>The businesses that win in 2026 won''t necessarily be the ones with the best product, but the ones with the best systems to deliver that product efficiently.</p>',
    'Growth',
    '6 min read',
    '2025-08-10',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    'a1000000-0000-0000-0000-000000000001',
    false,
    'published'
  ),
  (
    'building-second-brain',
    'Document Your SOPs With AI (So You Can Finally Delegate)',
    'Your business knowledge is stuck in your head. Here''s how to extract it in a weekend.',
    '<p class="lead">In the fast-paced world of digital business, agility is the ultimate competitive advantage. This article explores key strategies to stay ahead.</p><p>Implementing systematic changes can seem daunting, but the long-term ROI is undeniable. Let''s break down the core components of a successful modern operation.</p><h2>Understanding the Baseline</h2><p>Before you build, you must measure. What is your current cost of acquisition? How many hours are spent on admin? Without these numbers, improvement is just guessing.</p><h2>The Implementation Phase</h2><p>Execution eats strategy for breakfast. Start small. Pick one bottleneck in your business—be it lead intake, invoicing, or project management—and solve it completely before moving to the next.</p><h2>Conclusion</h2><p>The businesses that win in 2026 won''t necessarily be the ones with the best product, but the ones with the best systems to deliver that product efficiently.</p>',
    'AI',
    '9 min read',
    '2025-08-02',
    'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=1200',
    'a1000000-0000-0000-0000-000000000002',
    false,
    'published'
  ),
  (
    'chaos-to-crm',
    'Spreadsheet to HubSpot in 4 Weeks: The Migration Checklist',
    'Moving to a CRM feels overwhelming. Here''s the exact 4-week plan we use with clients.',
    '<p class="lead">If you find yourself copying and pasting data from an email into a spreadsheet more than once a day, you are burning money.</p><p>Automation isn''t about building robots; it''s about building pipelines for data. When data flows automatically, your business speeds up and errors go down.</p><h2>The 5-Minute Rule</h2><p>The "5-Minute Rule" states that any task taking less than 5 minutes but performed more than 5 times a day should be automated. Why? Because the context switching costs you more than the time itself.</p><h2>Top 3 Workflows to Automate</h2><h3>1. The "New Lead" Sequence</h3><p>When a form is filled on your site, three things should happen instantly:</p><ol><li>Lead added to CRM (HubSpot/Pipedrive).</li><li>SMS confirmation sent to the lead ("Hey, we got your info!").</li><li>Slack notification sent to your sales team.</li></ol><h3>2. The "Review Request" Loop</h3><p>Stop manually asking for Google Reviews. Set up a trigger: When a project is marked "Complete" in your CRM, wait 2 days, then send a polite email asking for feedback with a direct link.</p><h3>3. Invoicing Chasers</h3><p>Nobody likes asking for money. Let the system do it. Set up automated reminders for unpaid invoices at 3 days, 7 days, and 14 days overdue.</p><h2>Tools of the Trade</h2><p>You don''t need custom code for this. Tools like <strong>Zapier</strong> and <strong>Make.com</strong> act as the "glue" between your apps. They are low-code, reliable, and cheap.</p>',
    'Automation',
    '7 min read',
    '2025-07-28',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    'a1000000-0000-0000-0000-000000000002',
    false,
    'published'
  )
ON CONFLICT (slug) DO NOTHING;