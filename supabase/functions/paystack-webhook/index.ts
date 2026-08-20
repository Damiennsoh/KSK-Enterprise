import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "x-client-info, apikey, content-type, x-paystack-signature",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const rawPayload = await req.text();
    const payload = JSON.parse(rawPayload);
    const event = payload.event;
    const data = payload.data;

    // ✅ CORRECT SIGNATURE VERIFICATION (HMAC-SHA512)
    const signature = req.headers.get("x-paystack-signature");
    const secretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    
    if (!signature || !secretKey) {
      console.error("Missing signature or secret key");
      return new Response(
        JSON.stringify({ error: "Missing signature or secret key" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate HMAC-SHA512 hash correctly
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
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Use constant-time comparison to prevent timing attacks
    if (!constantTimeCompare(hashHex, signature)) {
      console.error("Invalid webhook signature");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase admin client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    if (event === "charge.success") {
      const reference = data.reference;
      
      // Check if order is already confirmed
      const { data: existingOrder } = await supabase
        .from("orders")
        .select("status")
        .eq("paystack_reference", reference)
        .single();
        
      if (existingOrder?.status === "confirmed") {
        console.log(`Order ${reference} already confirmed, skipping`);
        return new Response(
          JSON.stringify({ received: true, skipped: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update order status
      const { error } = await supabase
        .from("orders")
        .update({
          status: "confirmed",
          paystack_reference: reference,
          paid_at: new Date().toISOString(), // Track payment time
        })
        .eq("paystack_reference", reference);

      if (error) {
        console.error("Webhook DB error:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Payment confirmed for reference: ${reference}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// ✅ Constant-time string comparison to prevent timing attacks
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
