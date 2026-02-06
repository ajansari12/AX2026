import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GOOGLE_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface PlaceResult {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  formatted_address?: string;
  types?: string[];
  photos?: { photo_reference: string }[];
  opening_hours?: { open_now?: boolean };
  business_status?: string;
}

interface PlaceDetails {
  name: string;
  rating?: number;
  user_ratings_total?: number;
  formatted_phone_number?: string;
  website?: string;
  url?: string;
  photos?: { photo_reference: string }[];
  opening_hours?: { weekday_text?: string[] };
  reviews?: {
    rating: number;
    text: string;
    relative_time_description: string;
    author_name: string;
  }[];
  types?: string[];
  editorial_summary?: { overview?: string };
  address_components?: { long_name: string; types: string[] }[];
}

function scoreProfile(details: PlaceDetails, competitors: PlaceResult[]): {
  score: number;
  findings: { category: string; status: string; detail: string; weight: number }[];
} {
  const findings: { category: string; status: string; detail: string; weight: number }[] = [];
  let totalWeight = 0;
  let earnedWeight = 0;

  const photoCount = details.photos?.length || 0;
  const photoWeight = 20;
  totalWeight += photoWeight;
  if (photoCount >= 10) {
    earnedWeight += photoWeight;
    findings.push({ category: "Photos", status: "good", detail: `${photoCount} photos uploaded. Solid visual presence.`, weight: photoWeight });
  } else if (photoCount >= 5) {
    earnedWeight += photoWeight * 0.6;
    findings.push({ category: "Photos", status: "warning", detail: `Only ${photoCount} photos. Top competitors average 15-25+. Add more to stand out.`, weight: photoWeight });
  } else {
    findings.push({ category: "Photos", status: "critical", detail: `Only ${photoCount} photo(s). Businesses with 10+ photos get 42% more direction requests.`, weight: photoWeight });
  }

  const reviewCount = details.user_ratings_total || 0;
  const reviewWeight = 25;
  totalWeight += reviewWeight;
  if (reviewCount >= 50) {
    earnedWeight += reviewWeight;
    findings.push({ category: "Reviews", status: "good", detail: `${reviewCount} reviews. Strong social proof for search visibility.`, weight: reviewWeight });
  } else if (reviewCount >= 20) {
    earnedWeight += reviewWeight * 0.6;
    findings.push({ category: "Reviews", status: "warning", detail: `${reviewCount} reviews. Aim for 50+ to compete effectively in local search.`, weight: reviewWeight });
  } else {
    findings.push({ category: "Reviews", status: "critical", detail: `Only ${reviewCount} reviews. Businesses with fewer than 20 reviews struggle in the local 3-pack.`, weight: reviewWeight });
  }

  const rating = details.rating || 0;
  const ratingWeight = 15;
  totalWeight += ratingWeight;
  if (rating >= 4.5) {
    earnedWeight += ratingWeight;
    findings.push({ category: "Rating", status: "good", detail: `${rating} star rating. Excellent -- this builds trust and improves click-through.`, weight: ratingWeight });
  } else if (rating >= 4.0) {
    earnedWeight += ratingWeight * 0.7;
    findings.push({ category: "Rating", status: "warning", detail: `${rating} star rating. Good, but 4.5+ gets significantly more clicks.`, weight: ratingWeight });
  } else {
    earnedWeight += ratingWeight * 0.3;
    findings.push({ category: "Rating", status: "critical", detail: `${rating} star rating. Below 4.0 can deter 86% of potential customers.`, weight: ratingWeight });
  }

  const hasWebsite = !!details.website;
  const websiteWeight = 10;
  totalWeight += websiteWeight;
  if (hasWebsite) {
    earnedWeight += websiteWeight;
    findings.push({ category: "Website", status: "good", detail: "Website link is set. Visitors can learn more about your services.", weight: websiteWeight });
  } else {
    findings.push({ category: "Website", status: "critical", detail: "No website linked. You're missing a primary conversion path.", weight: websiteWeight });
  }

  const hasPhone = !!details.formatted_phone_number;
  const phoneWeight = 5;
  totalWeight += phoneWeight;
  if (hasPhone) {
    earnedWeight += phoneWeight;
    findings.push({ category: "Phone", status: "good", detail: "Phone number is listed. Customers can call directly from search.", weight: phoneWeight });
  } else {
    findings.push({ category: "Phone", status: "critical", detail: "No phone number listed. 60% of mobile searchers call businesses directly.", weight: phoneWeight });
  }

  const hasHours = !!details.opening_hours?.weekday_text?.length;
  const hoursWeight = 10;
  totalWeight += hoursWeight;
  if (hasHours) {
    earnedWeight += hoursWeight;
    findings.push({ category: "Hours", status: "good", detail: "Business hours are set. Google favors complete profiles.", weight: hoursWeight });
  } else {
    findings.push({ category: "Hours", status: "critical", detail: "Business hours not set. This reduces trust and visibility.", weight: hoursWeight });
  }

  const hasDescription = !!details.editorial_summary?.overview;
  const descWeight = 10;
  totalWeight += descWeight;
  if (hasDescription) {
    earnedWeight += descWeight;
    findings.push({ category: "Description", status: "good", detail: "Business description is present.", weight: descWeight });
  } else {
    earnedWeight += descWeight * 0.3;
    findings.push({ category: "Description", status: "warning", detail: "No business description found. A keyword-rich description improves relevance.", weight: descWeight });
  }

  const categoryCount = details.types?.filter((t) => !["point_of_interest", "establishment"].includes(t)).length || 0;
  const catWeight = 5;
  totalWeight += catWeight;
  if (categoryCount >= 3) {
    earnedWeight += catWeight;
    findings.push({ category: "Categories", status: "good", detail: `${categoryCount} categories set. Good category coverage.`, weight: catWeight });
  } else {
    earnedWeight += catWeight * 0.4;
    findings.push({ category: "Categories", status: "warning", detail: `Only ${categoryCount} category/categories. Adding more relevant categories improves discoverability.`, weight: catWeight });
  }

  const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  return { score, findings };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { businessName, city } = await req.json();

    if (!businessName || !city) {
      return new Response(
        JSON.stringify({ error: "Business name and city are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!GOOGLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Google Places API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const searchQuery = encodeURIComponent(`${businessName} ${city}`);
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${GOOGLE_API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.results || searchData.results.length === 0) {
      return new Response(
        JSON.stringify({ error: "No business found. Try a more specific name or check the city." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const mainBusiness: PlaceResult = searchData.results[0];

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${mainBusiness.place_id}&fields=name,rating,user_ratings_total,formatted_phone_number,website,url,photos,opening_hours,reviews,types,editorial_summary,address_components&key=${GOOGLE_API_KEY}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();
    const details: PlaceDetails = detailsData.result;

    const primaryType = mainBusiness.types?.find(
      (t) => !["point_of_interest", "establishment"].includes(t)
    ) || "";
    let competitors: PlaceResult[] = [];

    if (primaryType) {
      const compQuery = encodeURIComponent(`${primaryType} in ${city}`);
      const compUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${compQuery}&key=${GOOGLE_API_KEY}`;
      const compRes = await fetch(compUrl);
      const compData = await compRes.json();
      competitors = (compData.results || [])
        .filter((r: PlaceResult) => r.place_id !== mainBusiness.place_id)
        .slice(0, 3);
    }

    const { score, findings } = scoreProfile(details, competitors);

    const result = {
      business: {
        name: details.name,
        placeId: mainBusiness.place_id,
        rating: details.rating || 0,
        reviewCount: details.user_ratings_total || 0,
        phone: details.formatted_phone_number || null,
        website: details.website || null,
        mapsUrl: details.url || null,
        photoCount: details.photos?.length || 0,
        hours: details.opening_hours?.weekday_text || [],
        categories: details.types?.filter(
          (t) => !["point_of_interest", "establishment"].includes(t)
        ) || [],
        description: details.editorial_summary?.overview || null,
        recentReviews: (details.reviews || []).slice(0, 3).map((r) => ({
          rating: r.rating,
          text: r.text,
          time: r.relative_time_description,
          author: r.author_name,
        })),
      },
      score,
      findings,
      competitors: competitors.map((c) => ({
        name: c.name,
        rating: c.rating || 0,
        reviewCount: c.user_ratings_total || 0,
        photoCount: c.photos?.length || 0,
      })),
    };

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from("gbp_audits").insert({
        business_name: businessName,
        city,
        places_id: mainBusiness.place_id,
        score,
        findings,
        competitors: result.competitors,
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
