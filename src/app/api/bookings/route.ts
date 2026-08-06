import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("rental_bookings")
      .insert({
        vehicle_id: body.vehicle_id,
        customer_name: body.customer_name,
        phone: body.phone,
        rental_date: body.rental_date,
        days: body.days,
        purpose: body.purpose,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Booking creation error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, booking: data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
