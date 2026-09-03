import Link from "next/link"
import { Car, HardHat, ArrowRight } from "lucide-react"

/** KSK's non-fashion services remain easy to find below the fashion showcase. */
export function BusinessCards() {
  const businesses = [
    {
      title: "Car Rentals",
      description: "Reliable vehicles for weddings, personal trips, and corporate events. From sedans to SUVs and buses, we have the right car for your needs.",
      icon: Car,
      href: "/rentals",
      image: "/car.jpg",
      color: "bg-ksk-brown",
    },
    {
      title: "Construction",
      description: "Quality building materials including cement, blocks, iron rods, and roofing sheets. Plus professional labour and contracting services.",
      icon: HardHat,
      href: "/construction",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600",
      color: "bg-ksk-green",
    },
  ]

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-ksk-dark sm:text-4xl">More from KSK Enterprise</h2>
          <p className="mx-auto max-w-2xl text-gray-600">Need a vehicle or building support? Our other services are still here when you need them.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {businesses.map((biz) => (
            <Link key={biz.href} href={biz.href} className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-xl">
              <div className="relative h-48 overflow-hidden">
                <img src={biz.image} alt={biz.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className={`absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-lg ${biz.color}`}><biz.icon className="h-5 w-5 text-white" /></div>
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-xl font-bold text-ksk-dark transition-colors group-hover:text-ksk-gold">{biz.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600">{biz.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-ksk-gold transition-all group-hover:gap-2">Explore <ArrowRight className="h-4 w-4" /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
