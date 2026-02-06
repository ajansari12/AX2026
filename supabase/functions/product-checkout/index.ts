import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@14.10.0";
import { createClient } from "npm:@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  productSlug: string;
  customerEmail: string;
  customerName?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const siteUrl = Deno.env.get("SITE_URL") || "https://axrategy.com";

    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Payment service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: RequestBody = await req.json();
    const { productSlug, customerEmail, customerName } = body;

    if (!productSlug || !customerEmail) {
      return new Response(
        JSON.stringify({ success: false, error: "Product slug and customer email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("slug", productSlug)
      .eq("is_active", true)
      .maybeSingle();

    if (productError || !product) {
      return new Response(
        JSON.stringify({ success: false, error: "Product not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isSubscription = product.billing_period === "monthly" || product.billing_period === "annual";
    const mode = isSubscription ? "subscription" : "payment";

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];

    if (product.stripe_price_id) {
      lineItems = [{ price: product.stripe_price_id, quantity: 1 }];
    } else {
      if (isSubscription) {
        lineItems = [
          {
            price_data: {
              currency: "usd",
              product_data: { name: product.name, description: product.tagline },
              unit_amount: product.price_cents,
              recurring: {
                interval: product.billing_period === "annual" ? "year" : "month",
              },
            },
            quantity: 1,
          },
        ];
      } else {
        lineItems = [
          {
            price_data: {
              currency: "usd",
              product_data: { name: product.name, description: product.tagline },
              unit_amount: product.price_cents,
            },
            quantity: 1,
          },
        ];
      }

      if (product.setup_fee_cents > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: { name: `${product.name} - Setup Fee` },
            unit_amount: product.setup_fee_cents,
          },
          quantity: 1,
        });
      }
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode,
      customer_email: customerEmail,
      line_items: lineItems,
      success_url: `${siteUrl}/products/${productSlug}?success=true`,
      cancel_url: `${siteUrl}/products/${productSlug}?cancelled=true`,
      metadata: {
        productId: product.id,
        productSlug: product.slug,
        customerEmail,
        customerName: customerName || "",
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    const { error: purchaseError } = await supabase.from("purchases").insert({
      product_id: product.id,
      customer_email: customerEmail,
      customer_name: customerName || "",
      status: "pending",
      stripe_session_id: session.id,
      amount_cents: product.price_cents + product.setup_fee_cents,
    });

    if (purchaseError) {
      console.error("Failed to record purchase:", purchaseError);
    }

    const { data: existingLead } = await supabase
      .from("leads")
      .select("id")
      .eq("email", customerEmail.toLowerCase())
      .maybeSingle();

    if (!existingLead) {
      await supabase.from("leads").insert({
        name: customerName || "Product Customer",
        email: customerEmail.toLowerCase(),
        service_interest: product.name,
        message: `Initiated checkout for ${product.name} (${product.price_display})`,
        source: "product_checkout",
        status: "new",
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        url: session.url,
        sessionId: session.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Product checkout error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to create checkout session" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
