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
