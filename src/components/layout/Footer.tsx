"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react"

/**
 * Footer component for KSK Enterprise.
 * Displays company info, quick links, and contact details.
 */
export function Footer() {
  const pathname = usePathname()

  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <footer className="bg-ksk-dark text-gray-400">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img src="/logo.jpeg" alt="KSK Enterprise" className="w-full h-full object-contain" />
              </div>
              <span className="text-white font-bold text-lg">KSK Enterprise</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Your trusted partner in Wa, Upper West Region, Ghana. We provide quality
              traditional smocks, reliable car rentals, and premium construction
              materials & services.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-ksk-gold hover:text-ksk-dark transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-ksk-gold hover:text-ksk-dark transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/fashion" className="hover:text-ksk-gold transition-colors">
                  Fashion & Smocks
                </Link>
              </li>
              <li>
                <Link href="/rentals" className="hover:text-ksk-gold transition-colors">
                  Car Rentals
                </Link>
              </li>
              <li>
                <Link href="/construction" className="hover:text-ksk-gold transition-colors">
                  Construction Materials
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-ksk-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-ksk-gold transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>Traditional Smock Sales</li>
              <li>Car Rental (Weddings & Personal)</li>
              <li>Building Materials Supply</li>
              <li>Construction Labour</li>
              <li>Contracting Services</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-ksk-gold shrink-0" />
                <span>Wa, Upper West Region, Ghana</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-ksk-gold shrink-0" />
                <span>0242 070 938</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-ksk-gold shrink-0" />
                <span>0202 348 762</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-ksk-gold shrink-0" />
                <span>info@kskenterprise.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© 2024 KSK Enterprise. All rights reserved.</p>
          <p>
            Built with care in{" "}
            <span className="text-ksk-gold font-medium">Wa, Ghana</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
