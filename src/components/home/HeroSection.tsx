"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

type HeroSlide = {
  id?: string
  eyebrow: string
  title: string
  description: string
  cta_label: string
  cta_href: string
  image_url: string
}

const fallbackSlides: HeroSlide[] = [
  { eyebrow: "KSK Fashion · Made in the North", title: "Traditional smocks, made to be remembered.", description: "Discover hand-finished smocks and fugu from Wa, crafted with pride for weddings, celebrations, and everyday Ghanaian style.", cta_label: "Shop smocks & fugu", cta_href: "/fashion", image_url: "/images/hero/smock.png" },
  { eyebrow: "Still part of KSK", title: "Build boldly. Move confidently.", description: "Our trusted construction support and practical mobility services are still here whenever you need them.", cta_label: "Explore our other services", cta_href: "/construction", image_url: "/images/hero/construction.png" },
  { eyebrow: "Still part of KSK", title: "The right car for every road.", description: "Comfortable, dependable vehicles for business, family, and every journey in between.", cta_label: "View car rentals", cta_href: "/rentals", image_url: "/images/hero/rental.png" },
]

export function HeroSection({ slides = fallbackSlides }: { slides?: HeroSlide[] }) {
  const items = slides.length ? slides : fallbackSlides
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % items.length), 6500)
    return () => window.clearInterval(timer)
  }, [items.length])

  const slide = items[active]

  return (
    <section className="relative min-h-[620px] overflow-hidden bg-ksk-dark text-white" aria-label="Featured services">
      {items.map((item, index) => (
        <div key={item.id ?? item.image_url} className={`absolute inset-0 transition-opacity duration-700 ${index === active ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={index !== active}>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.image_url})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-ksk-dark via-ksk-dark/75 to-ksk-dark/15" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-ksk-gold">{slide.eyebrow}</p>
          <h1 className="max-w-xl text-balance text-4xl font-bold leading-tight sm:text-6xl">{slide.title}</h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-white/75">{slide.description}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href={slide.cta_href} className="inline-flex items-center justify-center gap-2 rounded-lg bg-ksk-gold px-6 py-3 font-semibold text-ksk-dark transition hover:bg-amber-400">
              {slide.cta_label}<ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur-sm transition hover:bg-white/20">Talk to our team</Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-10 mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-2" aria-label="Choose hero slide">
          {items.map((item, index) => <button key={item.id ?? index} type="button" aria-label={`Show slide ${index + 1}`} aria-current={index === active} onClick={() => setActive(index)} className={`h-1.5 rounded-full transition-all ${index === active ? "w-12 bg-ksk-gold" : "w-6 bg-white/40"}`} />)}
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous slide" onClick={() => setActive((active - 1 + items.length) % items.length)} className="rounded-full border border-white/30 p-2 transition hover:bg-white/15"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" aria-label="Next slide" onClick={() => setActive((active + 1) % items.length)} className="rounded-full border border-white/30 p-2 transition hover:bg-white/15"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>
    </section>
  )
}
