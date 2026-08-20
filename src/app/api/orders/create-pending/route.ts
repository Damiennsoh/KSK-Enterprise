import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // Generate Paystack reference if not provided
    const paystackReference = body.paystack_reference || `KSK-${Date.now()}`

    // Deduct stock for each item
    for (const item of body.items) {
      if (item.category === 'fashion') {
        // Get current stock
        const { data: product, error: fetchError } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.product_id)
          .single()
        
        if (fetchError || !product) {
          console.error("Failed to fetch product stock:", item.product_id, fetchError)
          return NextResponse.json({ error: "Failed to verify stock availability" }, { status: 500 })
        }
        
        if (product.stock < item.quantity) {
          return NextResponse.json({ error: "Insufficient stock for one or more items" }, { status: 400 })
        }
        
        // Update stock
        const { error: stockError } = await supabase
          .from("products")
          .update({ stock: product.stock - item.quantity })
          .eq("id", item.product_id)
        
        if (stockError) {
          console.error("Stock deduction error for product:", item.product_id, stockError)
          return NextResponse.json({ error: "Failed to update stock" }, { status: 500 })
        }
      } else if (item.category === 'construction') {
        // Get current stock
        const { data: material, error: fetchError } = await supabase
          .from("materials")
          .select("stock")
          .eq("id", item.product_id)
          .single()
        
        if (fetchError || !material) {
          console.error("Failed to fetch material stock:", item.product_id, fetchError)
          return NextResponse.json({ error: "Failed to verify stock availability" }, { status: 500 })
        }
        
        if (material.stock < item.quantity) {
          return NextResponse.json({ error: "Insufficient stock for one or more items" }, { status: 400 })
        }
        
        // Update stock
        const { error: stockError } = await supabase
          .from("materials")
          .update({ stock: material.stock - item.quantity })
          .eq("id", item.product_id)
        
        if (stockError) {
          console.error("Stock deduction error for material:", item.product_id, stockError)
          return NextResponse.json({ error: "Failed to update stock" }, { status: 500 })
        }
      }
    }

    // Create order with pending status and Paystack reference
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
        paystack_reference: paystackReference,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Order creation error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, order: data, paystack_reference: paystackReference }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
