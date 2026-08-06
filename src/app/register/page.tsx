"use client"

import { useState } from "react"
import Link from "next/link"
import { UserPlus, Mail, Lock, Eye, EyeOff, User, Phone, Loader2 } from "lucide-react"
import { signUp } from "@/lib/actions/auth"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match!")
      setLoading(false)
      return
    }

    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ksk-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-ksk-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-7 h-7 text-ksk-gold" />
            </div>
            <h1 className="text-2xl font-bold text-ksk-dark">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join KSK Enterprise today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm text-center">{error}</div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ksk-dark mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" name="fullName" required className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold" placeholder="Your full name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ksk-dark mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" name="email" required className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ksk-dark mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" name="phone" required pattern="0[0-9]{9}" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold" placeholder="024XXXXXXX" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ksk-dark mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? "text" : "password"} name="password" required minLength={6} className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold" placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ksk-dark mb-1">Confirm Password</label>
              <input type="password" name="confirmPassword" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold" placeholder="Confirm your password" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-ksk-gold text-ksk-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account...</> : <><UserPlus className="w-4 h-4" />Create Account</>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-500">Already have an account?{" "}
              <Link href="/login" className="text-ksk-gold font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
