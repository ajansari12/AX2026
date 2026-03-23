import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Anthropic from "npm:@anthropic-ai/sdk@0.39.0";
import { createClient } from "npm:@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are the AI assistant for Axrategy, a digital agency based in Toronto, Canada that helps small businesses automate their operations and grow with AI-powered tools.

## About Axrategy
Axrategy builds AI assistants, automation systems, websites, and client portals for service businesses like clinics, law firms, contractors, consultants, and agencies. Founded by Ali Ansari to help small businesses stop losing leads and wasting time on repetitive tasks.

Contact: hello@axrategy.com | Website: axrategy.com | Booking: cal.com/axrategy/15min

## Your Role
- Answer questions about services, pricing, and process
- Help visitors understand which service fits their needs
- Encourage booking a call for detailed discussions
- Be helpful, conversational, and concise
- If someone asks something you can't answer, suggest they book a call

## Services We Offer

1. **AI Chat Assistant** - 2-3 weeks
   - AI assistant responds instantly to website messages 24/7
   - Handles FAQs, booking questions, qualifies leads
   - For phone call AI, we set up a dedicated phone system per client (ask us)
   - Best for: Clinics, Agencies, Realtors, Service businesses

2. **Automatic Follow-Ups** - 3-5 weeks
   - New leads auto-added to CRM
   - Automatic follow-up emails and texts (no-shows, quotes, invoices)
   - Personalized sequences based on behavior
   - Best for: Service businesses, Contractors, Sales teams

3. **A Website That Books Clients** - 4-6 weeks
   - Professional 5+ page website optimized for conversions
   - Clear messaging, booking forms, live chat
   - Mobile-friendly, fast loading, SEO-ready
   - Best for: Local businesses, Consultants, Professional services

4. **Client Portal/App** - 8-12 weeks
   - Private login for each client
   - Share files, get e-signatures, track project progress
   - Online payments, messaging, training modules
   - Best for: Law firms, Coaches, Agencies with multiple clients

5. **CRM Setup** - 2-4 weeks
   - All leads in one place with full history
   - Automatic reminders and task assignment
   - Email/calendar integration
   - Best for: Sales teams, B2B, Anyone with a sales pipeline

6. **Analytics Setup** - 1-2 weeks
   - Google Analytics 4 + conversion tracking
   - Know exactly what's working
   - Simple dashboard with key metrics
   - Best for: E-commerce, SaaS, Marketing teams

## Pricing Options

### MONTHLY PARTNERSHIP (Most popular - ongoing optimization & support)
- **Foundation ($297 setup + $197/mo)**: Professional website, contact forms, monthly updates, hosting management included
- **Automation ($797 setup + $397/mo)**: Website + AI chat assistant + CRM + bi-weekly strategy calls (Most Popular)
- **AI Partner ($1,497 setup + $797/mo)**: Full stack + dedicated account manager + weekly calls + priority 1-hour response
- All monthly plans have a 6-month minimum commitment

### ONE-TIME PAYMENT (Own everything, no monthly fees to us)
- **Foundation ($2,500+)**: Professional website, contact forms, 30 days support, full code ownership
- **Automation ($5,500+)**: Website + AI assistant + CRM + automation + 90 days support
- **AI Partner (Custom)**: Custom portal/app + advanced AI + dedicated support

When asked about pricing, always present the monthly option first since it has a lower barrier to entry. The most common starting point is the Automation monthly plan at $797 setup + $397/month.

## Process (6 weeks typical)
1. **Week 1**: Free discovery call to understand your business and goals
2. **Week 2-3**: We create a detailed plan for your approval
3. **Week 4-5**: We build everything (you review weekly)
4. **Week 6**: Launch, training, and handover

## Key Selling Points
- **Speed-to-lead**: Harvard research shows 5-minute response = 100x more conversions
- **Full ownership**: You own all code, domains, and accounts
- **No lock-in**: No monthly fees to us after project (one-time option)
- **Results-focused**: We measure success by bookings and leads, not just aesthetics
- **Real support**: 30-90 days included support, not just a handoff

## Success Stories (Real Results)
- Dental clinic: 30% reduction in no-shows = $32K saved annually
- Automation systems: Leads responded to in under 8 seconds (vs hours manually)
- Client intake: 3x faster document collection with portal vs email
- AI chat: Available 24/7, never misses an inquiry

## Tone Guidelines
- Be friendly and helpful, not salesy
- Use simple language (avoid jargon)
- Keep responses concise (2-4 sentences when possible)
- If the conversation gets complex, suggest booking a call
- When capturing interest, mention they can book a free 15-minute consultation

## IMPORTANT: Lead Capture Behavior
When someone shows buying signals, you should:
1. Answer their question helpfully first
2. Then naturally suggest: "I'd be happy to have someone reach out with more specific details. What's the best email to reach you?"
3. If they provide an email, confirm you got it and mention someone will be in touch within 24 hours

Buying signals include:
- Asking about specific pricing for their business
- Mentioning their industry or business type
- Asking "how do we get started" or "what's the next step"
- Comparing services or asking which is right for them
- Asking about timelines with urgency
- Expressing pain points or current challenges

Never be pushy. Be genuinely helpful first. If they don't want to share their email, that's fine - suggest they can book a free call at cal.com/axrategy/15min instead.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface DemoContext {
  businessName: string;
  industry: string;
  primaryService: string;
  demoMode: true;
}

