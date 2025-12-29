import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@14.10.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface LineItem {
  description: string;
  amount: number;
  quantity?: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  status: string;
  amount: number;
  currency: string;
  description: string | null;
  line_items: LineItem[];
  due_date: string | null;
  clients: {
    id: string;
    email: string;
    name: string | null;
    company: string | null;
  };
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Validate required environment variables
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const siteUrl = Deno.env.get("SITE_URL") || "https://axrategy.com";

    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Payment service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase environment variables not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Database service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Initialize Supabase with service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { invoiceId } = await req.json();

    if (!invoiceId) {
      return new Response(
        JSON.stringify({ success: false, error: "Invoice ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch invoice details with client information
    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select(`
        *,
        clients (
          id,
          email,
          name,
          company
        )
      `)
      .eq("id", invoiceId)
      .single() as { data: Invoice | null; error: Error | null };

    if (fetchError || !invoice) {
      console.error("Invoice fetch error:", fetchError);
      return new Response(
        JSON.stringify({ success: false, error: "Invoice not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if invoice is already paid
    if (invoice.status === "paid") {
      return new Response(
        JSON.stringify({ success: false, error: "Invoice has already been paid" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if invoice is cancelled
    if (invoice.status === "cancelled") {
      return new Response(
        JSON.stringify({ success: false, error: "Invoice has been cancelled" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build line items for Stripe
    let stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[];

    if (invoice.line_items && invoice.line_items.length > 0) {
      // Use detailed line items if available
      stripeLineItems = invoice.line_items.map((item: LineItem) => ({
        price_data: {
          currency: invoice.currency.toLowerCase(),
          product_data: {
            name: item.description,
          },
          unit_amount: Math.round(item.amount * 100), // Convert to cents
        },
        quantity: item.quantity || 1,
      }));
    } else {
      // Fall back to single line item with total amount
      stripeLineItems = [
        {
          price_data: {
            currency: invoice.currency.toLowerCase(),
            product_data: {
              name: invoice.description || `Invoice ${invoice.invoice_number}`,
            },
            unit_amount: Math.round(invoice.amount * 100),
          },
          quantity: 1,
        },
      ];
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: invoice.clients.email,
      client_reference_id: invoice.clients.id,
      line_items: stripeLineItems,
      success_url: `${siteUrl}/#/portal/invoices?success=true&invoice=${invoiceId}`,
      cancel_url: `${siteUrl}/#/portal/invoices?cancelled=true`,
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoice_number,
        clientId: invoice.clients.id,
        clientEmail: invoice.clients.email,
      },
      payment_intent_data: {
        metadata: {
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoice_number,
        },
      },
    });

    // Update invoice with Stripe session info
    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        stripe_invoice_id: session.id,
        stripe_payment_url: session.url,
        status: invoice.status === "draft" ? "sent" : invoice.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId);

    if (updateError) {
      console.error("Failed to update invoice with Stripe info:", updateError);
      // Don't fail the request - the checkout session was created successfully
    }

    console.log(`Checkout session created for invoice ${invoice.invoice_number}`);

    return new Response(
      JSON.stringify({
        success: true,
        url: session.url,
        sessionId: session.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);

    // Handle Stripe-specific errors
    if (error instanceof Stripe.errors.StripeError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
          code: error.code,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
