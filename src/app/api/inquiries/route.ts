import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        message: body.message,
        type: body.type,
        status: "new",
      })
      .select()
      .single()

    if (error) {
      console.error("Inquiry creation error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, inquiry: data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
