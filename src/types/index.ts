/**
 * Core type definitions for KSK Enterprise.
 * These mirror the Supabase database schema.
 */

// ─── Product (Fashion / Smocks) ─────────────────────────────
export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  sizes: string[]
  colors: string[]
  images: string[]
  stock: number
  length_cm: number | null
  width_cm: number | null
  show_dimensions: boolean
  show_sizes: boolean
  show_colors: boolean
  created_at: string
}

// ─── Vehicle (Car Rentals) ────────────────────────────────────
export interface Vehicle {
  id: string
  name: string
  model: string
  brand: string
  seats: number
  price_per_day: number
  deposit: number
  images: string[]
  description: string | null
  is_available: boolean
  created_at: string
}

// ─── Material (Construction) ──────────────────────────────────
export interface Material {
  id: string
  name: string
  description: string | null
  price: number
  unit: string
  stock: number
  images: string[]
  category: string
  created_at: string
}

// ─── Order (Fashion & Materials) ──────────────────────────────
export interface OrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  customer_name: string
  phone: string
  address: string
  payment_method: "momo" | "bank_card" | "cash"
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  created_at: string
}

// ─── Rental Booking ───────────────────────────────────────────
export interface RentalBooking {
  id: string
  vehicle_id: string
  customer_name: string
  phone: string
  rental_date: string
  days: number
  purpose: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  created_at: string
}

// ─── Inquiry (Construction Services) ──────────────────────────
export interface Inquiry {
  id: string
  name: string
  phone: string
  email: string | null
  message: string
  type: "labour" | "construction" | "general"
  status: "new" | "in_progress" | "resolved"
  created_at: string
}

// ─── User Profile (Auth) ──────────────────────────────────────
export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: "user" | "admin"
  created_at: string
}

// ─── Cart Item (Client-side only) ───────────────────────────
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
}
