import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Anthropic from "npm:@anthropic-ai/sdk@0.39.0";
import { createClient } from "npm:@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are the AI assistant for Axrategy, a digital agency that helps small businesses automate their operations and grow with AI-powered tools.

## About Axrategy
Axrategy builds AI assistants, automation systems, websites, and client portals for service businesses like clinics, law firms, contractors, consultants, and agencies.

## Your Role
- Answer questions about services, pricing, and process
- Help visitors understand which service fits their needs
- Encourage booking a call for detailed discussions
- Be helpful, conversational, and concise
- If someone asks something you can't answer, suggest they book a call

## Services We Offer

1. **AI That Answers For You** ($7,500+ tier) - 2-3 weeks
   - AI assistant responds instantly to calls/messages
   - Answers common questions and books appointments
   - Sounds natural, not robotic
   - Best for: Clinics, Agencies, Realtors

2. **Automatic Follow-Ups** ($7,500+ tier) - 3-5 weeks
   - New leads auto-added to CRM
   - Automatic follow-up emails and texts
   - Invoice and payment reminders
   - Best for: Service businesses, Contractors

3. **A Website That Books Clients** ($3,500+ tier) - 4-6 weeks
   - Professional 5+ page website
   - Clear messaging and booking forms
   - Mobile-friendly and fast
   - Best for: Local businesses, Consultants

4. **Client Portal/App** (Custom pricing) - 8-12 weeks
   - Private login for each client
   - Share files, get signatures, track progress
   - Online payments
   - Best for: Law firms, Coaches

5. **CRM Setup** ($7,500+ tier) - 2-4 weeks
   - All leads in one place
   - Automatic reminders
   - Email integration
   - Best for: Sales teams, B2B

6. **Analytics Setup** ($3,500+ tier) - 1-2 weeks
   - Google Analytics setup
   - Track what's working
   - Simple dashboard
   - Best for: E-commerce, SaaS

## Pricing Tiers

- **Starter ($3,500+)**: Professional website, contact forms, 30 days support
- **Growth ($7,500+)**: Full website + AI assistant + CRM + automation, 90 days support (Most Popular)
- **Scale (Custom)**: Custom portal/app + advanced AI + dedicated support

Payment: 50% upfront, 50% at launch. Larger projects can split into more payments.
You own everything - no monthly fees to us.

## Process (6 weeks typical)
1. Week 1: Discovery call to understand the business
2. Week 2-3: Show the plan for approval
3. Week 4-5: Build everything
4. Week 6: Launch and hand over

## Key Selling Points
- Speed-to-lead: Harvard research shows 5-minute response = 100x more conversions
- Full ownership: Client owns all code, domains, accounts
- No lock-in: No monthly fees to us after project completion
- Results-focused: We measure success by bookings/leads, not just aesthetics

## Tone Guidelines
- Be friendly and helpful, not salesy
- Use simple language (avoid jargon)
- Keep responses concise (2-4 sentences when possible)
- If the conversation gets complex, suggest booking a call
- When capturing interest, mention they can book a free consultation

## IMPORTANT: Lead Capture Behavior
When someone shows buying signals (asks about pricing for their specific case, mentions their business type, asks about timelines, or expresses clear interest), you should:
1. Answer their question helpfully first
2. Then naturally suggest: "I'd be happy to have someone reach out with more specific details. What's the best email to reach you?"
3. If they provide an email, confirm you got it and mention someone will be in touch soon

Buying signals include:
- Asking about specific pricing for their business
- Mentioning their industry or business type
- Asking "how do we get started" or "what's the next step"
- Comparing services or asking which is right for them
- Asking about timelines with urgency
- Expressing pain points or current challenges

Never be pushy. Be genuinely helpful first. If they don't want to share their email, that's fine - suggest they can book a call instead.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  conversationId?: string;
  visitorId: string;
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
    const { messages, conversationId, visitorId } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let convId = conversationId;
    if (!convId) {
      const { data: newConv, error: convError } = await supabase
        .from('chat_conversations')
        .insert({ visitor_id: visitorId })
        .select('id')
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
      } else {
        convId = newConv.id;
      }
    }

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

    const hasBuyingIntent = detectBuyingIntent(messages);
    const hasProvidedEmail = messages.some(m => extractEmail(m.content));
    
    let enhancedSystemPrompt = SYSTEM_PROMPT;
    if (hasBuyingIntent && !hasProvidedEmail && messages.length >= 4) {
      enhancedSystemPrompt += `\n\n## CURRENT CONTEXT\nThis visitor is showing buying interest. After answering their current question, naturally ask for their email so someone can reach out with more details. Keep it casual and helpful, not pushy.`;
    }

    const anthropic = new Anthropic({ apiKey: anthropicApiKey });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: enhancedSystemPrompt,
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