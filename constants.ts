
import { Service, CaseStudy, PricingTier, BlogPost, PricingComparisonCategory, ProcessStep, MonthlyPricingTier } from './types';

// ... (Existing exports for SERVICES, CASE_STUDIES, PRICING_TIERS, etc. remain unchanged. I will reproduce them to ensure file integrity, but with the new BLOG_POSTS at the end.)

export const SERVICES: Service[] = [
  {
    id: '1',
    slug: 'ai-assistants',
    title: 'AI That Never Sleeps',
    description: 'Your AI assistant responds to phone calls, texts, and website inquiries in under 8 seconds - even at 3am. It answers FAQs, qualifies leads, and books directly on your calendar. No more voicemail. No more "I\'ll call them back later."',
    outcome: 'Capture 100% of leads instead of losing 30-50% to slow response.',
    icon: 'Bot',
    tags: ['Clinics', 'Agencies', 'Realtors'],
    features: [
      'Responds to calls, texts, and web chat in under 8 seconds',
      'Trained on YOUR business - answers like you would',
      'Books directly into Google/Outlook/Calendly',
      'Hands off complex questions to you via text/email',
      'Works 24/7/365 - even holidays',
      'Monthly reports so you can see what\'s working'
    ],
    timeline: '2 - 3 Weeks',
    whoIsItFor: 'Best for service businesses that miss calls while working (dentists, lawyers, contractors, consultants).',
    faq: [
      { q: 'What happens if someone asks something the AI can\'t answer?', a: 'It gracefully says "Let me have someone call you back" and texts you immediately with their question and contact info. You never look bad.' },
      { q: 'Can it handle my accent/industry jargon?', a: 'Yes. We train it on recordings of YOUR actual calls so it learns how you talk and what questions your customers actually ask.' },
      { q: 'Is it expensive?', a: '$200-500/month vs. $45K/year for a human receptionist. Most clients see ROI within the first week.' }
    ]
  },
  {
    id: '2',
    slug: 'automation-systems',
    title: 'Automatic Follow-Ups',
    description: 'Stop manually entering data and chasing leads. When someone fills out your form, they get an instant response. Invoices send themselves. Review requests go out automatically. You just do the work.',
    outcome: 'Save 10-15 hours/week on admin busywork.',
    icon: 'Workflow',
    tags: ['Service Biz', 'Contractors'],
    features: [
      'New leads auto-added to your CRM + instant text notification to you',
      'Automatic "thanks for reaching out" emails within 60 seconds',
      'Invoices and payment reminders send themselves',
      'Review requests go out 2 days after project completion',
      'Birthday/anniversary emails to keep clients warm',
      'Weekly digest of new leads and pipeline status'
    ],
    timeline: '2 - 4 Weeks',
    whoIsItFor: 'Best for businesses drowning in spreadsheets, sticky notes, and "I forgot to follow up" guilt.',
    faq: [
      { q: 'Do I need to buy new software?', a: 'Usually just Zapier ($20/mo) or Make.com ($10/mo). Total ongoing cost is typically under $70/month.' },
      { q: 'Is my customer data safe?', a: 'Absolutely. Everything is encrypted and we follow security best practices. We never store your customer info on our end.' },
      { q: 'What if my workflows are complicated?', a: 'Simple workflows (form to CRM to email): 2 weeks. Complex workflows with multiple systems: 3-4 weeks. We\'ll tell you upfront.' }
    ]
  },
  {
    id: '3',
    slug: 'websites-landing-pages',
    title: 'A Website That Books Clients',
    description: 'Not just a pretty site - a 24/7 salesperson. Clear messaging that explains what you do. Obvious calls-to-action. Built-in booking so visitors become appointments, not just pageviews.',
    outcome: 'Turn 3-5% of visitors into booked calls (industry average is 1-2%).',
    icon: 'Layout',
    tags: ['Local Biz', 'Consultants'],
    features: [
      'Conversion-focused copy written for YOUR customers',
      'One-click booking integrated into every page',
      'Mobile-first design (70% of traffic is mobile)',
      'Fast loading (under 2 seconds - slow sites lose 40% of visitors)',
      'Basic SEO so you show up in Google',
      'You can edit it yourself - no developer needed'
    ],
    timeline: '3 - 5 Weeks',
    whoIsItFor: 'Best for businesses with an outdated website, or one that looks nice but doesn\'t generate leads.',
    faq: [
      { q: 'Will I own the website?', a: 'Yes, 100%. The code, the domain, everything. No monthly fees to us to keep it online.' },
      { q: 'Do you write all the text?', a: 'Yes. We write conversion-focused copy based on what makes your customers say yes. You just approve it.' },
      { q: 'How is this different from Wix or Squarespace?', a: 'Those are templates. We build custom, conversion-optimized sites with professional copy. Huge difference in results.' }
    ]
  },
  {
    id: '4',
    slug: 'app-development',
    title: 'Client Portal That Reduces "What\'s the Status?" Emails',
    description: 'Give clients a private dashboard to check progress, approve work, sign documents, and pay invoices. No more email chains. No more phone calls asking for updates. Clients feel informed, you save hours.',
    outcome: 'Cut client communication overhead by 50%+ and get paid 3x faster.',
    icon: 'Smartphone',
    tags: ['Law Firms', 'Coaching'],
    features: [
      'Private login for each client - they see only their stuff',
      'Real-time project status updates',
      'File sharing with e-signature capability',
      'Online invoice payments (credit card, ACH, or both)',
      'Automated "project update" notifications',
      'Admin dashboard to manage all clients in one place'
    ],
    timeline: '8 - 12 Weeks',
    whoIsItFor: 'Best for service businesses managing multiple ongoing clients who need visibility (contractors, agencies, consultants, law firms).',
    faq: [
      { q: 'Do my clients need to download an app?', a: 'No. It works right in their browser, on any device. No app store needed.' },
      { q: 'Why does this take so long?', a: 'We\'re building real software, not installing a plugin. You get something custom to your workflow - not a one-size-fits-all tool you\'ll outgrow in 6 months.' },
      { q: 'Is a portal right for my business?', a: 'Yes if you manage 5+ ongoing clients, spend 5+ hours/week on client communication, or have slow invoice payments. No if you do one-time projects with no ongoing relationship.' }
    ]
  },
  {
    id: '5',
    slug: 'crm-setup',
    title: 'CRM Setup & Migration',
    description: 'Get all your leads in one place. See your pipeline at a glance. Get reminders to follow up. We migrate your messy spreadsheets, set up the system, and train your team.',
    outcome: 'Close 20-30% more deals by never forgetting to follow up.',
    icon: 'Database',
    tags: ['Sales Teams', 'B2B'],
    features: [
      'We pick the right CRM for your business (HubSpot, Pipedrive, or GoHighLevel)',
      'Migrate contacts from spreadsheets, email, and sticky notes',
      'Set up deal stages that match YOUR sales process',
      'Automated follow-up reminders',
      'Email templates for one-click outreach',
      'Team training (live session + recorded walkthrough)'
    ],
    timeline: '2 - 4 Weeks',
    whoIsItFor: 'Best for businesses tracking leads in their head, on paper, or in 17 different spreadsheets.',
    faq: [
      { q: 'Which CRM do you recommend?', a: 'Depends on your business. Solopreneurs: HubSpot Free. Small teams: Pipedrive ($15/mo). Need all-in-one: GoHighLevel ($97/mo). We help you pick.' },
      { q: 'Will my team actually use it?', a: 'Yes. We set it up to save them time, not add more work. Training included. We\'ve never had a team abandon a system we set up.' }
    ]
  },
  {
    id: '6',
    slug: 'analytics-optimization',
    title: 'Analytics That Show What\'s Working',
    description: 'Know exactly which marketing brings in customers - and which is wasting money. We set up proper tracking, build a simple dashboard, and show you how to read it.',
    outcome: 'Stop wasting money on ads that don\'t convert. Double down on what works.',
    icon: 'BarChart',
    tags: ['E-commerce', 'SaaS'],
    features: [
      'Google Analytics 4 set up properly (most setups are broken)',
      'Conversion tracking for forms, calls, and bookings',
      'Traffic source attribution - see where leads actually come from',
      'Simple dashboard with the 5 numbers that matter',
      'Monthly performance comparison',
      '30-minute walkthrough so you understand what you\'re looking at'
    ],
    timeline: '1 - 2 Weeks',
    whoIsItFor: 'Best for businesses spending money on ads or SEO with no idea what\'s actually working.',
    faq: [
      { q: 'My analytics are already set up. Do I need this?', a: 'Probably. Most analytics setups are either broken or overwhelming. We give you just the numbers that matter - nothing more.' },
      { q: 'Is this a one-time thing or ongoing?', a: 'One-time setup with a 30-min training session. Ongoing management available if you want us to actively optimize.' }
    ]
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    slug: 'dental-clinic-automation',
    client: 'Apex Dental Studio',
    industry: 'Healthcare',
    title: 'How a Dental Clinic Stopped Losing $32K/Month to No-Shows',
    summary: 'The front desk spent 4 hours a day calling patients to confirm appointments. Most went to voicemail. We set up automatic reminders instead.',
    problem: 'Apex Dental was losing money to last-minute cancellations. Their front desk spent 4 hours every day manually calling patients to confirm appointments - most calls went to voicemail. When someone did cancel, those appointment slots stayed empty.',
    solution: 'We set up automatic text reminders that go out before appointments. Patients tap to confirm. If someone cancels, the system automatically texts people on the waitlist to fill the spot. The front desk now spends their time on patients, not phone calls.',
    outcome: '30% fewer no-shows = $32K saved annually',
    outcomeDetails: [
      '15+ hours saved on phone calls every week',
      'Patients fill out paperwork before they arrive',
      'Empty slots get filled automatically',
      'ROI positive within 30 days'
    ],
    image: '/apex_case.png',
    tags: ['Automation', 'Website'],
    stack: ['React', 'Make.com', 'Twilio', 'HubSpot']
  },
  {
    id: '2',
    slug: 'legal-firm-lead-gen',
    client: 'Harrison & Co. Law',
    industry: 'Legal',
    title: 'How a Law Firm Stopped Losing Clients to Faster Competitors',
    summary: 'Lawyers were in court when potential clients called. By the time they called back, those clients had hired someone else.',
    problem: 'Harrison & Co. was losing potential clients because they couldn\'t answer the phone fast enough. Lawyers were in court or meetings. By the time they returned calls hours later, people had already hired another firm that picked up.',
    solution: 'We set up an AI assistant that answers calls and website inquiries instantly. It asks the right questions, figures out if it\'s a good case, and books consultations directly on the calendar. Lawyers only talk to qualified potential clients.',
    outcome: '2x consultations, 12 new cases in 30 days',
    outcomeDetails: [
      'Response time went from hours to seconds',
      'No more spam calls interrupting work',
      'Estimated $180K+ in new case revenue'
    ],
    image: '/law_case.png',
    tags: ['AI Assistant', 'CRM'],
    stack: ['OpenAI API', 'Vapi.ai', 'Airtable', 'Webflow']
  },
  {
    id: '3',
    slug: 'construction-crm',
    client: 'Urban Build Group',
    industry: 'Construction',
    title: 'How a Builder Stopped the "He Said, She Said" Arguments',
    summary: 'Managing 12 home builds through text messages was chaos. Clients kept calling asking for updates. Change orders got lost.',
    problem: 'Urban Build was managing 12 custom home builds through text messages and spreadsheets. Change orders got lost in long text threads, leading to expensive arguments. Clients called constantly asking "what\'s the status?" The owner spent 12+ hours a week just on communication.',
    solution: 'We built a simple client portal where clients log in to see photos and updates. They can approve changes and pay invoices online. Everything is documented. No more "I never agreed to that" disputes.',
    outcome: '12 hrs/week saved, invoices paid 10x faster',
    outcomeDetails: [
      'Almost zero disputes over change orders',
      '12 hours saved every week = $600+/week in time',
      'Invoices get paid in 2 days instead of 2 weeks'
    ],
    image: '/urban_build_(1).png',
    gallery: ['/urban_build.png', '/urban_build_(1).png'],
    tags: ['App', 'Automation'],
    stack: ['Next.js', 'Supabase', 'Stripe', 'Tailwind']
  },
  {
    id: '4',
    slug: 'consultant-authority-site',
    client: 'Elena Ross Consulting',
    industry: 'Consulting',
    title: 'How a Consultant Tripled Her Prices With a New Website',
    summary: 'Her homemade website made her look cheap. Clients haggled on price even though she had 15 years of experience.',
    problem: 'Elena is an experienced HR consultant, but her DIY website made her look like a beginner. She kept attracting clients who wanted to negotiate down her prices, even though she knew she was worth more.',
    solution: 'We built a professional website that shows off her expertise. Real case studies. Clear explanations of her process. A free resource that proves her knowledge before anyone even gets on a call with her.',
    outcome: '3x higher fees = $6K more per project',
    outcomeDetails: [
      'Average project went from $3k to $9k',
      '400 new email subscribers in 2 months',
      'Calendar booked 6 weeks out'
    ],
    image: '/elena_ross.png',
    gallery: ['/elena_ross_(1).png', '/elena_ross_(2).png'],
    tags: ['Website', 'Automation'],
    stack: ['Webflow', 'ConvertKit', 'Framer Motion']
  },
  {
    id: '5',
    slug: 'realtor-speed-to-lead',
    client: 'Prestige Properties',
    industry: 'Real Estate',
    title: 'How a Real Estate Team Stopped Wasting Money on Leads',
    summary: 'They spent $8k/month on leads but hardly anyone became a client. The leads were fine - the follow-up was the problem.',
    problem: 'Prestige Properties was spending $8k/month on leads from Zillow and Facebook, but less than 1% became clients. Agents were too busy showing houses to call leads right away. By the time they followed up, those people had already talked to 3 other agents.',
    solution: 'We set up automatic responses. New leads get a text and email within 60 seconds. If they don\'t reply, they get helpful follow-ups over the next year. The AI figures out who\'s ready to buy and books showings.',
    outcome: '$2M in new business in 90 days',
    outcomeDetails: [
      'Leads hear back in under 60 seconds',
      '15 old "dead" leads came back and bought',
      'Agents spend zero time on data entry',
      'ROI: 25x return on system investment'
    ],
    image: '/prestige_crm.png',
    tags: ['Automation', 'AI Assistant', 'CRM'],
    stack: ['GoHighLevel', 'Zapier', 'OpenAI']
  },
  {
    id: '6',
    slug: 'ecommerce-cro',
    client: 'Lumina Home Goods',
    industry: 'Ecommerce',
    title: 'How a Shop Brought Back Customers Who Left Without Buying',
    summary: 'People added items to cart but never checked out. There was no system to bring them back. We fixed that.',
    problem: 'Lumina had great Instagram followers and website traffic, but most people who added items to cart never bought anything. Once they left the site, there was no way to remind them to come back.',
    solution: 'We made checkout faster on phones and set up automatic emails. Now when someone leaves without buying, they get friendly reminders at 1 hour, 1 day, and 3 days. After someone buys, they get suggestions for related products.',
    outcome: '25% more revenue',
    outcomeDetails: [
      'Way fewer abandoned carts',
      'Email now brings in 30% of sales',
      'More customers come back to buy again'
    ],
    image: '/lumina_homegoods_(1).png',
    gallery: ['/lumina_homegoods.png', '/lumina_homegoods_(1).png'],
    tags: ['Website', 'Automation'],
    stack: ['Shopify', 'Klaviyo', 'Liquid']
  }
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    price: '$3,500+',
    description: 'Perfect if your website looks outdated or doesn\'t bring in any leads.',
    features: [
      'Professional 5-page website',
      'Contact and booking forms',
      'Google Business profile setup',
      'Works great on phones',
      '30 days of help after launch'
    ],
    ctaText: 'Get Started',
    isPopular: false
  },
  {
    name: 'Growth',
    price: '$7,500+',
    description: 'For when you\'re too busy to follow up with every lead yourself.',
    features: [
      'Full website (as many pages as you need)',
      'AI that answers calls and messages 24/7',
      'CRM setup with your existing contacts',
      'Automatic follow-up emails and texts',
      '90 days of help after launch'
    ],
    ctaText: 'This Is What I Need',
    isPopular: true
  },
  {
    name: 'Scale',
    price: 'Custom',
    description: 'For established businesses ready to run like a bigger company.',
    features: [
      'Custom client portal or app',
      'AI trained specifically for your business',
      'Connect all your existing tools',
      'Dedicated person to help you',
      'Priority support anytime'
    ],
    ctaText: 'Let\'s Talk',
    isPopular: false
  }
];

