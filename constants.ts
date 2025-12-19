
import { Service, CaseStudy, PricingTier, BlogPost, PricingComparisonCategory, ProcessStep } from './types';

// ... (Existing exports for SERVICES, CASE_STUDIES, PRICING_TIERS, etc. remain unchanged. I will reproduce them to ensure file integrity, but with the new BLOG_POSTS at the end.)

export const SERVICES: Service[] = [
  {
    id: '1',
    slug: 'ai-assistants',
    title: 'AI Sales Agents',
    description: 'Never lose a lead to voicemail again. An AI employee that responds in seconds, qualifies prospects, and books calls directly on your calendar.',
    outcome: 'Book 10-15 extra calls per month on autopilot.',
    icon: 'Bot',
    tags: ['Clinics', 'Agencies', 'Realtors'],
    features: [
      'Trained on your actual business data',
      'Responds in under 10 seconds, 24/7',
      'Syncs with your calendar automatically',
      'Matches your brand voice exactly',
      'Handles objections and pricing questions',
      'Escalates complex issues to humans'
    ],
    timeline: '2 - 3 Weeks',
    whoIsItFor: 'Service businesses losing deals because leads go to voicemail or wait hours for a reply.',
    faq: [
      { q: 'Does it sound like a robot?', a: 'No. We train it on your past emails and calls so it sounds exactly like your best team member.' },
      { q: 'Can it book appointments?', a: 'Yes. It checks your real-time availability and books directly into your calendar. No double-booking.' },
      { q: 'What if it doesn\'t know the answer?', a: 'It takes the caller\'s info and flags it for your team. You see every interaction.' }
    ]
  },
  {
    id: '2',
    slug: 'automation-systems',
    title: 'Workflow Automation',
    description: 'Stop copying data between apps. Every form, every lead, every invoice flows automatically to the right place.',
    outcome: 'Save $1,200/month in labor costs. Zero dropped balls.',
    icon: 'Workflow',
    tags: ['Service Biz', 'Contractors'],
    features: [
      'Auto-sync leads to CRM instantly',
      'Speed-to-lead SMS in under 60 seconds',
      'Automated invoicing and reminders',
      'Google Review request sequences',
      'Team alerts in Slack/Teams',
      'Zero manual data entry'
    ],
    timeline: '3 - 5 Weeks',
    whoIsItFor: 'Teams drowning in admin work or losing deals because they follow up too slowly.',
    faq: [
      { q: 'Do I need new software?', a: 'Usually just Zapier or Make ($20-50/mo). We optimize for the cheapest stack that works.' },
      { q: 'Is it secure?', a: 'Yes. Enterprise-grade encryption. We never store your customer data.' },
      { q: 'Can you automate paper forms?', a: 'Yes. We digitize intake forms that auto-fill your database. No more data entry.' }
    ]
  },
  {
    id: '3',
    slug: 'websites-landing-pages',
    title: 'High-Converting Websites',
    description: 'Your website should book calls, not just look nice. We build sites that turn visitors into revenue.',
    outcome: 'Turn 3% of visitors into leads. Industry average is 1.5%.',
    icon: 'Layout',
    tags: ['Local Biz', 'Consultants'],
    features: [
      'Conversion copy that sells (not filler)',
      'Mobile-perfect responsive design',
      'SEO foundation built in',
      'Fast loading (90+ performance score)',
      'Easy for you to edit yourself',
      'Integrated booking and lead forms'
    ],
    timeline: '4 - 6 Weeks',
    whoIsItFor: 'Businesses with sites that look dated, load slowly, or simply don\'t generate leads.',
    faq: [
      { q: 'Do I own the website?', a: '100%. You own the code, domain, and all assets. No hostage fees. No monthly ransom.' },
      { q: 'Do you write the text?', a: 'Yes. Our conversion copywriters write every word. You just approve it.' },
      { q: 'What platform do you use?', a: 'Webflow or WordPress for easy editing. Custom code for complex needs.' }
    ]
  },
  {
    id: '4',
    slug: 'app-development',
    title: 'Client Portals & Apps',
    description: 'Stop managing clients via email chains. Give them a professional space to check status, sign docs, and pay invoices.',
    outcome: 'Premium client experience. 20% less churn.',
    icon: 'Smartphone',
    tags: ['Law Firms', 'Coaching'],
    features: [
      'Secure client login area',
      'File sharing and e-signatures',
      'Real-time project status tracking',
      'Subscription billing integration',
      'Admin dashboard for your team',
      'Automated status notifications'
    ],
    timeline: '8 - 12 Weeks',
    whoIsItFor: 'High-ticket service providers tired of "just checking in" emails and messy file sharing.',
    faq: [
      { q: 'Is this a mobile app?', a: 'We build Progressive Web Apps (PWAs). Works on phones and desktops. No app store approval needed.' },
      { q: 'How do you handle updates?', a: 'Maintenance package available for security patches and feature additions.' }
    ]
  },
  {
    id: '5',
    slug: 'crm-setup',
    title: 'CRM Implementation',
    description: 'Your sales team is forgetting to follow up. We set up a system that reminds them automatically and tracks every deal.',
    outcome: 'Close 20% more deals from your existing pipeline.',
    icon: 'Database',
    tags: ['Sales Teams', 'B2B'],
    features: [
      'Pipeline stage design',
      'Importing messy spreadsheet data',
      'One-click email templates',
      'Sales performance dashboards',
      'Team training workshops',
      'Automated task reminders'
    ],
    timeline: '2 - 4 Weeks',
    whoIsItFor: 'Sales teams using spreadsheets, sticky notes, or a CRM that nobody actually opens.',
    faq: [
      { q: 'Which CRM do you recommend?', a: 'HubSpot for ease of use. Pipedrive for pure sales focus. We help you decide based on your workflow.' },
      { q: 'Will my team actually use it?', a: 'Yes. Because we set it up to save them time, not just track them. Training included.' }
    ]
  },
  {
    id: '6',
    slug: 'analytics-optimization',
    title: 'Analytics & Tracking',
    description: 'Stop guessing which ads work. Know exactly which channel drives revenue and which is burning cash.',
    outcome: 'Double down on what works. Cut what doesn\'t.',
    icon: 'BarChart',
    tags: ['E-commerce', 'SaaS'],
    features: [
      'Google Analytics 4 configuration',
      'Conversion event tracking',
      'ROI dashboards (Looker Studio)',
      'User behavior heatmaps',
      'A/B testing setup',
      'Attribution modeling'
    ],
    timeline: '1 - 2 Weeks',
    whoIsItFor: 'Businesses spending on ads with no idea which campaigns actually make money.',
    faq: [
      { q: 'Does this help with SEO?', a: 'Indirectly. Understanding user behavior helps us double down on content that resonates.' },
      { q: 'Is this a monthly fee?', a: 'One-time setup, or monthly retainer if you want us actively optimizing your numbers.' }
    ]
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    slug: 'dental-clinic-automation',
    client: 'Apex Dental Studio',
    industry: 'Healthcare',
    title: 'How Apex Dental Recovered $32K/Month in Lost Revenue',
    summary: '4 hours of daily confirmation calls. 15% weekly no-show rate. $8,000/week walking out the door. We fixed it in 3 weeks.',
    problem: 'Apex Dental was bleeding $32k monthly to last-minute cancellations. Their front desk team spent 4 hours every single day manually calling patients to confirm appointments, often leaving voicemails that were ignored. When patients did cancel, there was no system to fill the slot.',
    solution: 'We built a custom automation system using Twilio and their practice management software. Patients now receive intelligent SMS reminders 72, 24, and 2 hours before appointments, with a one-tap confirmation link. Cancellations trigger an automatic waitlist notification that fills 60% of open slots within the hour.',
    outcome: '30% Reduction in No-Shows',
    outcomeDetails: [
      '15+ hours of weekly admin time saved',
      '98% patient intake form completion before arrival',
      'Waitlist automation fills 60% of cancellations instantly'
    ],
    image: 'https://picsum.photos/seed/dental/1200/800',
    tags: ['Automation', 'Website'],
    stack: ['React', 'Make.com', 'Twilio', 'HubSpot']
  },
  {
    id: '2',
    slug: 'legal-firm-lead-gen',
    client: 'Harrison & Co. Law',
    industry: 'Legal',
    title: 'From 4-Hour Response Time to 10 Seconds: $180K in New Cases',
    summary: 'High-value personal injury leads were going to voicemail while attorneys sat in court. We deployed an AI that never sleeps.',
    problem: 'Harrison & Co. estimated they were losing $50k/month in potential case fees because leads went cold. Attorneys were in depositions and court, unable to answer phones. By the time they called back, prospects had already hired a competitor who picked up faster.',
    solution: 'We trained a custom AI agent on the firm\'s intake criteria and deployed it on their website and phone line. The agent qualifies potential clients in real-time, asks the right questions, and books consultations directly on the senior partner\'s calendar. Complex cases get flagged for human follow-up within 15 minutes.',
    outcome: '2x Qualified Consultations',
    outcomeDetails: [
      'Response time: 4 hours to 10 seconds',
      'Zero spam calls reaching the attorneys',
      '$180k in new case value attributed to AI in Month 1'
    ],
    image: 'https://picsum.photos/seed/law/1200/800',
    tags: ['AI Assistant', 'CRM'],
    stack: ['OpenAI API', 'Vapi.ai', 'Airtable', 'Webflow']
  },
  {
    id: '3',
    slug: 'construction-crm',
    client: 'Urban Build Group',
    industry: 'Construction',
    title: 'Zero Change Order Disputes: How a Client Portal Saved 12hr/Week',
    summary: 'Managing 12 custom home builds via text messages was chaos. Disputes over "he said, she said" were costing thousands.',
    problem: 'Urban Build was managing 12 active custom home builds via text messages and spreadsheets. Change orders were getting lost in message threads, leading to expensive disputes. Clients felt out of the loop and kept calling for updates. The owner spent 12+ hours weekly on client communication alone.',
    solution: 'We developed a Progressive Web App (PWA) Client Portal. Site supervisors upload daily photos and progress notes from their phones in 2 minutes. Clients log in to view real-time progress, approve change orders with a digital signature, and pay invoices. Everything is timestamped and documented.',
    outcome: '40% Higher Client Satisfaction',
    outcomeDetails: [
      'Change order disputes: near zero',
      '12 hours of owner admin time saved per week',
      'Invoice payment: 2 days avg (down from 14)'
    ],
    image: 'https://picsum.photos/seed/construct/1200/800',
    tags: ['App', 'Automation'],
    stack: ['Next.js', 'Supabase', 'Stripe', 'Tailwind']
  },
  {
    id: '4',
    slug: 'consultant-authority-site',
    client: 'Elena Ross Consulting',
    industry: 'Consulting',
    title: 'How a Website Redesign Tripled Her Retainer Fees',
    summary: 'Her DIY site screamed "cheap." Prospects haggled on price despite her 15 years of expertise. We fixed the perception problem.',
    problem: 'Elena is a top-tier HR consultant with 15 years of experience. But her DIY website looked like a beginner\'s portfolio. She was attracting $3k clients who haggled and took forever to close, when she should have been commanding $10k+ retainers.',
    solution: 'We executed a complete "Authority Overhaul." Premium editorial-style design. Methodology-focused positioning. Strategic case studies. We also built an "HR Audit" lead magnet funnel that pre-sells her expertise before prospects even get on a call.',
    outcome: '3x Increase in Deal Size',
    outcomeDetails: [
      'Average retainer: $3k to $9k',
      'Email list: +400 subscribers in 2 months',
      'Calendar: booked 6 weeks out'
    ],
    image: 'https://picsum.photos/seed/consulting/1200/800',
    tags: ['Website', 'Automation'],
    stack: ['Webflow', 'ConvertKit', 'Framer Motion']
  },
  {
    id: '5',
    slug: 'realtor-speed-to-lead',
    client: 'Prestige Properties',
    industry: 'Real Estate',
    title: '$2M Pipeline in 90 Days: The Speed-to-Lead System',
    summary: 'Spending thousands on Zillow leads with under 1% conversion. The problem was not the leads. It was the follow-up.',
    problem: 'Prestige Properties was spending $8k/month on Zillow and Facebook leads, but conversion sat below 1%. Agents were too busy showing homes to call leads within the critical 5-minute window. By the time they followed up, prospects had already talked to 3 other agents.',
    solution: 'We implemented a "Speed-to-Lead" automation system. New leads instantly receive a personalized SMS and email within 60 seconds. If they don\'t reply, a 12-month nurture sequence kicks in automatically with market updates and check-ins. The AI qualifies hot leads and books showings directly.',
    outcome: '$2M Pipeline Added in 90 Days',
    outcomeDetails: [
      'Lead response: under 60 seconds (automated)',
      'Reactivated 15 "dead" leads from old database',
      'Agent data entry: 0 minutes'
    ],
    image: 'https://picsum.photos/seed/realty/1200/800',
    tags: ['Automation', 'AI Assistant', 'CRM'],
    stack: ['GoHighLevel', 'Zapier', 'OpenAI']
  },
  {
    id: '6',
    slug: 'ecommerce-cro',
    client: 'Lumina Home Goods',
    industry: 'Ecommerce',
    title: '25% Revenue Lift: Fixing a 75% Cart Abandonment Problem',
    summary: '50k Instagram followers. Great traffic. 75% cart abandonment. No system to bring buyers back. We changed that.',
    problem: 'Lumina had a beautiful Instagram following and solid traffic, but a brutal 75% cart abandonment rate. Customers were adding products to cart and vanishing. There was zero system to bring them back, and no post-purchase follow-up to drive repeat sales.',
    solution: 'We rebuilt the Shopify theme for speed and mobile checkout UX. Then we set up a comprehensive Klaviyo email system: Abandoned Cart (sent at 1hr, 24hr, 72hr), Browse Abandonment, and Post-Purchase upsell flows. Every abandoned cart now gets 3 chances to convert.',
    outcome: '25% Lift in Total Revenue',
    outcomeDetails: [
      'Cart abandonment: 75% to 55%',
      'Email now drives 30% of total revenue',
      'Repeat customer rate: +15%'
    ],
    image: 'https://picsum.photos/seed/decor/1200/800',
    tags: ['Website', 'Automation'],
    stack: ['Shopify', 'Klaviyo', 'Liquid']
  }
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    price: '$3,500+',
    description: 'Your site looks like 2015. Leads bounce before they even read your name. Fix that.',
    features: [
      '5-Page Conversion Website',
      'Lead Capture Forms',
      'Google My Business Optimization',
      'Mobile-Perfect Responsive Design',
      '30 Days Post-Launch Support'
    ],
    ctaText: 'Start Here',
    isPopular: false
  },
  {
    name: 'Growth',
    price: '$7,500+',
    description: 'For teams ready to stop chasing leads manually and start closing deals on autopilot.',
    features: [
      'Unlimited Page Web System',
      'AI Sales Agent (24/7 Lead Response)',
      'CRM Setup & Data Migration',
      'Email/SMS Automation Workflows',
      '90 Days Post-Launch Support'
    ],
    ctaText: 'Get the System',
    isPopular: true
  },
  {
    name: 'Scale',
    price: 'Custom',
    description: 'Custom portals, complex integrations, and AI operations for established businesses.',
    features: [
      'Custom Web App / Client Portal',
      'Advanced AI Operations Models',
      'Enterprise API Integrations',
      'Dedicated Success Manager',
      'SLA & Priority Support'
    ],
    ctaText: 'Contact Sales',
    isPopular: false
  }
];