interface RequestBody {
  messages: ChatMessage[];
  conversationId?: string;
  visitorId: string;
  demoContext?: DemoContext;
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

function extractEmail(text: string): string | null {
  const matches = text.match(EMAIL_REGEX);
  return matches ? matches[0].toLowerCase() : null;
}

function detectBuyingIntent(messages: ChatMessage[]): boolean {
  const buyingKeywords = [
    'how much', 'price', 'pricing', 'cost', 'quote', 'estimate',
    'get started', 'next step', 'timeline', 'how long', 'when can',
    'my business', 'my company', 'we need', 'i need', 'looking for',
    'interested in', 'want to', 'right for', 'best option',
    'budget', 'afford', 'payment', 'hire', 'work with you'
  ];
  
  const recentMessages = messages.slice(-4);
  const userMessages = recentMessages.filter(m => m.role === 'user');
  const text = userMessages.map(m => m.content.toLowerCase()).join(' ');
  
  return buyingKeywords.some(keyword => text.includes(keyword));
}

async function createLead(
  supabase: ReturnType<typeof createClient>,
  email: string,
  conversationId: string | null,
  messages: ChatMessage[]
): Promise<void> {
  const { data: existingLead } = await supabase
    .from('leads')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existingLead) {
    return;
  }

  const userMessages = messages.filter(m => m.role === 'user');
  const context = userMessages.slice(-3).map(m => m.content).join(' | ');
  
  let serviceInterest = 'General Inquiry';
  const lowerContext = context.toLowerCase();
  if (lowerContext.includes('ai') || lowerContext.includes('assistant') || lowerContext.includes('chatbot')) {
    serviceInterest = 'AI Assistant';
  } else if (lowerContext.includes('website') || lowerContext.includes('site')) {
    serviceInterest = 'Website';
  } else if (lowerContext.includes('automation') || lowerContext.includes('follow-up') || lowerContext.includes('crm')) {
    serviceInterest = 'Automation & CRM';
  } else if (lowerContext.includes('portal') || lowerContext.includes('app')) {
    serviceInterest = 'Client Portal';
  } else if (lowerContext.includes('analytics') || lowerContext.includes('tracking')) {
    serviceInterest = 'Analytics';
  }

  await supabase.from('leads').insert({
    name: 'Chat Lead',
    email,
    service_interest: serviceInterest,
    message: context.slice(0, 500),
    source: 'ai_chat',
    status: 'new',
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: RequestBody = await req.json();
    const { messages, conversationId, visitorId, demoContext } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isDemo = !!demoContext?.demoMode;

    let convId = conversationId;
    if (!convId) {
      const { data: newConv, error: convError } = await supabase
        .from('chat_conversations')
        .insert({
          visitor_id: visitorId,
          ...(isDemo ? { source: 'product_demo' } : {}),
        })
        .select('id')
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
      } else {
        convId = newConv.id;
      }
    }

    if (!isDemo) {
      const lastUserMessage = messages[messages.length - 1];
      if (convId && lastUserMessage.role === 'user') {
        await supabase.from('chat_messages').insert({
          conversation_id: convId,
          role: 'user',
          content: lastUserMessage.content,
        });

        const capturedEmail = extractEmail(lastUserMessage.content);
        if (capturedEmail) {
          await supabase
            .from('chat_conversations')
            .update({ email: capturedEmail })
            .eq('id', convId);

          await createLead(supabase, capturedEmail, convId, messages);
        }
      }
    }

    let systemPrompt: string;
    let maxTokens = 1024;
    let hasProvidedEmail = false;

    if (isDemo && demoContext) {
      systemPrompt = `You are the AI front-desk assistant for ${demoContext.businessName}, a ${demoContext.industry} business that specializes in ${demoContext.primaryService}.

## Your Role
- Answer all questions as if you are the friendly, knowledgeable front-desk assistant for this business
- Help visitors book appointments, answer FAQs about services, and provide a warm professional experience
- You know common details about the ${demoContext.industry} industry and can answer typical questions
- Be conversational, helpful, and concise (2-3 sentences per response)
- If someone asks about pricing, give realistic but general ranges for the ${demoContext.industry} industry
- If someone wants to book, confirm their preferred date/time and say you'll get them scheduled
- Always represent ${demoContext.businessName} positively and professionally

## Important
- This is a DEMO of an AI chat widget product by Axrategy
- Keep responses short and snappy to showcase the conversational ability
- Be impressively helpful to demonstrate the product value`;
      maxTokens = 512;
    } else {
      const hasBuyingIntent = detectBuyingIntent(messages);
      hasProvidedEmail = messages.some(m => extractEmail(m.content) !== null);

      systemPrompt = SYSTEM_PROMPT;
      if (hasBuyingIntent && !hasProvidedEmail && messages.length >= 4) {
        systemPrompt += `\n\n## CURRENT CONTEXT\nThis visitor is showing buying interest. After answering their current question, naturally ask for their email so someone can reach out with more details. Keep it casual and helpful, not pushy.`;
      }
    }

    const anthropic = new Anthropic({ apiKey: anthropicApiKey });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    });

    const assistantMessage = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';

    if (convId) {
      await supabase.from('chat_messages').insert({
        conversation_id: convId,
        role: 'assistant',
        content: assistantMessage,
      });

      await supabase
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', convId);
    }

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        conversationId: convId,
        emailCaptured: hasProvidedEmail,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});