export const MONTHLY_PRICING_TIERS: MonthlyPricingTier[] = [
  {
    name: 'Starter',
    setupFee: '$500',
    monthlyPrice: '$149',
    description: 'Get started with a professional website and basic automation. Lower upfront cost with ongoing support.',
    features: [
      'Professional 5-page website',
      'Contact and booking forms',
      'Google Business profile setup',
      'Works great on phones'
    ],
    ongoingBenefits: [
      'Monthly performance check-ins',
      'Unlimited small updates and tweaks',
      'Priority email support',
      'Hosting and maintenance included'
    ],
    ctaText: 'Start Monthly Plan',
    isPopular: false,
    commitment: '6 months'
  },
  {
    name: 'Professional',
    setupFee: '$1,200',
    monthlyPrice: '$349',
    description: 'Complete website plus AI and automation. We stay invested in your results.',
    features: [
      'Full website (unlimited pages)',
      'AI that answers calls and messages 24/7',
      'CRM setup with your contacts',
      'Automatic follow-up sequences'
    ],
    ongoingBenefits: [
      'Bi-weekly strategy calls',
      'Continuous AI training and optimization',
      'New automation builds (2/month)',
      'Dedicated account manager'
    ],
    ctaText: 'Start Professional Plan',
    isPopular: true,
    commitment: '6 months'
  },
  {
    name: 'Growth',
    setupFee: '$2,500',
    monthlyPrice: '$649',
    description: 'Enterprise-grade systems with white-glove service. We become your tech team.',
    features: [
      'Custom client portal or app',
      'AI trained specifically for your business',
      'Connect all your existing tools',
      'Advanced reporting dashboard'
    ],
    ongoingBenefits: [
      'Weekly strategy calls',
      'Unlimited builds and updates',
      '24/7 priority support',
      'Quarterly roadmap planning'
    ],
    ctaText: 'Start Growth Plan',
    isPopular: false,
    commitment: '6 months'
  }
];