export const PRICING_COMPARISON_DATA: PricingComparisonCategory[] = [
  {
    category: 'Strategy & Design',
    items: [
      { label: 'Conversion Strategy Audit', tier1: true, tier2: true, tier3: true },
      { label: 'Custom Brand Identity', tier1: 'Basic', tier2: 'Full Suite', tier3: 'Enterprise' },
      { label: 'Copywriting', tier1: 'Home & About', tier2: 'All Pages', tier3: 'All Pages + Blog' },
      { label: 'Asset Ownership', tier1: true, tier2: true, tier3: true },
    ]
  },
  {
    category: 'Technical Build',
    items: [
      { label: 'Number of Pages', tier1: 'Up to 5', tier2: 'Unlimited', tier3: 'Unlimited' },
      { label: 'CMS Training', tier1: true, tier2: true, tier3: true },
      { label: 'Advanced SEO Setup', tier1: false, tier2: true, tier3: true },
      { label: 'Custom Web App / Portal', tier1: false, tier2: false, tier3: true },
    ]
  },
  {
    category: 'AI & Automation',
    items: [
      { label: 'Lead Capture Sync', tier1: true, tier2: true, tier3: true },
      { label: 'CRM Integration', tier1: false, tier2: true, tier3: true },
      { label: 'AI Sales Assistant', tier1: false, tier2: true, tier3: 'Custom Trained' },
      { label: 'SMS/Email Workflows', tier1: false, tier2: 'Up to 5', tier3: 'Unlimited' },
    ]
  },
  {
    category: 'Support & Growth',
    items: [
      { label: 'Post-Launch Support', tier1: '30 Days', tier2: '90 Days', tier3: 'SLA' },
      { label: 'Analytics Dashboard', tier1: 'Basic', tier2: 'ROI Tracking', tier3: 'Custom BI' },
      { label: 'Dedicated Account Mgr', tier1: false, tier2: false, tier3: true },
    ]
  }
];

