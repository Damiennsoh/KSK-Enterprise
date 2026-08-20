import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.0";

// 1. Define CORS headers specifically for webhooks
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests immediately
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const rawPayload = await req.text();

    // 2. Verify Signature BEFORE doing anything else
    const signature = req.headers.get("x-paystack-signature");
    const secretKey = Deno.env.get("PAYSTACK_SECRET_KEY");

    if (!signature || !secretKey) {
      console.error("Webhook rejected: Missing signature or secret key");
      return new Response(
        JSON.stringify({ error: "Missing signature or secret key" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // HMAC-SHA512 Verification Logic using Web Crypto API
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    const messageData = encoder.encode(rawPayload);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    );

    const hashBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    // Constant-time comparison to prevent timing attacks
    if (!constantTimeCompare(hashHex, signature)) {
      console.error("Webhook rejected: Invalid signature");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Initialize Supabase with SERVICE ROLE KEY (Admin access)
    // This bypasses Row Level Security (RLS) and Auth requirements
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const payload = JSON.parse(rawPayload);
    const event = payload.event;
    const data = payload.data;

    if (event === "charge.success") {
      const reference = data.reference;

      // Idempotency check: Don't process if already confirmed
      const { data: existing } = await supabase
        .from("orders")
        .select("status")
        .eq("paystack_reference", reference)
        .single();

      if (existing?.status !== "confirmed") {
        const { error: updateError } = await supabase
          .from("orders")
          .update({ 
            status: "confirmed", 
            paid_at: new Date().toISOString() 
          })
          .eq("paystack_reference", reference);

        if (updateError) {
          console.error(`Database update failed for ${reference}:`, updateError);
          throw updateError;
        }
        
        console.log(`Order ${reference} confirmed via webhook`);
      } else {
        console.log(`Order ${reference} already confirmed, skipping duplicate`);
      }
    }

    // 4. Return 200 OK with CORS headers
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper function for constant-time string comparison
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}