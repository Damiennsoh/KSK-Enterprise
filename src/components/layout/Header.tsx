"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ShoppingCart, Phone, LogIn, LogOut, User } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { createClient } from "@/lib/supabase/client"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const { totalItems } = useCart()

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        setUser({ email: authUser.email! })
        const { data: admin } = await supabase.rpc("is_admin")
        setIsAdmin(admin === true)
      }
    }
    checkAdmin()

    const { data: { subscription } } = createClient().auth.onAuthStateChange(() => {
      checkAdmin()
    })

    return () => subscription.unsubscribe()
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/fashion", label: "Fashion" },
    { href: "/rentals", label: "Car Rentals" },
    { href: "/construction", label: "Construction" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-ksk-dark shadow-lg">
      {/* Top bar */}
      <div className="bg-ksk-gold text-ksk-dark py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" />
            <span>0242 070 938 / 0202 348 762</span>
          </div>
          <span className="hidden sm:inline">Wa, Upper West Region, Ghana</span>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-ksk-gold rounded-full flex items-center justify-center">
              <span className="text-ksk-dark font-bold text-lg">K</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-tight">KSK</span>
              <span className="text-ksk-gold text-xs leading-tight">ENTERPRISE</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-300 hover:text-ksk-gold transition-colors text-sm font-medium">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-ksk-gold transition-colors" aria-label="Shopping Cart">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-ksk-red text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link href="/admin" className="hidden sm:block px-4 py-1.5 bg-ksk-gold text-ksk-dark text-sm font-semibold rounded-md hover:bg-amber-400 transition-colors">
                Admin
              </Link>
            )}

            {user ? (
              <Link href="/login" className="hidden sm:flex items-center gap-1 px-3 py-1.5 border border-gray-600 text-gray-300 text-sm rounded-md hover:bg-white/10 transition-colors">
                <LogOut className="w-4 h-4" />Logout
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center gap-1 px-3 py-1.5 border border-gray-600 text-gray-300 text-sm rounded-md hover:bg-white/10 transition-colors">
                <LogIn className="w-4 h-4" />Login
              </Link>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-300 hover:text-white" aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-700">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-ksk-gold hover:bg-gray-800 px-3 py-2 rounded-md transition-colors text-sm font-medium">
                  {link.label}
                </Link>
              ))}
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-ksk-gold hover:bg-gray-800 rounded-md transition-colors text-sm font-medium">
                {user ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                {user ? "Logout" : "Login"}
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="mt-2 px-3 py-2 bg-ksk-gold text-ksk-dark text-sm font-semibold rounded-md text-center">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
