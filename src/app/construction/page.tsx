"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { Search, Filter, ShoppingCart, HardHat, Phone, Check, Home, Hammer, Wrench, Paintbrush, Droplets, Zap, Layers, DoorOpen, Shovel, RefreshCw, Truck, Loader2, AlertTriangle } from "lucide-react"
import { getMaterials } from "@/lib/actions/products"
import type { Material } from "@/types"

const services = [
  { name: "Building Construction", icon: Home, description: "Complete building construction from foundation to finishing" },
  { name: "Roofing & Plastering", icon: Layers, description: "Professional roofing and plastering services" },
  { name: "Painting & Decoration", icon: Paintbrush, description: "Interior and exterior painting with quality finishes" },
  { name: "Plumbing & Electrical Works", icon: Wrench, description: "Complete plumbing and electrical installations" },
  { name: "POP & Ceiling Works", icon: Droplets, description: "POP designs and ceiling installations" },
  { name: "Tiling & Flooring", icon: Layers, description: "Professional tiling and flooring solutions" },
  { name: "China Door Installation", icon: DoorOpen, description: "Quality China door installation services" },
  { name: "Manhole Construction", icon: Shovel, description: "Manhole construction and maintenance" },
  { name: "Renovation & Remodeling", icon: RefreshCw, description: "Building renovation and remodeling services" },
  { name: "Excavation & Site Preparation", icon: Shovel, description: "Site excavation and preparation work" },
  { name: "Supply of Building Materials", icon: Truck, description: "Quality building materials supply" },
  { name: "General Construction & Maintenance", icon: Hammer, description: "General construction and maintenance services" },
]

export default function ConstructionPage() {
  const { addItem } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [addedId, setAddedId] = useState<string | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMaterials()
  }, [])

  const loadMaterials = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMaterials()
      setMaterials(data)
    } catch (err) {
      console.error("Failed to load materials:", err)
      setError("Failed to load materials. Please refresh.")
    } finally {
      setLoading(false)
    }
  }

  const allCategories = ["all", "Cement", "Blocks", "Steel", "Roofing", "Aggregate", "Paint", "Tiles", "Hardware", "Timber", "Plumbing", "Doors"]
  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-50", label: "Under GH₵50" },
    { value: "50-200", label: "GH₵50 - GH₵200" },
    { value: "200+", label: "Above GH₵200" },
  ]

  const filteredMaterials = materials.filter((m) => {
    if (selectedCategory !== "all" && m.category !== selectedCategory) return false
    if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase()) && !(m.description || "").toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (priceRange === "0-50" && m.price >= 50) return false
    if (priceRange === "50-200" && (m.price < 50 || m.price >= 200)) return false
    if (priceRange === "200+" && m.price < 200) return false
    return true
  })

  const handleAddToCart = (material: Material) => {
    addItem({
      id: material.id,
      name: material.name,
      price: material.price,
      image: material.images[0] || "/placeholder.png",
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
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">KSK Building & Construction</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Quality construction services and building materials in Wa, Upper West Region, Ghana.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-ksk-dark mb-6">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((service) => (
              <div key={service.name} className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-ksk-gold/10 rounded-lg flex items-center justify-center mb-3">
                  <service.icon className="w-6 h-6 text-ksk-gold" />
                </div>
                <h3 className="font-semibold text-ksk-dark mb-1">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ksk-green/10 border border-ksk-green/20 rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-ksk-green rounded-full flex items-center justify-center shrink-0">
              <HardHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-ksk-dark">Need a Quote?</h3>
              <p className="text-sm text-gray-600">Contact us for construction services or material supply.</p>
            </div>
          </div>
          <Link href="/contact" className="flex items-center gap-2 px-5 py-2.5 bg-ksk-green text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shrink-0">
            <Phone className="w-4 h-4" />Contact Us
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-ksk-dark mb-6">Building Materials</h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search materials (cement, rods, tiles, etc.)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold bg-white text-sm">
              {allCategories.map((c) => (<option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>))}
            </select>
          </div>
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold bg-white text-sm">
            {priceRanges.map((r) => (<option key={r.value} value={r.value}>{r.label}</option>))}
          </select>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div className="flex-1">{error}</div>
            <button onClick={loadMaterials} className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-ksk-gold animate-spin mb-4" />
            <p className="text-gray-500">Loading materials...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HardHat className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-ksk-dark mb-2">No materials found</h3>
            <p className="text-gray-500">Try adjusting your search or filter options.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
                <Link href={`/construction/${material.id}`}>
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img src={material.images[0] || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400"} alt={material.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {material.stock < 20 && <span className="absolute top-3 left-3 px-2 py-1 bg-ksk-red text-white text-xs font-semibold rounded flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Low Stock</span>}
                    {material.stock >= 20 && material.stock < 100 && <span className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded">Limited</span>}
                  </div>
                </Link>
                <div className="p-4">
                  <span className="text-xs font-medium text-ksk-gold uppercase tracking-wide">{material.category}</span>
                  <Link href={`/construction/${material.id}`}>
                    <h3 className="font-semibold text-ksk-dark mt-1 mb-1 group-hover:text-ksk-gold transition-colors text-sm line-clamp-2 min-h-[2.5rem]">{material.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-500 mb-3">
                    <span className={material.stock < 20 ? "text-ksk-red font-semibold" : material.stock < 100 ? "text-amber-600 font-semibold" : ""}>{material.stock}</span> {material.unit}s in stock
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-ksk-brown">GH₵ {material.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">per {material.unit}</p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(material)}
                      disabled={material.stock === 0}
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        addedId === material.id ? "bg-ksk-green text-white" : material.stock === 0 ? "bg-gray-200 text-gray-500" : "bg-ksk-gold text-ksk-dark hover:bg-amber-400"
                      }`}
                    >
                      {addedId === material.id ? <><Check className="w-4 h-4" />Added</> : material.stock === 0 ? "Sold" : <><ShoppingCart className="w-4 h-4" />Add</>}
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
