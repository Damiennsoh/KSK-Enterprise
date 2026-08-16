"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

/**
 * Next.js `redirect()` throws a special error that MUST NOT be caught by
 * the generic `catch (error)` blocks below. Without this helper, every
 * successful signIn/signUp/signOut would surface as
 *   "An unexpected error occurred"
 * even though the user was already authenticated and cookies were written.
 */
function isRedirectError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false
  const digest = (error as { digest?: unknown }).digest
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")
}

export async function signUp(formData: FormData) {
  try {
    const supabase = await createClient()
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string
    const phone = formData.get("phone") as string

    console.log("Attempting sign up for:", email)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    })

    if (error) {
      console.error("Sign up error:", error)
      return { error: error.message }
    }

    console.log("Sign up successful, user ID:", data.user?.id)

    // Create profile manually since trigger is disabled
    if (data.user?.id) {
      const adminClient = createAdminClient()
      const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
      const isAdmin = adminEmails.includes(email)
      
      const { error: profileError } = await adminClient.from("profiles").insert({
        id: data.user.id,
        email: email,
        full_name: fullName,
        phone: phone,
        role: isAdmin ? "admin" : "user"
      })
      
      if (profileError) {
        console.error("Failed to create profile:", profileError)
        // Don't fail registration if profile creation fails
      }
    }

    revalidatePath("/", "layout")
    redirect("/login?message=Account created successfully. Please sign in.")
  } catch (error) {
    if (isRedirectError(error)) throw error // Let Next.js handle the redirect
    console.error("Unexpected sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signIn(formData: FormData) {
  try {
    const supabase = await createClient()
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("Attempting sign in for:", email)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      console.error("Sign in error:", error)
      return { error: error.message }
    }

    console.log("Sign in successful for:", email)
    revalidatePath("/", "layout")
    redirect("/")
  } catch (error) {
    if (isRedirectError(error)) throw error // Let Next.js handle the redirect
    console.error("Unexpected sign in error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath("/", "layout")
    redirect("/")
  } catch (error) {
    if (isRedirectError(error)) throw error // Let Next.js handle the redirect
    console.error("Unexpected sign out error:", error)
    revalidatePath("/", "layout")
    redirect("/")
  }
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function isAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: admin, error } = await supabase.rpc("is_admin")
  return !error && admin === true
}