export const ENGAGEMENT_PROCESS: ProcessStep[] = [
  {
    step: "01",
    title: "Discovery & Audit",
    description: "We dive deep into your current bottlenecks. We don't write a line of code until we know exactly where you're losing money.",
    duration: "Week 1"
  },
  {
    step: "02",
    title: "Strategy & Design",
    description: "We map out the user journey and design high-fidelity mockups. You approve everything before we build.",
    duration: "Week 2-3"
  },
  {
    step: "03",
    title: "Build & Automate",
    description: "We develop your site, train your AI agents, and connect your CRM. This is the heavy lifting phase.",
    duration: "Week 4-5"
  },
  {
    step: "04",
    title: "Launch & Train",
    description: "We go live. Then, we hand over the keys and train your team on how to use the new system effectively.",
    duration: "Week 6"
  }
];

export const PRICING_FAQ = [
  { q: "Why is there a '+' sign on the price?", a: "80% of projects hit the base price. Custom integrations or massive data migrations can add 10-20%. You'll know the exact number after a 20-minute scoping call. No surprises." },
  { q: "Do you offer payment plans?", a: "Yes. 50% upfront, 50% at launch. For Scale projects, we can do milestone-based payments. We're flexible." },
  { q: "Are there ongoing monthly fees?", a: "Not from us. You'll pay for hosting, CRM, and AI credits directly to those vendors (usually $50-150/mo total). No middleman markup." },
  { q: "What if I just need a small tweak?", a: "Our minimum engagement is $3,500. We build complete systems, not patch jobs. If you need hourly help, we can recommend someone." },
  { q: "Who owns the code?", a: "You. 100%. Once the final invoice is paid, everything transfers to you. Code, domains, assets, admin access. No hostage fees. No lock-in." }
];

