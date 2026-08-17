"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useTransition } from "react"
import { Menu, X, ShoppingCart, Phone, LogIn, LogOut, User, Loader2 } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { createClient } from "@/lib/supabase/client"
import { signOut } from "@/lib/actions/auth"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isLoggingOut, startLogoutTransition] = useTransition()
  const { totalItems } = useCart()

  useEffect(() => {
    let mounted = true
    const supabase = createClient()

    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return

        if (session?.user) {
          setUser({ email: session.user.email ?? "" })
          try {
            const { data: admin } = await supabase.rpc("is_admin")
            setIsAdmin(admin === true)
          } catch (rpcErr: any) {
            console.warn("is_admin RPC failed:", rpcErr?.message ?? rpcErr)
            setIsAdmin(false)
          }
        } else {
          setUser(null)
          setIsAdmin(false)
        }
      } catch (err: any) {
        console.warn("Auth session check failed:", err?.message ?? err)
        setUser(null)
        setIsAdmin(false)
      } finally {
        if (mounted) setAuthLoading(false)
      }
    }

    checkAdmin()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setAuthLoading(true)
      if (session?.user) {
        setUser({ email: session.user.email ?? "" })
        ;(async () => {
          try {
            const { data: admin } = await supabase.rpc("is_admin")
            setIsAdmin(admin === true)
          } catch { setIsAdmin(false) }
          setAuthLoading(false)
        })()
      } else {
        setUser(null)
        setIsAdmin(false)
        setAuthLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = () => {
    startLogoutTransition(async () => {
      try {
        await signOut()
      } catch (err: any) {
        console.error("Logout failed:", err?.message ?? err)
      }
    })
  }

  if (pathname?.startsWith("/admin")) {
    return null
  }

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
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <img src="/logo.jpeg" alt="KSK Enterprise" className="w-full h-full object-contain" />
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

            {!authLoading && isAdmin && (
              <Link href="/admin" className="hidden sm:block px-4 py-1.5 bg-ksk-gold text-ksk-dark text-sm font-semibold rounded-md hover:bg-amber-400 transition-colors">
                Admin
              </Link>
            )}

            {authLoading ? (
              <button disabled className="hidden sm:flex items-center gap-1 px-3 py-1.5 border border-gray-700 text-gray-500 text-sm rounded-md cursor-not-allowed" aria-label="Checking auth">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="max-w-[100px] truncate">...</span>
              </button>
            ) : user ? (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 border border-gray-600 text-gray-300 text-sm rounded-md hover:bg-white/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                title={`Signed in as ${user.email}`}
              >
                {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                {isLoggingOut ? "Signing out" : "Logout"}
              </button>
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
              {authLoading ? (
                <div className="flex items-center gap-2 px-3 py-2 text-gray-500 rounded-md text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />Checking...
                </div>
              ) : user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400">
                    <User className="w-3.5 h-3.5" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-ksk-gold hover:bg-gray-800 rounded-md transition-colors text-sm font-medium disabled:opacity-60"
                  >
                    {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                    {isLoggingOut ? "Signing out..." : "Logout"}
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-ksk-gold hover:bg-gray-800 rounded-md transition-colors text-sm font-medium">
                  <LogIn className="w-4 h-4" />Login
                </Link>
              )}
              {!authLoading && isAdmin && (
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
