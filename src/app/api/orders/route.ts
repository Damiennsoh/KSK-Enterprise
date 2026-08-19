import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // If paystack_reference is provided, verify the transaction before creating order
    if (body.paystack_reference) {
      const verification = await verifyTransaction(body.paystack_reference)
      if (!verification.success) {
        return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
      }
      // Store authorization_code if available for recurring payments
      body.authorization_code = verification.authorization_code || null
    }

    const { data, error } = await supabase
      .from("orders")
      .insert({
        items: body.items,
        total: body.total,
        customer_name: body.customer_name,
        phone: body.phone,
        email: body.email,
        address: body.address,
        payment_method: body.payment_method,
        paystack_reference: body.paystack_reference || null,
        authorization_code: body.authorization_code || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Order creation error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, order: data }, { status: 201 })
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
