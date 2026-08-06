"use client"

import Link from "next/link"
import { ArrowRight, ShoppingBag, Car, HardHat } from "lucide-react"

/**
 * Hero section for the homepage.
 * Full-width banner with call-to-action buttons.
 */
export function HeroSection() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 bg-ksk-gold/20 text-ksk-gold border border-ksk-gold/30 rounded-full text-sm font-medium mb-6">
            Based in Wa, Upper West Region, Ghana
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Welcome to{" "}
            <span className="text-ksk-gold">KSK Enterprise</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your one-stop destination for traditional hand-woven smocks, reliable
            car rentals, and quality construction materials & services.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/fashion"
              className="flex items-center gap-2 px-6 py-3 bg-ksk-gold text-ksk-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors w-full sm:w-auto justify-center"
            >
              <ShoppingBag className="w-5 h-5" />
              Shop Smocks
            </Link>
            <Link
              href="/rentals"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/30 font-semibold rounded-lg hover:bg-white/20 transition-colors w-full sm:w-auto justify-center"
            >
              <Car className="w-5 h-5" />
              Rent a Car
            </Link>
            <Link
              href="/construction"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/30 font-semibold rounded-lg hover:bg-white/20 transition-colors w-full sm:w-auto justify-center"
            >
              <HardHat className="w-5 h-5" />
              Buy Materials
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowRight className="w-6 h-6 text-white/60 rotate-90" />
      </div>
    </section>
  )
}
