import Link from "next/link"
import { ShoppingBag, Car, HardHat, ArrowRight } from "lucide-react"

/**
 * Fashion leads the homepage, with KSK's other services kept easy to find.
 */
export function BusinessCards() {
  const businesses = [
    {
      title: "Fashion & Smocks",
      description:
        "Hand-woven traditional smocks/fugu made by skilled artisans in the Upper West Region. Perfect for weddings, ceremonies, and everyday wear.",
      icon: ShoppingBag,
      href: "/fashion",
      image: "/smock.jpeg",
      color: "bg-amber-600",
    },
    {
      title: "Car Rentals",
      description:
        "Reliable vehicles for weddings, personal trips, and corporate events. From sedans to SUVs and buses, we have the right car for your needs.",
      icon: Car,
      href: "/rentals",
      image: "/car.jpg",
      color: "bg-ksk-brown",
    },
    {
      title: "Construction",
      description:
        "Quality building materials including cement, blocks, iron rods, and roofing sheets. Plus professional labour and contracting services.",
      icon: HardHat,
      href: "/construction",
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600",
      color: "bg-ksk-green",
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-ksk-dark mb-4">
            More from KSK Enterprise
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fashion is our featured craft. Construction and car rentals remain available whenever you need them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {businesses.map((biz) => (
            <Link
              key={biz.href}
              href={biz.href}
              className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={biz.image}
                  alt={biz.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div
                  className={`absolute bottom-4 left-4 w-10 h-10 ${biz.color} rounded-lg flex items-center justify-center`}
                >
                  <biz.icon className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-ksk-dark mb-2 group-hover:text-ksk-gold transition-colors">
                  {biz.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {biz.description}
                </p>
                <span className="inline-flex items-center gap-1 text-ksk-gold font-semibold text-sm group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
