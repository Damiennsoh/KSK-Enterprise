
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.0"

/**
 * Supabase Edge Function: Paystack Webhook Handler
 * 
 * Deploy with:
 * supabase functions deploy paystack-webhook
 * 
 * Then set your Paystack webhook URL to:
 * https://your-project.supabase.co/functions/v1/paystack-webhook
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "x-client-info, apikey, content-type, x-paystack-signature",
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const rawPayload = await req.text()
    const payload = JSON.parse(rawPayload)
    const event = payload.event
    const data = payload.data

    // Verify Paystack signature (mandatory for security)
    const signature = req.headers.get("x-paystack-signature")
    const secretKey = Deno.env.get("PAYSTACK_SECRET_KEY")
    
    if (!signature || !secretKey) {
      console.error("Missing signature or secret key")
      return new Response(JSON.stringify({ error: "Missing signature or secret key" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const hash = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(rawPayload + secretKey))
    const hashArray = Array.from(new Uint8Array(hash))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    if (hashHex !== signature) {
      console.error("Invalid webhook signature")
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Initialize Supabase admin client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    if (event === "charge.success") {
      const reference = data.reference

      // Update order with payment confirmation
      const { error } = await supabase
        .from("orders")
        .update({
          status: "confirmed",
          paystack_reference: reference,
          paid_at: new Date().toISOString(),
        })
        .eq("paystack_reference", reference)

      if (error) {
        console.error("Webhook error:", error)
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      console.log(`Payment confirmed for reference: ${reference}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Webhook error:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
