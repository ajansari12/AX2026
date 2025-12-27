import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const CAL_API_BASE = "https://api.cal.com/v2";

interface SlotsRequest {
  startTime: string;
  endTime: string;
  eventTypeSlug?: string;
  eventTypeId?: number;
  duration?: number;
  username?: string;
}

interface BookingRequest {
  start: string;
  eventTypeId: number;
  attendee: {
    name: string;
    email: string;
    timeZone: string;
  };
  notes?: string;
}

async function getAvailableSlots(apiKey: string, params: SlotsRequest): Promise<Response> {
  const searchParams = new URLSearchParams({
    startTime: params.startTime,
    endTime: params.endTime,
  });
  
  if (params.eventTypeSlug) {
    searchParams.set("eventTypeSlug", params.eventTypeSlug);
  }
  if (params.eventTypeId) {
    searchParams.set("eventTypeId", params.eventTypeId.toString());
  }
  if (params.duration) {
    searchParams.set("duration", params.duration.toString());
  }
  let queryString = searchParams.toString();
  if (params.username) {
    queryString += `&usernameList[]=${encodeURIComponent(params.username)}`;
  }

  const response = await fetch(`${CAL_API_BASE}/slots/available?${queryString}`, {
    method: "GET",
    headers: {
      "cal-api-version": "2024-08-13",
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function createBooking(
  apiKey: string,
  booking: BookingRequest,
  supabase: ReturnType<typeof createClient>
): Promise<Response> {
  const response = await fetch(`${CAL_API_BASE}/bookings`, {
    method: "POST",
    headers: {
      "cal-api-version": "2024-08-13",
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  });

  const data = await response.json();

  if (response.ok && data.data) {
    try {
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id')
        .eq('email', booking.attendee.email)
        .maybeSingle();

      await supabase.from('bookings').insert({
        cal_booking_id: data.data.uid || data.data.id?.toString(),
        name: booking.attendee.name,
        email: booking.attendee.email,
        scheduled_time: booking.start,
        status: 'scheduled',
        notes: booking.notes || null,
        lead_id: existingLead?.id || null,
      });

      if (!existingLead) {
        await supabase.from('leads').insert({
          name: booking.attendee.name,
          email: booking.attendee.email,
          service_interest: 'Consultation Call',
          message: booking.notes || 'Booked a consultation call',
          source: 'contact_form',
          status: 'qualified',
        });
      } else {
        await supabase
          .from('leads')
          .update({ status: 'qualified', updated_at: new Date().toISOString() })
          .eq('id', existingLead.id);
      }
    } catch (dbError) {
      console.error('Error saving booking to database:', dbError);
    }
  }

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function getEventTypes(apiKey: string): Promise<Response> {
  const response = await fetch(`${CAL_API_BASE}/event-types`, {
    method: "GET",
    headers: {
      "cal-api-version": "2024-08-13",
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
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
    const calApiKey = Deno.env.get("CAL_API_KEY");
    if (!calApiKey) {
      return new Response(
        JSON.stringify({ error: "Cal.com API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (req.method === "GET") {
      if (action === "slots") {
        const startTime = url.searchParams.get("startTime");
        const endTime = url.searchParams.get("endTime");
        const eventTypeSlug = url.searchParams.get("eventTypeSlug") || undefined;
        const eventTypeId = url.searchParams.get("eventTypeId");
        const duration = url.searchParams.get("duration");
        const username = url.searchParams.get("username") || Deno.env.get("CAL_USERNAME") || undefined;

        if (!startTime || !endTime) {
          return new Response(
            JSON.stringify({ error: "startTime and endTime are required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return await getAvailableSlots(calApiKey, {
          startTime,
          endTime,
          eventTypeSlug,
          eventTypeId: eventTypeId ? parseInt(eventTypeId) : undefined,
          duration: duration ? parseInt(duration) : undefined,
          username,
        });
      }

      if (action === "event-types") {
        return await getEventTypes(calApiKey);
      }

      return new Response(
        JSON.stringify({ error: "Invalid action. Use 'slots' or 'event-types'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "POST") {
      if (action === "book") {
        const body = await req.json();
        
        if (!body.start || !body.eventTypeId || !body.attendee) {
          return new Response(
            JSON.stringify({ error: "start, eventTypeId, and attendee are required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return await createBooking(calApiKey, body, supabase);
      }

      return new Response(
        JSON.stringify({ error: "Invalid action. Use 'book' for POST requests" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Cal proxy error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});