import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { reference } = body
    const supabase = await createClient()

    // Verify transaction with Paystack
    const verification = await verifyTransaction(reference)
    if (!verification.success) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    // Update order status to confirmed
    const { data, error } = await supabase
      .from("orders")
      .update({ 
        status: "confirmed",
        paid_at: new Date().toISOString(),
        authorization_code: verification.authorization_code || null
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Order update error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, order: data }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function verifyTransaction(reference: string) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY
    if (!secretKey) {
      console.error("PAYSTACK_SECRET_KEY not configured")
      return { success: false }
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    
    if (data.status && data.data.status === "success") {
      return {
        success: true,
        authorization_code: data.data.authorization_code || null,
      }
    }
    
    return { success: false }
  } catch (error) {
    console.error("Transaction verification error:", error)
    return { success: false }
  }
}
