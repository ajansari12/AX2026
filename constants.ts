
import { Service, CaseStudy, PricingTier, BlogPost, PricingComparisonCategory, ProcessStep } from './types';

// ... (Existing exports for SERVICES, CASE_STUDIES, PRICING_TIERS, etc. remain unchanged. I will reproduce them to ensure file integrity, but with the new BLOG_POSTS at the end.)

export const SERVICES: Service[] = [
  {
    id: '1',
    slug: 'ai-assistants',
    title: 'AI Sales Agents',
    description: 'A 24/7 intelligent employee that lives on your website.',
    outcome: 'Qualify leads instantly and book meetings while you sleep.',
    icon: 'Bot',
    tags: ['Clinics', 'Agencies', 'Realtors'],
    features: [
      'Trained on your actual business data',
      'Responds in seconds, 24/7',
      'Syncs with your calendar automatically',
      'Matches your brand tone',
      'Handles objections and pricing FAQs',
      'Escalates complex issues to humans'
    ],
    timeline: '2 - 3 Weeks',
    whoIsItFor: 'Service businesses missing calls or wasting hours answering the same basic questions via email.',
    faq: [
      { q: 'Does it sound like a robot?', a: 'No. We train it on your past emails so it sounds exactly like a helpful team member.' },
      { q: 'Can it book appointments?', a: 'Yes. It checks your real-time availability and books directly into your calendar.' },
      { q: 'What if it doesn\'t know the answer?', a: 'It politely takes the user\'s info and flags it for your human team to handle.' }
    ]
  },
  {
    id: '2',
    slug: 'automation-systems',
    title: 'Workflow Automation',
    description: 'Connect your tools so data flows automatically without manual entry.',
    outcome: 'Eliminate 10+ hours of busywork per week.',
    icon: 'Workflow',
    tags: ['Service Biz', 'Contractors'],
    features: [
      'Auto-sync leads to CRM',
      'Instant "speed-to-lead" SMS follow-up',
      'Automated invoicing & reminders',
      'Google Review request sequences',
      'Team notifications in Slack/Teams',
      'Zero manual data entry'
    ],
    timeline: '3 - 5 Weeks',
    whoIsItFor: 'Teams drowning in admin work, copy-pasting data, or losing leads because they follow up too slowly.',
    faq: [
      { q: 'Do I need new software?', a: 'Likely just a connector tool like Zapier or Make. We optimize to keep monthly costs low.' },
      { q: 'Is it secure?', a: 'Yes. We use enterprise-grade security standards. We do not store your customer data.' },
      { q: 'Can you automate paper forms?', a: 'Yes. We can digitize your intake forms and have them auto-fill your database.' }
    ]
  },
  {
    id: '3',
    slug: 'websites-landing-pages',
    title: 'High-Converting Websites',
    description: 'Fast, clean websites designed to turn visitors into paying customers.',
    outcome: 'Double your visitor-to-lead conversion rate.',
    icon: 'Layout',
    tags: ['Local Biz', 'Consultants'],
    features: [
      'Copywriting that sells (not just filler)',
      'Mobile-perfect design',
      'SEO technical foundation',
      'Fast loading speeds (90+ score)',
      'Easy for you to edit later',
      'Integrated booking forms'
    ],
    timeline: '4 - 6 Weeks',
    whoIsItFor: 'Businesses with outdated sites that look bad on phones or simply aren\'t generating new business.',
    faq: [
      { q: 'Do I own the website?', a: '100%. You own the code, the domain, and the design assets. No hostage fees.' },
      { q: 'Do you write the text?', a: 'Yes. We have conversion copywriters who craft the messaging for you.' },
      { q: 'What platform do you use?', a: 'We recommend Webflow or WordPress for ease of use, or custom code for advanced needs.' }
    ]
  },
  {
    id: '4',
    slug: 'app-development',
    title: 'Client Portals & Apps',
    description: 'Secure spaces for your clients to view status, pay invoices, and share files.',
    outcome: 'A premium client experience that reduces churn.',
    icon: 'Smartphone',
    tags: ['Law Firms', 'Coaching'],
    features: [
      'Secure client login area',
      'File sharing & document signing',
      'Real-time project status trackers',
      'Subscription billing integration',
      'Admin dashboard for your team',
      'Automated email notifications'
    ],
    timeline: '8 - 12 Weeks',
    whoIsItFor: 'High-ticket service providers who want to look professional and stop managing clients via messy email chains.',
    faq: [
      { q: 'Is this a mobile app?', a: 'We build Progressive Web Apps (PWAs) that work on phones and desktops without app store headaches.' },
      { q: 'How do you handle updates?', a: 'We offer a maintenance package to handle security patches and small tweaks.' }
    ]
  },
  {
    id: '5',
    slug: 'crm-setup',
    title: 'CRM Implementation',
    description: 'Organize your sales pipeline so no deal ever falls through the cracks.',
    outcome: 'Stop losing money to disorganization.',
    icon: 'Database',
    tags: ['Sales Teams', 'B2B'],
    features: [
      'Pipeline stage design',
      'Importing your messy spreadsheet data',
      'One-click email templates',
      'Sales performance dashboards',
      'Team training workshops',
      'Automated task reminders'
    ],
    timeline: '2 - 4 Weeks',
    whoIsItFor: 'Sales teams using spreadsheets, sticky notes, or a CRM that nobody actually updates.',
    faq: [
      { q: 'Which CRM do you recommend?', a: 'Usually HubSpot for ease of use or Pipedrive for pure sales focus. We help you choose.' },
      { q: 'Will my team actually use it?', a: 'Yes, because we set it up to save them time, not just to track them. We also train them.' }
    ]
  },
  {
    id: '6',
    slug: 'analytics-optimization',
    title: 'Analytics & Tracking',
    description: 'Know exactly which marketing channels are making you money.',
    outcome: 'Stop guessing. Start scaling what works.',
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
    whoIsItFor: 'Businesses spending money on ads who don\'t know exactly which campaigns are driving revenue.',
    faq: [
      { q: 'Does this help with SEO?', a: 'Indirectly. Knowing what users do on your site helps us improve the content they like.' },
      { q: 'Is this a monthly fee?', a: 'We can do a one-time setup, or a monthly retainer to actively improve your numbers.' }
    ]
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    slug: 'dental-clinic-automation',
    client: 'Apex Dental Studio',
    industry: 'Healthcare',
    title: 'Eliminating No-Shows with Smart SMS',
    summary: 'Receptionists were drowning in confirmation calls. We automated the entire intake and reminder workflow.',
    problem: 'Apex Dental was losing 15% of weekly revenue to last-minute cancellations. Their front desk team spent 4 hours a day manually calling patients to confirm appointments, often leaving voicemails that were ignored.',
    solution: 'We built a custom automation system using Twilio and their practice management software. Patients now receive intelligent SMS reminders 72, 24, and 2 hours before appointments, with a one-tap confirmation link. We also digitized their intake forms, sending them automatically upon booking.',
    outcome: '30% Reduction in No-Shows',
    outcomeDetails: [
      '15+ hours of weekly admin time saved',
      '98% patient intake form completion rate before arrival',
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
    title: 'The "Never-Sleep" Legal Assistant',
    summary: 'Inquiries were sitting in the inbox for days. We deployed an AI agent to reply and qualify leads instantly.',
    problem: 'High-value personal injury leads were going cold because attorneys were in court and unable to answer the phone. The firm estimated they were losing $50k/mo in potential case fees due to slow response times.',
    solution: 'We trained a custom AI agent on the firm\'s intake criteria. The agent lives on the website and answers calls, qualifying potential clients in real-time. If a case matches criteria, it instantly books a consultation on the senior partner\'s calendar.',
    outcome: '2x Qualified Consultations',
    outcomeDetails: [
      'Response time reduced from 4 hours to 10 seconds',
      'Zero spam calls reaching the attorneys',
      '$120k in new case value attributed to AI in Month 1'
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
    title: 'Centralizing Project Chaos',
    summary: 'Clients were texting for updates. We built a secure portal for daily logs, change orders, and invoices.',
    problem: 'Managing 12 active custom home builds via text messages and spreadsheets was a nightmare. Change orders were getting lost, leading to disputes, and clients felt out of the loop.',
    solution: 'We developed a Progressive Web App (PWA) Client Portal. Site supervisors upload daily photos and logs from their phones. Clients can log in to view progress, approve change orders digitally, and pay invoices.',
    outcome: '40% Higher Client Satisfaction',
    outcomeDetails: [
      'Disputes over change orders dropped to near zero',
      '12 hours of owner admin time saved per week',
      'Faster invoice payments (avg. 2 days vs 14 days)'
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
    title: 'From Generalist to Authority',
    summary: 'A generic website was hurting her fees. We rebranded her as the premium choice in her niche.',
    problem: 'Elena is a top-tier HR consultant, but her DIY website looked like a beginner\'s portfolio. She was attracting low-budget leads who haggled on price, despite her 15 years of experience.',
    solution: 'We executed a complete "Authority Overhaul." We built a premium, editorial-style website focused on her methodology. We also built a high-value "HR Audit" lead magnet funnel that nurtures prospects before they ever get on a call.',
    outcome: '3x Increase in Deal Size',
    outcomeDetails: [
      'Average retainer increased from $3k to $9k',
      'Email list grew by 400 subscribers in 2 months',
      'Calendar is now booked out 6 weeks in advance'
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
    title: 'Converting Cold Zillow Leads',
    summary: 'Buying leads is easy. Converting them is hard. We built a system that chases them for you.',
    problem: 'The team was spending thousands on Zillow and Facebook leads, but conversion was under 1%. Agents were too busy showing homes to call leads within the critical 5-minute window.',
    solution: 'We implemented a "Speed-to-Lead" automation system. New leads instantly receive a personalized SMS and email. If they don\'t reply, a 12-month nurture sequence kicks in, sending market updates and check-ins automatically.',
    outcome: '$2M Pipeline Added in 90 Days',
    outcomeDetails: [
      'Lead response time is now under 60 seconds (automated)',
      'Reactivated 15 "dead" leads from their old database',
      'Agents spend 0 minutes on manual data entry'
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
    title: 'Recovering Lost Revenue',
    summary: 'High traffic, low sales. We optimized the checkout flow and added retention loops.',
    problem: 'Lumina had a beautiful Instagram following and great traffic, but a 75% cart abandonment rate. Customers were adding to cart and leaving, and there was no system to bring them back.',
    solution: 'We rebuilt the Shopify theme for speed and mobile UX. Then, we set up a comprehensive Klaviyo email system: Abandoned Cart, Browse Abandonment, and Post-Purchase upsell flows.',
    outcome: '25% Lift in Total Revenue',
    outcomeDetails: [
      'Cart abandonment rate dropped to 55%',
      'Email marketing now accounts for 30% of total revenue',
      'Repeat customer rate increased by 15%'
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
    description: 'Perfect for local businesses ready to look professional and stop missing leads.',
    features: [
      '5-Page Conversion Website',
      'Lead Capture Forms',
      'Google My Business Optimization',
      'Basic Mobile Optimization',
      '1 Month Post-Launch Support'
    ],
    ctaText: 'Start Here',
    isPopular: false
  },
  {
    name: 'Growth',
    price: '$7,500+',
    description: 'The standard for service teams scaling to $1M+ who need to automate busywork.',
    features: [
      'Unlimited Page Web System',
      'AI Sales Agent Integration',
      'CRM Setup & Data Migration',
      'Email/SMS Automation Workflows',
      '3 Months Post-Launch Support'
    ],
    ctaText: 'Get the System',
    isPopular: true
  },
  {
    name: 'Scale',
    price: 'Custom',
    description: 'For organizations needing complex custom software, portals, or deep integrations.',
    features: [
      'Custom Web App / Portal Dev',
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
  { q: "Why is there a '+' sign on the price?", a: "Every business is unique. While 80% of projects fit these base prices, complex requirements (like migrating 10,000 blog posts or custom API integrations) may affect the final quote. We provide a fixed price proposal after our discovery call." },
  { q: "Do you offer payment plans?", a: "Yes. Typically, we split payments into 50% upfront and 50% upon launch. For larger 'Scale' projects, we can discuss milestone-based billing." },
  { q: "Are there ongoing monthly fees?", a: "Axrategy does not charge a mandatory monthly retainer. However, you will pay for your own software tools (hosting, CRM, AI usage), which usually totals $50-$150/mo directly to those vendors." },
  { q: "What if I just need a small fix?", a: "Our minimum engagement is the Starter package ($3,500). We focus on holistic system builds rather than hourly maintenance tasks." },
  { q: "Who owns the code?", a: "You do. 100%. Once the final invoice is paid, we transfer all intellectual property, admin access, and assets to you." }
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
    title: 'The 24/7 Sales Rep: How AI Voice Agents Capture Leads While You Sleep',
    excerpt: 'Stop letting voicemail kill your deals. AI voice agents can now handle complex intake calls with human-like empathy.',
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
    title: 'Stop Copy-Pasting: 5 Zapier Workflows Every Local Business Needs',
    excerpt: 'The "boring" admin work is costing you thousands. Here are 5 copy-paste workflows to reclaim your time.',
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
    title: 'The "Speed-to-Lead" Rule: Why 5 Minutes is Too Long',
    excerpt: 'Data shows that responding to a lead within 60 seconds increases conversion by 300%. Here is how to do it automatically.',
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
    title: 'Conversion-First Design: Why Pretty Websites Often Fail',
    excerpt: 'A beautiful website that doesn\'t sell is just art. We break down the UX patterns that actually drive revenue.',
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
    title: 'How to Reactivate "Dead" Leads with Automated SMS',
    excerpt: 'You are sitting on a goldmine of past leads. A simple 3-step SMS campaign can wake them up.',
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
    title: 'ChatGPT vs. Claude: Which AI Model Should Write Your Emails?',
    excerpt: 'Not all LLMs are created equal. We tested them head-to-head on sales copy, empathy, and tone.',
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
    title: 'Automating the Boring Stuff: Invoicing, Onboarding, and Reviews',
    excerpt: 'If you are sending invoices manually, you are wasting time. The complete stack for a "self-driving" back office.',
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
    title: 'The Trust Gap: How a Client Portal Reduces Churn',
    excerpt: 'Clients cancel when they feel ignored. Give them a transparent window into your work with a custom portal.',
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
    title: 'Mobile Navigation Best Practices for Service Businesses',
    excerpt: '70% of your traffic is on mobile. If your thumb can\'t reach the "Call" button, you are losing money.',
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
    title: 'SEO is Dead (For You): Why Local Service Ads + Automation Win',
    excerpt: 'Waiting 6 months for SEO rankings is too slow. Here is the paid acquisition playbook for instant growth.',
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
    title: 'Building a Second Brain for Your Business Operations',
    excerpt: 'How to use Notion and AI to document your SOPs so you can finally delegate effectively.',
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
    title: 'From Chaos to CRM: A Step-by-Step Migration Guide',
    excerpt: 'Moving from spreadsheets to HubSpot doesn\'t have to be painful. Here is our 4-week migration checklist.',
    content: CONTENT_TEMPLATE_AUTOMATION,
    category: 'Automation',
    readTime: '7 min read',
    date: 'Jul 28, 2025',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200',
    author: { name: 'Sarah Chen', role: 'Head of Ops', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
  }
];
