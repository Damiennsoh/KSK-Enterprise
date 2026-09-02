import Link from "next/link"
import { ArrowRight } from "lucide-react"

/**
 * Featured products section on homepage.
 * Displays a focused selection of KSK fashion products.
 */
export function FeaturedProducts() {
  const featured = [
    {
      name: "Traditional Fugu Smock",
      price: 350,
      image:
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400",
      category: "Fashion",
      href: "/fashion",
    },
    {
      name: "Premium Wedding Fugu",
      price: 550,
      image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
      category: "Wedding Collection",
      href: "/fashion",
    },
    {
      name: "Handwoven Festival Smock",
      price: 420,
      image:
        "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400",
      category: "Festival Collection",
      href: "/fashion",
    },
    {
      name: "Classic White Fugu",
      price: 380,
      image:
        "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=400",
      category: "Everyday Heritage",
      href: "/fashion",
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ksk-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ksk-gold mb-2">KSK Fashion</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ksk-dark mb-2">
              Wear your story.
            </h2>
            <p className="text-gray-600">Hand-finished smocks and fugu for every meaningful occasion.</p>
          </div>
          <Link
            href="/fashion"
            className="hidden sm:inline-flex items-center gap-1 text-ksk-gold font-semibold hover:gap-2 transition-all"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-medium text-ksk-gold uppercase tracking-wide">
                  {item.category}
                </span>
                <h3 className="font-semibold text-ksk-dark mt-1 group-hover:text-ksk-gold transition-colors">
                  {item.name}
                </h3>
                <p className="text-lg font-bold text-ksk-brown mt-2">
                  GH₵ {item.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/fashion"
            className="inline-flex items-center gap-1 text-ksk-gold font-semibold"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
