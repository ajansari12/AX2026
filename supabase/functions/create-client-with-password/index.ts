import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CreateClientRequest {
  email: string;
  password: string;
  name?: string;
  company?: string;
  phone?: string;
  notes?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: callingUser }, error: userError } = await userClient.auth.getUser();
    if (userError || !callingUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: adminCheck } = await userClient
      .from("admin_whitelist")
      .select("id")
      .eq("email", callingUser.email?.toLowerCase())
      .maybeSingle();

    if (!adminCheck) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: CreateClientRequest = await req.json();
    const { email, password, name, company, phone, notes } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 8 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: authUser, error: createAuthError } = await adminClient.auth.admin.createUser({
      email: email.toLowerCase(),
      password: password,
      email_confirm: true,
      user_metadata: {
        name: name || email.split("@")[0],
        role: "client",
      },
    });

    if (createAuthError) {
      if (createAuthError.message.includes("already been registered")) {
        return new Response(
          JSON.stringify({ error: "A user with this email already exists" }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw createAuthError;
    }

    const { data: existingClient } = await adminClient
      .from("clients")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    let clientData;
    if (existingClient) {
      const { data: updated, error: updateError } = await adminClient
        .from("clients")
        .update({
          auth_user_id: authUser.user.id,
          name: name || email.split("@")[0],
          company: company || null,
          phone: phone || null,
          notes: notes || null,
          status: "active",
          password_set: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingClient.id)
        .select()
        .single();

      if (updateError) throw updateError;
      clientData = updated;
    } else {
      const { data: inserted, error: insertError } = await adminClient
        .from("clients")
        .insert({
          email: email.toLowerCase(),
          auth_user_id: authUser.user.id,
          name: name || email.split("@")[0],
          company: company || null,
          phone: phone || null,
          notes: notes || null,
          status: "active",
          password_set: true,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      clientData = inserted;
    }

    return new Response(
      JSON.stringify({
        success: true,
        client: clientData,
        message: "Client created with password. They can now log in to the portal.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating client:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create client" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});