// Content Templates
const CONTENT_TEMPLATE_AI = `
<p class="lead">For decades, small businesses have faced a dilemma: hire expensive staff to answer phones 24/7, or let leads go to voicemail and die. In 2026, there is a third option.</p>
<p>Artificial Intelligence has graduated from a buzzword to a utility. Specifically, <strong>AI Voice Agents</strong> and <strong>Chatbots</strong> trained on your specific business data are now capable of handling 80% of front-line interactions with zero fatigue.</p>

<h2>The "Speed-to-Lead" Crisis</h2>
<p>Harvard Business Review published a study showing that businesses who respond to leads within 5 minutes are <strong>100x more likely</strong> to connect and qualify them than those who wait 30 minutes. 100x. Not 10%.</p>
<p>Yet, most service businesses (clinics, contractors, law firms) take hours to reply. Why? Because you are busy working.</p>

<!-- CTA -->

<h2>How AI Agents Actually Work</h2>
<p>Modern AI agents aren't the dumb "Press 1 for Sales" bots of the past. They use Large Language Models (LLMs) to understand context, tone, and intent.</p>
<ul>
  <li><strong>Ingestion:</strong> We feed the AI your website, past emails, and pricing sheets.</li>
  <li><strong>Training:</strong> We give it strict guardrails (e.g., "Never promise a specific legal outcome").</li>
  <li><strong>Deployment:</strong> It sits on your phone line or website widget.</li>
</ul>

<h2>The Math: Humans vs. AI</h2>
<p>Let's look at the cost of a reception desk vs. an AI solution.</p>
<ul>
  <li><strong>Human Receptionist:</strong> $45k/year, 9-5 availability, takes vacations, gets sick.</li>
  <li><strong>AI Agent:</strong> ~$200/month, 24/7 availability, handles infinite concurrent calls.</li>
</ul>
<p>The goal isn't to fire your staff. It's to let your staff focus on high-value work—like managing projects or closing deals—while the AI handles the repetitive intake.</p>

<h2>Implementation Strategy</h2>
<p>Don't try to automate everything at once. Start with "After Hours" handling. Let the AI take messages and book appointments when you are closed. Once you trust it, let it handle overflow during the day.</p>
`;

