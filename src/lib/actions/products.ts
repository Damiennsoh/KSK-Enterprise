"use server"

import { createClient } from "@/lib/supabase/server"
import type { Product, Vehicle, Material, Order, RentalBooking, Inquiry } from "@/types"

// ─── PRODUCTS ───────────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()
  if (error) return null
  return data
}

// ─── VEHICLES ────────────────────────────────────────────────
export async function getVehicles(): Promise<Vehicle[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).single()
  if (error) return null
  return data
}

// ─── MATERIALS ──────────────────────────────────────────────
export async function getMaterials(): Promise<Material[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("materials").select("*").order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

export async function getMaterialById(id: string): Promise<Material | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("materials").select("*").eq("id", id).single()
  if (error) return null
  return data
}

// ─── ORDERS ─────────────────────────────────────────────────
export async function createOrder(order: Omit<Order, "id" | "created_at">): Promise<Order> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("orders").insert(order).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function getOrders(): Promise<Order[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

// ─── RENTAL BOOKINGS ────────────────────────────────────────
export async function createRentalBooking(booking: Omit<RentalBooking, "id" | "created_at" | "status">): Promise<RentalBooking> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("rental_bookings").insert({ ...booking, status: "pending" }).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function getRentalBookings(): Promise<RentalBooking[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("rental_bookings").select("*").order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

// ─── INQUIRIES ──────────────────────────────────────────────
export async function createInquiry(inquiry: Omit<Inquiry, "id" | "created_at" | "status">): Promise<Inquiry> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("inquiries").insert({ ...inquiry, status: "new" }).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

// ─── USERS ───────────────────────────────────────────────────
export async function getUserCount(): Promise<number> {
  const supabase = await createClient()
  const { data, error, count } = await supabase.from("profiles").select("*", { count: "exact", head: true })
  if (error) throw new Error(error.message)
  return count || 0
}

// ─── STOCK SETTINGS ─────────────────────────────────────────
export async function getStockSettingsForDisplay() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("stock_settings").select("*").single()
  if (error) {
    // Return defaults if settings don't exist
    return {
      low_stock_threshold: 10,
      limited_stock_threshold: 20,
      custom_labels: { low_stock: "Low Stock", limited_stock: "Limited" }
    }
  }
  return data
}
