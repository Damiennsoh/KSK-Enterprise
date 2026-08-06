import Link from "next/link"
import { Phone, MapPin } from "lucide-react"

/**
 * Contact call-to-action section on homepage.
 */
export function ContactCTA() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ksk-dark relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-ksk-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-ksk-gold/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Visit us in Wa or give us a call. We're here to help with your smock
          orders, car rental bookings, and construction material needs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="tel:0242070938"
            className="flex items-center gap-2 px-6 py-3 bg-ksk-gold text-ksk-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Call 0242 070 938
          </a>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-6 py-3 border border-gray-600 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            <MapPin className="w-5 h-5" />
            Visit Our Office
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Wa, Upper West Region
          </span>
          <span>|</span>
          <span>Mon - Sat: 8:00 AM - 6:00 PM</span>
        </div>
      </div>
    </section>
  )
}