const CONTENT_TEMPLATE_AUTOMATION = `
<p class="lead">If you find yourself copying and pasting data from an email into a spreadsheet more than once a day, you are burning money.</p>
<p>Automation isn't about building robots; it's about building pipelines for data. When data flows automatically, your business speeds up and errors go down.</p>

<h2>The 5-Minute Rule</h2>
<p>The "5-Minute Rule" states that any task taking less than 5 minutes but performed more than 5 times a day should be automated. Why? Because the context switching costs you more than the time itself.</p>

<h2>Top 3 Workflows to Automate</h2>
<h3>1. The "New Lead" Sequence</h3>
<p>When a form is filled on your site, three things should happen instantly:</p>
<ol>
  <li>Lead added to CRM (HubSpot/Pipedrive).</li>
  <li>SMS confirmation sent to the lead ("Hey, we got your info!").</li>
  <li>Slack notification sent to your sales team.</li>
</ol>

<!-- CTA -->

<h3>2. The "Review Request" Loop</h3>
<p>Stop manually asking for Google Reviews. Set up a trigger: When a project is marked "Complete" in your CRM, wait 2 days, then send a polite email asking for feedback with a direct link.</p>

<h3>3. Invoicing Chasers</h3>
<p>Nobody likes asking for money. Let the system do it. Set up automated reminders for unpaid invoices at 3 days, 7 days, and 14 days overdue.</p>

<h2>Tools of the Trade</h2>
<p>You don't need custom code for this. Tools like <strong>Zapier</strong> and <strong>Make.com</strong> act as the "glue" between your apps. They are low-code, reliable, and cheap.</p>
`;

