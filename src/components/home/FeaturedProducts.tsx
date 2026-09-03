import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getProducts } from "@/lib/actions/products"
import type { Product } from "@/types"

const featuredCategories = [
  "Male Smocks",
  "Female Smocks",
  "Children Smocks",
  "Accessories",
  "Hats",
  "Sandals",
]

/** Displays four catalog products from each fashion category on the homepage. */
export async function FeaturedProducts() {
  const products = await getProducts()
  const featured = featuredCategories.flatMap((category) =>
    products.filter((product) => product.category === category).slice(0, 4),
  )
  const fallback = products.filter((product) => !featured.includes(product)).slice(0, 24 - featured.length)
  const showcase: Product[] = [...featured, ...fallback].slice(0, 24)

  return (
    <section className="bg-ksk-cream px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-ksk-gold">KSK Fashion</p>
            <h2 className="mb-2 text-3xl font-bold text-ksk-dark sm:text-4xl">Wear your story.</h2>
            <p className="text-gray-600">A curated look at our smocks, accessories, hats, and sandals.</p>
          </div>
          <Link href="/fashion" className="hidden items-center gap-1 font-semibold text-ksk-gold transition-all hover:gap-2 sm:inline-flex">
            View All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {showcase.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {showcase.map((item) => (
              <Link key={item.id} href={`/fashion/${item.id}`} className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img src={item.images[0] || "/placeholder.png"} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium uppercase tracking-wide text-ksk-gold">{item.category}</span>
                  <h3 className="mt-1 line-clamp-1 font-semibold text-ksk-dark transition-colors group-hover:text-ksk-gold">{item.name}</h3>
                  <p className="mt-2 text-lg font-bold text-ksk-brown">GH₵ {item.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-white p-8 text-center text-gray-600">Our latest fashion collection is being prepared.</p>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/fashion" className="inline-flex items-center gap-1 font-semibold text-ksk-gold">
            View All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