export const MONTHLY_COMPARISON_DATA: PricingComparisonCategory[] = [
  {
    category: 'Initial Setup',
    items: [
      { label: 'Setup fee', tier1: '$500', tier2: '$1,200', tier3: '$2,500' },
      { label: 'Website design & build', tier1: true, tier2: true, tier3: true },
      { label: 'CRM setup', tier1: false, tier2: true, tier3: true },
      { label: 'AI assistant setup', tier1: false, tier2: true, tier3: 'Fully custom' },
    ]
  },
  {
    category: 'Ongoing Support',
    items: [
      { label: 'Check-in calls', tier1: 'Monthly', tier2: 'Bi-weekly', tier3: 'Weekly' },
      { label: 'Updates & tweaks', tier1: 'Unlimited small', tier2: 'Unlimited', tier3: 'Unlimited' },
      { label: 'New automations', tier1: false, tier2: '2/month', tier3: 'Unlimited' },
      { label: 'Support response', tier1: '24 hours', tier2: '4 hours', tier3: '1 hour' },
    ]
  },
  {
    category: 'Optimization',
    items: [
      { label: 'Performance reports', tier1: 'Monthly', tier2: 'Weekly', tier3: 'Real-time' },
      { label: 'AI training updates', tier1: false, tier2: 'Continuous', tier3: 'Continuous' },
      { label: 'Conversion optimization', tier1: false, tier2: true, tier3: true },
      { label: 'Quarterly roadmap', tier1: false, tier2: false, tier3: true },
    ]
  }
];

