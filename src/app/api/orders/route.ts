import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("orders")
      .insert({
        items: body.items,
        total: body.total,
        customer_name: body.customer_name,
        phone: body.phone,
        address: body.address,
        payment_method: body.payment_method,
        paystack_reference: body.paystack_reference || null,
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