const CONTENT_TEMPLATE_STRATEGY = `
<p class="lead">Your website is not a digital brochure. It is a 24/7 salesperson. If it isn't putting appointments on your calendar, it is failing.</p>
<p>We audit hundreds of small business websites every year. The vast majority make the same three mistakes that kill conversion rates instantly.</p>

<h2>Mistake 1: "We" vs. "You"</h2>
<p>Count how many times your homepage says "We" (We are the best, We have 50 years exp) vs "You" (You will save time, You will get paid). Flip the script. The customer is the hero of the story, not you.</p>

<h2>Mistake 2: Hidden Calls to Action</h2>
<p>Don't make people hunt for the "Book Now" button. It should be in the top right corner (sticky) and repeated in every section. Decision fatigue is real; make the next step obvious.</p>

<!-- CTA -->

<h2>Mistake 3: The Wall of Text</h2>
<p>Nobody reads on the internet; they scan. If your paragraphs are longer than 3 lines, they are being skipped. Use bullet points, bold text, and icons to break up the flow.</p>

<h2>The "Trust Battery" Concept</h2>
<p>Every visitor starts with a "Trust Battery" at 0%. You charge it up with social proof:</p>
<ul>
  <li><strong>Specific Testimonials:</strong> "Saved me $5k" is better than "Great service".</li>
  <li><strong>Logos:</strong> Show who you've worked with.</li>
  <li><strong>Faces:</strong> Show real photos of your team, not stock photos of people shaking hands.</li>
</ul>
`;

