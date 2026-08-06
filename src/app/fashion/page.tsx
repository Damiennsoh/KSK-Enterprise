"use client"

import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { ShoppingCart, Filter, Search, Check } from "lucide-react"

export default function FashionPage() {
  const { addItem } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [addedId, setAddedId] = useState<string | null>(null)

  const products = [
    { id: "1", name: "Traditional Fugu Smock", price: 350, category: "Smocks", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400", stock: 25 },
    { id: "2", name: "Premium Wedding Fugu", price: 550, category: "Smocks", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400", stock: 15 },
    { id: "3", name: "Casual Everyday Smock", price: 180, category: "Smocks", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400", stock: 40 },
    { id: "4", name: "Children Traditional Smock", price: 120, category: "Smocks", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400", stock: 20 },
    { id: "5", name: "Executive Corporate Smock", price: 420, category: "Smocks", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400", stock: 12 },
    { id: "6", name: "Hand-Woven Kente Scarf", price: 85, category: "Accessories", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400", stock: 30 },
  ]

  const categories = ["all", "Smocks", "Accessories"]
  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-200", label: "Under GH₵200" },
    { value: "200-400", label: "GH₵200 - GH₵400" },
    { value: "400+", label: "Above GH₵400" },
  ]

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: "product",
    })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <div className="min-h-screen bg-ksk-cream">
      <div className="bg-ksk-dark py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Fashion & Smocks</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Hand-woven traditional smocks and fugus made by skilled artisans in the Upper West Region.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search smocks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold bg-white text-sm">
              {categories.map((cat) => (<option key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</option>))}
            </select>
          </div>
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold bg-white text-sm">
            {priceRanges.map((range) => (<option key={range.value} value={range.value}>{range.label}</option>))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
              <Link href={`/fashion/${product.id}`}>
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {product.stock < 20 && <span className="absolute top-3 left-3 px-2 py-1 bg-ksk-red text-white text-xs font-semibold rounded">Low Stock</span>}
                </div>
              </Link>
              <div className="p-5">
                <span className="text-xs font-medium text-ksk-gold uppercase tracking-wide">{product.category}</span>
                <Link href={`/fashion/${product.id}`}>
                  <h3 className="font-semibold text-ksk-dark mt-1 mb-2 group-hover:text-ksk-gold transition-colors">{product.name}</h3>
                </Link>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-ksk-brown">GH₵ {product.price.toFixed(2)}</p>
                  <button onClick={() => handleAddToCart(product)} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${addedId === product.id ? "bg-ksk-green text-white" : "bg-ksk-gold text-ksk-dark hover:bg-amber-400"}`}>
                    {addedId === product.id ? <><Check className="w-4 h-4" />Added</> : <><ShoppingCart className="w-4 h-4" />Add</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