export const PRICING_COMPARISON_DATA: PricingComparisonCategory[] = [
  {
    category: 'Design & Messaging',
    items: [
      { label: 'Review of what\'s not working', tier1: true, tier2: true, tier3: true },
      { label: 'Logo and brand design', tier1: 'Basic', tier2: 'Complete', tier3: 'Premium' },
      { label: 'Website text written for you', tier1: 'Key pages', tier2: 'All pages', tier3: 'All pages + blog' },
      { label: 'You own everything', tier1: true, tier2: true, tier3: true },
    ]
  },
  {
    category: 'Website',
    items: [
      { label: 'Number of pages', tier1: 'Up to 5', tier2: 'Unlimited', tier3: 'Unlimited' },
      { label: 'Training to edit it yourself', tier1: true, tier2: true, tier3: true },
      { label: 'Google search optimization', tier1: false, tier2: true, tier3: true },
      { label: 'Client login area', tier1: false, tier2: false, tier3: true },
    ]
  },
  {
    category: 'Automation',
    items: [
      { label: 'Lead capture forms', tier1: true, tier2: true, tier3: true },
      { label: 'CRM setup', tier1: false, tier2: true, tier3: true },
      { label: 'AI that responds for you', tier1: false, tier2: true, tier3: 'Fully custom' },
      { label: 'Automatic follow-up messages', tier1: false, tier2: 'Up to 5', tier3: 'Unlimited' },
    ]
  },
  {
    category: 'Support',
    items: [
      { label: 'Help after launch', tier1: '30 Days', tier2: '90 Days', tier3: 'Ongoing' },
      { label: 'See your results', tier1: 'Basic', tier2: 'Detailed', tier3: 'Custom' },
      { label: 'Your own dedicated contact', tier1: false, tier2: false, tier3: true },
    ]
  }
];

