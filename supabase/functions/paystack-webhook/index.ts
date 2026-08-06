
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
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    const event = payload.event
    const data = payload.data

    // Initialize Supabase admin client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Verify Paystack signature (recommended for production)
    // const signature = req.headers.get("x-paystack-signature")
    // const hash = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(JSON.stringify(payload) + Deno.env.get("PAYSTACK_SECRET_KEY")))
    // Verify hash matches signature...

    if (event === "charge.success") {
      const reference = data.reference

      // Update order with payment confirmation
      const { error } = await supabase
        .from("orders")
        .update({
          status: "confirmed",
          paystack_reference: reference,
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
