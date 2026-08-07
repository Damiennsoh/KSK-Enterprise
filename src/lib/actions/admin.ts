"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

async function getAdminClient() {
  const client = await createClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: admin, error } = await client.rpc("is_admin")
  if (error || admin !== true) throw new Error("Forbidden")
  return client
}

// ─── PRODUCTS CRUD ──────────────────────────────────────────
export async function createProduct(formData: FormData) {
  const supabase = await getAdminClient()
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
  const supabase = await getAdminClient()
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
  const supabase = await getAdminClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
  revalidatePath("/fashion")
}

// ─── VEHICLES CRUD ──────────────────────────────────────────
export async function createVehicle(formData: FormData) {
  const supabase = await getAdminClient()
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
  const supabase = await getAdminClient()
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
  const supabase = await getAdminClient()
  const { error } = await supabase.from("vehicles").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
  revalidatePath("/rentals")
}

// ─── MATERIALS CRUD ────────────────────────────────────────
export async function createMaterial(formData: FormData) {
  const supabase = await getAdminClient()
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
  const supabase = await getAdminClient()
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
  const supabase = await getAdminClient()
  const { error } = await supabase.from("materials").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
  revalidatePath("/construction")
}

// ─── ORDER/BOOKING/INQUIRY STATUS ──────────────────────────
export async function updateOrderStatus(id: string, status: string) {
  const supabase = await getAdminClient()
  const { error } = await supabase.from("orders").update({ status }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
}

export async function updateBookingStatus(id: string, status: string) {
  const supabase = await getAdminClient()
  const { error } = await supabase.from("rental_bookings").update({ status }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
}

export async function updateInquiryStatus(id: string, status: string) {
  const supabase = await getAdminClient()
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
}

// ─── HERO CAROUSEL CRUD ────────────────────────────────────
export async function createHeroSlide(formData: FormData) {
  const supabase = await getAdminClient()
  const { error } = await supabase.from("hero_slides").insert({
    eyebrow: String(formData.get("eyebrow") || ""),
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    cta_label: String(formData.get("cta_label") || "Explore"),
    cta_href: String(formData.get("cta_href") || "/"),
    image_url: String(formData.get("image_url") || ""),
    display_order: Number(formData.get("display_order") || 0),
    is_active: formData.get("is_active") !== "false",
  })
  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function updateHeroSlide(id: string, formData: FormData) {
  const supabase = await getAdminClient()
  const { error } = await supabase.from("hero_slides").update({
    eyebrow: String(formData.get("eyebrow") || ""),
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    cta_label: String(formData.get("cta_label") || "Explore"),
    cta_href: String(formData.get("cta_href") || "/"),
    image_url: String(formData.get("image_url") || ""),
    display_order: Number(formData.get("display_order") || 0),
    is_active: formData.get("is_active") !== "false",
  }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function deleteHeroSlide(id: string) {
  const supabase = await getAdminClient()
  const { error } = await supabase.from("hero_slides").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function toggleHeroSlide(id: string, isActive: boolean) {
  const supabase = await getAdminClient()
  const { error } = await supabase.from("hero_slides").update({ is_active: isActive }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/admin")
}

// ─── IMAGE UPLOAD ───────────────────────────────────────────
export async function uploadImage(formData: FormData) {
  const supabase = await getAdminClient()
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