export const ENGAGEMENT_PROCESS: ProcessStep[] = [
  {
    step: "01",
    title: "We Learn Your Business",
    description: "A quick call to understand what's eating up your time and where you're losing potential customers.",
    duration: "Week 1"
  },
  {
    step: "02",
    title: "We Show You the Plan",
    description: "You'll see exactly what we're building before we start. No surprises. You approve everything.",
    duration: "Week 2-3"
  },
  {
    step: "03",
    title: "We Build Everything",
    description: "We create your website, set up your automations, and get everything connected. You focus on your business.",
    duration: "Week 4-5"
  },
  {
    step: "04",
    title: "It's Yours",
    description: "We launch, show you how everything works, and hand over the keys. It's 100% yours.",
    duration: "Week 6"
  }
];

export const PRICING_FAQ_ONE_TIME = [
  { q: "Why does the price say '+' after it?", a: "Most projects hit the base price. Sometimes extra work like moving lots of old data adds a bit. You'll know the exact cost after a quick call - no surprises." },
  { q: "Can I pay in installments?", a: "Yes. Half upfront, half when we launch. For bigger projects, we can break it into more payments." },
  { q: "What will I pay each month after?", a: "Nothing to us. You'll pay directly for things like website hosting and your CRM (usually $50-150/month total). We don't take a cut." },
  { q: "What if I just need something small?", a: "Our smallest project is $3,500. We build complete solutions, not quick fixes. If you need smaller help, we can point you to someone good." },
  { q: "Do I own everything when we're done?", a: "Yes, 100%. The website, the code, all the accounts - it's all yours. No monthly fees to us. No strings attached." }
];

