"use client"

import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { Search, Filter, ShoppingCart, HardHat, Phone, Check } from "lucide-react"

export default function ConstructionPage() {
  const { addItem } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [addedId, setAddedId] = useState<string | null>(null)

  const materials = [
    { id: "1", name: "Portland Cement (Dangote)", price: 85, unit: "bag", stock: 500, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400", category: "Cement" },
    { id: "2", name: "Portland Cement (GHACEM)", price: 88, unit: "bag", stock: 450, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400", category: "Cement" },
    { id: "3", name: "Concrete Blocks (6-inch)", price: 6.50, unit: "block", stock: 2000, image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400", category: "Blocks" },
    { id: "4", name: "Concrete Blocks (9-inch)", price: 9.00, unit: "block", stock: 1500, image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400", category: "Blocks" },
    { id: "5", name: "Iron Rods (12mm)", price: 85, unit: "rod", stock: 300, image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400", category: "Steel" },
    { id: "6", name: "Iron Rods (16mm)", price: 140, unit: "rod", stock: 250, image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400", category: "Steel" },
    { id: "7", name: "Roofing Sheets (Aluzinc)", price: 45, unit: "meter", stock: 1000, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400", category: "Roofing" },
    { id: "8", name: "Sand (Tipper Load)", price: 1200, unit: "tipper", stock: 50, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400", category: "Aggregate" },
    { id: "9", name: "Paint (Emulsion - 20L)", price: 280, unit: "bucket", stock: 60, image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400", category: "Paint" },
    { id: "10", name: "Tiles (Floor - 40x40cm)", price: 95, unit: "box", stock: 200, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400", category: "Tiles" },
  ]

  const categories = ["all", "Cement", "Blocks", "Steel", "Roofing", "Aggregate", "Paint", "Tiles", "Hardware", "Timber", "Plumbing"]

  const handleAddToCart = (material: typeof materials[0]) => {
    addItem({
      id: material.id,
      name: material.name,
      price: material.price,
      image: material.image,
      unit: material.unit,
      type: "material",
    })
    setAddedId(material.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <div className="min-h-screen bg-ksk-cream">
      <div className="bg-ksk-dark py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Construction Materials</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Quality building materials delivered to your site in Wa and surrounding areas.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-ksk-green/10 border border-ksk-green/20 rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-ksk-green rounded-full flex items-center justify-center shrink-0">
              <HardHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-ksk-dark">Need Construction Services?</h3>
              <p className="text-sm text-gray-600">We provide skilled labour and full contracting services.</p>
            </div>
          </div>
          <Link href="/contact" className="flex items-center gap-2 px-5 py-2.5 bg-ksk-green text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shrink-0">
            <Phone className="w-4 h-4" />Get a Quote
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search materials..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold bg-white text-sm">
              {categories.map((c) => (<option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {materials.map((material) => (
            <div key={material.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
              <Link href={`/construction/${material.id}`}>
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img src={material.image} alt={material.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              </Link>
              <div className="p-4">
                <span className="text-xs font-medium text-ksk-gold uppercase tracking-wide">{material.category}</span>
                <Link href={`/construction/${material.id}`}>
                  <h3 className="font-semibold text-ksk-dark mt-1 mb-1 group-hover:text-ksk-gold transition-colors text-sm">{material.name}</h3>
                </Link>
                <p className="text-xs text-gray-500 mb-3">{material.stock} in stock</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-ksk-brown">GH₵ {material.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">per {material.unit}</p>
                  </div>
                  <button onClick={() => handleAddToCart(material)} className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${addedId === material.id ? "bg-ksk-green text-white" : "bg-ksk-gold text-ksk-dark hover:bg-amber-400"}`}>
                    {addedId === material.id ? <><Check className="w-4 h-4" />Added</> : <><ShoppingCart className="w-4 h-4" />Add</>}
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
