"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import type { StockSettings, DeliveryZone } from "@/types"

// ─── STOCK SETTINGS ───────────────────────────────────────────
export async function getStockSettings(): Promise<StockSettings | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("stock_settings").select("*").single()
  if (error) return null
  return data
}

export async function updateStockSettings(formData: FormData) {
  const supabase = await createAdminClient()
  const settings = {
    low_stock_threshold: parseInt(formData.get("low_stock_threshold") as string),
    limited_stock_threshold: parseInt(formData.get("limited_stock_threshold") as string),
    custom_labels: {
      low_stock: formData.get("label_low_stock") as string || "Low Stock",
      limited_stock: formData.get("label_limited_stock") as string || "Limited",
    }
  }
  const { error } = await supabase.from("stock_settings").update(settings).eq("id", 1)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
  revalidatePath("/fashion")
}

// ─── DELIVERY ZONES ───────────────────────────────────────────
export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("delivery_zones").select("*").order("display_order", { ascending: true })
  if (error) throw new Error(error.message)
  return data || []
}

export async function createDeliveryZone(formData: FormData) {
  const supabase = await createAdminClient()
  const zone = {
    zone_name: formData.get("zone_name") as string,
    base_delivery_cost: parseFloat(formData.get("base_delivery_cost") as string),
    display_order: parseInt(formData.get("display_order") as string) || 0,
  }
  const { error } = await supabase.from("delivery_zones").insert(zone)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
}

export async function updateDeliveryZone(id: number, formData: FormData) {
  const supabase = await createAdminClient()
  const zone = {
    zone_name: formData.get("zone_name") as string,
    base_delivery_cost: parseFloat(formData.get("base_delivery_cost") as string),
    display_order: parseInt(formData.get("display_order") as string) || 0,
    is_active: formData.get("is_active") === "true",
  }
  const { error } = await supabase.from("delivery_zones").update(zone).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
}

export async function deleteDeliveryZone(id: number) {
  const supabase = await createAdminClient()
  const { error } = await supabase.from("delivery_zones").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
}