export const PRICING_FAQ_MONTHLY = [
  { q: "What's the difference between Pay Once and Monthly?", a: "Pay Once means you pay upfront and own everything outright. Monthly means a smaller upfront investment plus ongoing payments, but you get continuous support, updates, and optimization from us every month." },
  { q: "Why a 6-month minimum commitment?", a: "It takes time to build your systems properly and see real results. The 6-month minimum ensures we have enough time to set everything up and optimize it based on real data. Most clients see their investment pay for itself within 2-3 months." },
  { q: "What happens after 6 months?", a: "You can continue month-to-month, switch to annual billing (with a discount), or transition to ownership. If you want to own everything and stop paying monthly, we'll help you migrate to a self-managed setup." },
  { q: "What ongoing support do I get?", a: "Depending on your plan: regular check-in calls, unlimited updates and tweaks, new automation builds, AI training updates, and priority support. We actively work to improve your results, not just maintain what exists." },
  { q: "Can I switch from monthly to one-time later?", a: "Absolutely. After your 6-month commitment, you can pay a buyout fee to own everything outright. We'll calculate the remaining value and give you full ownership plus training to manage it yourself." }
];

export const PRICING_FAQ = [
  { q: "Why does the price say '+' after it?", a: "Most projects hit the base price. Sometimes extra work like moving lots of old data adds a bit. You'll know the exact cost after a quick call - no surprises." },
  { q: "Can I pay in installments?", a: "Yes. Half upfront, half when we launch. For bigger projects, we can break it into more payments." },
  { q: "What will I pay each month after?", a: "Nothing to us. You'll pay directly for things like website hosting and your CRM (usually $50-150/month total). We don't take a cut." },
  { q: "What if I just need something small?", a: "Our smallest project is $3,500. We build complete solutions, not quick fixes. If you need smaller help, we can point you to someone good." },
  { q: "Do I own everything when we're done?", a: "Yes, 100%. The website, the code, all the accounts - it's all yours. No monthly fees to us. No strings attached." }
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
    author: { name: 'Alex Stratton', role: 'Founder', avatar: '/avatars/alex-stratton.svg' }
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
    author: { name: 'Sarah Chen', role: 'Head of Ops', avatar: '/avatars/sarah-chen.svg' }
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
    author: { name: 'Alex Stratton', role: 'Founder', avatar: '/avatars/alex-stratton.svg' }
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
    image: '/blog-covers/conversion-design.svg',
    author: { name: 'Marcus Cole', role: 'Design Lead', avatar: '/avatars/marcus-cole.svg' }
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
    image: '/blog-covers/sms-sequence.svg',
    author: { name: 'Sarah Chen', role: 'Head of Ops', avatar: '/avatars/sarah-chen.svg' }
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
    author: { name: 'Alex Stratton', role: 'Founder', avatar: '/avatars/alex-stratton.svg' }
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
    image: '/blog-covers/automation-backoffice.svg',
    author: { name: 'Sarah Chen', role: 'Head of Ops', avatar: '/avatars/sarah-chen.svg' }
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
    image: '/blog-covers/client-retention.svg',
    author: { name: 'Marcus Cole', role: 'Design Lead', avatar: '/avatars/marcus-cole.svg' }
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
    author: { name: 'Marcus Cole', role: 'Design Lead', avatar: '/avatars/marcus-cole.svg' }
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
    image: '/blog-covers/local-service-ads.svg',
    author: { name: 'Alex Stratton', role: 'Founder', avatar: '/avatars/alex-stratton.svg' }
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
    author: { name: 'Sarah Chen', role: 'Head of Ops', avatar: '/avatars/sarah-chen.svg' }
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
    image: '/blog-covers/crm-migration.svg',
    author: { name: 'Sarah Chen', role: 'Head of Ops', avatar: '/avatars/sarah-chen.svg' }
  }
];
