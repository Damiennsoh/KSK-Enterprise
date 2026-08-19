"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { ShoppingCart, Filter, Search, Check, Loader2, AlertTriangle } from "lucide-react"
import { getProducts } from "@/lib/actions/products"
import type { Product } from "@/types"

export default function FashionPage() {
  const { addItem } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [addedId, setAddedId] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      console.error("Failed to load products:", err)
      setError("Failed to load products. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  const allCategories = ["all", "Male Smocks", "Female Smocks", "Children Smocks", "Accessories", "Hats", "Sandals"]
  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-200", label: "Under GH₵200" },
    { value: "200-400", label: "GH₵200 - GH₵400" },
    { value: "400+", label: "Above GH₵400" },
  ]

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !(p.description || "").toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (priceRange === "0-200" && p.price >= 200) return false
    if (priceRange === "200-400" && (p.price < 200 || p.price >= 400)) return false
    if (priceRange === "400+" && p.price < 400) return false
    return true
  })

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.png",
      type: "product",
      category: "fashion",
    })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <div className="min-h-screen bg-ksk-cream">
      <div className="bg-ksk-dark py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Fashion & Smocks</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Hand-woven traditional smocks and fugus made by skilled artisans in the Upper West Region. Authentic Ghanaian craftsmanship.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search smocks, hats, sandals..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold bg-white text-sm">
              {allCategories.map((cat) => (<option key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</option>))}
            </select>
          </div>
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold bg-white text-sm">
            {priceRanges.map((range) => (<option key={range.value} value={range.value}>{range.label}</option>))}
          </select>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div className="flex-1">{error}</div>
            <button onClick={loadProducts} className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-ksk-gold animate-spin mb-4" />
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-ksk-dark mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter options.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
                <Link href={`/fashion/${product.id}`}>
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img src={product.images[0] || "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.stock < 10 && <span className="absolute top-3 left-3 px-2 py-1 bg-ksk-red text-white text-xs font-semibold rounded flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Low Stock</span>}
                    {product.stock >= 10 && product.stock < 20 && <span className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded">Limited Stock</span>}
                  </div>
                </Link>
                <div className="p-5">
                  <span className="text-xs font-medium text-ksk-gold uppercase tracking-wide">{product.category}</span>
                  <Link href={`/fashion/${product.id}`}>
                    <h3 className="font-semibold text-ksk-dark mt-1 mb-2 group-hover:text-ksk-gold transition-colors line-clamp-1">{product.name}</h3>
                  </Link>
                  {(product.length_cm || product.width_cm) && (
                    <p className="text-xs text-gray-500 mb-2">
                      {product.length_cm && `L: ${product.length_cm}cm`}
                      {product.length_cm && product.width_cm && " | "}
                      {product.width_cm && `W: ${product.width_cm}cm`}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-ksk-brown">GH₵ {product.price.toFixed(2)}</p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        addedId === product.id ? "bg-ksk-green text-white" : product.stock === 0 ? "bg-gray-200 text-gray-500" : "bg-ksk-gold text-ksk-dark hover:bg-amber-400"
                      }`}
                    >
                      {addedId === product.id ? <><Check className="w-4 h-4" />Added</> : product.stock === 0 ? "Sold Out" : <><ShoppingCart className="w-4 h-4" />Add</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
