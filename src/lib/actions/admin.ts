"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

// ─── PRODUCTS CRUD ──────────────────────────────────────────
export async function createProduct(formData: FormData) {
  const supabase = await createClient()
  const product = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    category: formData.get("category") as string,
    sizes: (formData.get("sizes") as string).split(",").map((s) => s.trim()).filter(Boolean),
    colors: (formData.get("colors") as string).split(",").map((s) => s.trim()).filter(Boolean),
    images: (formData.get("images") as string).split(",").map((s) => s.trim()).filter(Boolean),
    stock: parseInt(formData.get("stock") as string),
  }
  const { error } = await supabase.from("products").insert(product)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
  revalidatePath("/fashion")
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()
  const product = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    category: formData.get("category") as string,
    sizes: (formData.get("sizes") as string).split(",").map((s) => s.trim()).filter(Boolean),
    colors: (formData.get("colors") as string).split(",").map((s) => s.trim()).filter(Boolean),
    images: (formData.get("images") as string).split(",").map((s) => s.trim()).filter(Boolean),
    stock: parseInt(formData.get("stock") as string),
  }
  const { error } = await supabase.from("products").update(product).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
  revalidatePath("/fashion")
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
  revalidatePath("/fashion")
}

// ─── VEHICLES CRUD ──────────────────────────────────────────
export async function createVehicle(formData: FormData) {
  const supabase = await createClient()
  const vehicle = {
    name: formData.get("name") as string,
    model: formData.get("model") as string,
    brand: formData.get("brand") as string,
    seats: parseInt(formData.get("seats") as string),
    price_per_day: parseFloat(formData.get("price_per_day") as string),
    deposit: parseFloat(formData.get("deposit") as string),
    images: (formData.get("images") as string).split(",").map((s) => s.trim()).filter(Boolean),
    description: formData.get("description") as string,
    is_available: formData.get("is_available") === "true",
  }
  const { error } = await supabase.from("vehicles").insert(vehicle)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
  revalidatePath("/rentals")
}

export async function updateVehicle(id: string, formData: FormData) {
  const supabase = await createClient()
  const vehicle = {
    name: formData.get("name") as string,
    model: formData.get("model") as string,
    brand: formData.get("brand") as string,
    seats: parseInt(formData.get("seats") as string),
    price_per_day: parseFloat(formData.get("price_per_day") as string),
    deposit: parseFloat(formData.get("deposit") as string),
    images: (formData.get("images") as string).split(",").map((s) => s.trim()).filter(Boolean),
    description: formData.get("description") as string,
    is_available: formData.get("is_available") === "true",
  }
  const { error } = await supabase.from("vehicles").update(vehicle).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
  revalidatePath("/rentals")
}

export async function deleteVehicle(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("vehicles").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
  revalidatePath("/rentals")
}

// ─── MATERIALS CRUD ────────────────────────────────────────
export async function createMaterial(formData: FormData) {
  const supabase = await createClient()
  const material = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    unit: formData.get("unit") as string,
    stock: parseInt(formData.get("stock") as string),
    images: (formData.get("images") as string).split(",").map((s) => s.trim()).filter(Boolean),
    category: formData.get("category") as string,
  }
  const { error } = await supabase.from("materials").insert(material)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
  revalidatePath("/construction")
}

export async function updateMaterial(id: string, formData: FormData) {
  const supabase = await createClient()
  const material = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    unit: formData.get("unit") as string,
    stock: parseInt(formData.get("stock") as string),
    images: (formData.get("images") as string).split(",").map((s) => s.trim()).filter(Boolean),
    category: formData.get("category") as string,
  }
  const { error } = await supabase.from("materials").update(material).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
  revalidatePath("/construction")
}

export async function deleteMaterial(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("materials").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
  revalidatePath("/construction")
}

// ─── ORDER/BOOKING/INQUIRY STATUS ──────────────────────────
export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("orders").update({ status }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
}

export async function updateBookingStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("rental_bookings").update({ status }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
}

export async function updateInquiryStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
}

// ─── IMAGE UPLOAD ───────────────────────────────────────────
export async function uploadImage(formData: FormData) {
  const supabase = await createClient()
  const file = formData.get("file") as File
  const bucket = formData.get("bucket") as string || "products"

  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

  const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
    contentType: file.type,
  })

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return publicUrl
}