const CONTENT_TEMPLATE_GENERIC = `
<p class="lead">In the fast-paced world of digital business, agility is the ultimate competitive advantage. This article explores key strategies to stay ahead.</p>
<p>Implementing systematic changes can seem daunting, but the long-term ROI is undeniable. Let's break down the core components of a successful modern operation.</p>
<h2>Understanding the Baseline</h2>
<p>Before you build, you must measure. What is your current cost of acquisition? How many hours are spent on admin? Without these numbers, improvement is just guessing.</p>
<!-- CTA -->
<h2>The Implementation Phase</h2>
<p>Execution eats strategy for breakfast. Start small. Pick one bottleneck in your business—be it lead intake, invoicing, or project management—and solve it completely before moving to the next.</p>
<h2>Conclusion</h2>
<p>The businesses that win in 2026 won't necessarily be the ones with the best product, but the ones with the best systems to deliver that product efficiently.</p>
`;


export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'ai-sales-agents-guide',
    title: 'How to Respond to Leads in 8 Seconds (Even at 3am)',
    excerpt: 'Harvard found businesses that respond in 5 minutes are 100x more likely to close. Here\'s how to respond in 8 seconds.',
    content: CONTENT_TEMPLATE_AI,
    category: 'AI',
    readTime: '6 min read',
    date: 'Oct 12, 2025',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    featured: true,
    author: { name: 'Alex Stratton', role: 'Founder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }
  },
  {
    id: '2',
    slug: 'stop-copy-pasting-zapier',
    title: '5 Automations That Save 10+ Hours/Week (Copy-Paste Ready)',
    excerpt: 'Stop manually entering data. These 5 Zapier workflows pay for themselves in the first week.',
    content: CONTENT_TEMPLATE_AUTOMATION,
    category: 'Automation',
    readTime: '5 min read',
    date: 'Oct 08, 2025',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    author: { name: 'Sarah Chen', role: 'Head of Ops', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
  },
  {
    id: '3',
    slug: 'speed-to-lead-rule',
    title: 'Why 5 Minutes is Too Slow: The Speed-to-Lead Data',
    excerpt: 'Responding in 60 seconds increases conversion by 300%. Here\'s the system that makes it automatic.',
    content: CONTENT_TEMPLATE_STRATEGY,
    category: 'Strategy',
    readTime: '4 min read',
    date: 'Sep 28, 2025',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    author: { name: 'Alex Stratton', role: 'Founder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }
  },
  {
    id: '4',
    slug: 'conversion-first-design',
    title: 'Why "Pretty" Websites Don\'t Sell (And What Does)',
    excerpt: 'Your designer made it look amazing. But visitors aren\'t booking. Here\'s why aesthetics alone fail.',
    content: CONTENT_TEMPLATE_STRATEGY,
    category: 'Design',
    readTime: '7 min read',
    date: 'Sep 22, 2025',
    image: 'https://images.unsplash.com/photo-1509395062558-41c63a66956e?auto=format&fit=crop&q=80&w=1200',
    author: { name: 'Marcus Cole', role: 'Design Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' }
  },
  {
    id: '5',
    slug: 'reactivate-dead-leads',
    title: 'The 3-Text Sequence That Revives Dead Leads',
    excerpt: 'Your old leads aren\'t dead. They\'re just dormant. This SMS sequence wakes them up.',
    content: CONTENT_TEMPLATE_AUTOMATION,
    category: 'Growth',
    readTime: '4 min read',
    date: 'Sep 15, 2025',
    image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=1200',
    author: { name: 'Sarah Chen', role: 'Head of Ops', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
  },
  {
    id: '6',
    slug: 'chatgpt-vs-claude',
    title: 'ChatGPT vs. Claude for Sales Copy: Head-to-Head Test',
    excerpt: 'We tested both AI models on real sales emails. The winner might surprise you.',
    content: CONTENT_TEMPLATE_AI,
    category: 'AI',
    readTime: '8 min read',
    date: 'Sep 10, 2025',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
    author: { name: 'Alex Stratton', role: 'Founder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }
  },
  {
    id: '7',
    slug: 'automating-boring-stuff',
    title: 'The "Self-Driving" Back Office: Automate Invoices, Onboarding, Reviews',
    excerpt: 'Still sending invoices manually? Here\'s the exact stack to automate your entire back office.',
    content: CONTENT_TEMPLATE_AUTOMATION,
    category: 'Automation',
    readTime: '6 min read',
    date: 'Aug 30, 2025',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200',
    author: { name: 'Sarah Chen', role: 'Head of Ops', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
  },
  {
    id: '8',
    slug: 'client-portal-reduces-churn',
    title: 'Why Clients Cancel (And How a Portal Fixes It)',
    excerpt: 'Clients don\'t cancel because of price. They cancel because they feel ignored. Here\'s the fix.',
    content: CONTENT_TEMPLATE_STRATEGY,
    category: 'Strategy',
    readTime: '5 min read',
    date: 'Aug 24, 2025',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200',
    author: { name: 'Marcus Cole', role: 'Design Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' }
  },
  {
    id: '9',
    slug: 'mobile-nav-best-practices',
    title: '70% of Your Traffic is Mobile. Can They Book in One Thumb Tap?',
    excerpt: 'If your "Book Now" button isn\'t reachable with a thumb, you\'re losing money. Here\'s how to fix it.',
    content: CONTENT_TEMPLATE_GENERIC,
    category: 'Design',
    readTime: '4 min read',
    date: 'Aug 15, 2025',
    image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&q=80&w=1200',
    author: { name: 'Marcus Cole', role: 'Design Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' }
  },
  {
    id: '10',
    slug: 'seo-is-dead-for-local',
    title: 'Skip SEO. Run Local Service Ads + Automation Instead.',
    excerpt: 'Waiting 6 months for rankings? Here\'s how to get leads this week with paid + automation.',
    content: CONTENT_TEMPLATE_GENERIC,
    category: 'Growth',
    readTime: '6 min read',
    date: 'Aug 10, 2025',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1200',
    author: { name: 'Alex Stratton', role: 'Founder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }
  },
  {
    id: '11',
    slug: 'building-second-brain',
    title: 'Document Your SOPs With AI (So You Can Finally Delegate)',
    excerpt: 'Your business knowledge is stuck in your head. Here\'s how to extract it in a weekend.',
    content: CONTENT_TEMPLATE_GENERIC,
    category: 'AI',
    readTime: '9 min read',
    date: 'Aug 02, 2025',
    image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=1200',
    author: { name: 'Sarah Chen', role: 'Head of Ops', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
  },
  {
    id: '12',
    slug: 'chaos-to-crm',
    title: 'Spreadsheet to HubSpot in 4 Weeks: The Migration Checklist',
    excerpt: 'Moving to a CRM feels overwhelming. Here\'s the exact 4-week plan we use with clients.',
    content: CONTENT_TEMPLATE_AUTOMATION,
    category: 'Automation',
    readTime: '7 min read',
    date: 'Jul 28, 2025',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200',
    author: { name: 'Sarah Chen', role: 'Head of Ops', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
  }
];
