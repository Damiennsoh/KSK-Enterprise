"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, Calendar, Users, Loader2, AlertTriangle } from "lucide-react"
import { getVehicles } from "@/lib/actions/products"
import type { Vehicle } from "@/types"

export default function RentalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getVehicles()
      setVehicles(data)
    } catch (err) {
      console.error("Failed to load vehicles:", err)
      setError("Failed to load vehicles. Please refresh.")
    } finally {
      setLoading(false)
    }
  }

  const allCategories = ["all", "Sedan", "SUV", "Bus", "Luxury"]
  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-500", label: "Under GH₵500/day" },
    { value: "500-1000", label: "GH₵500 - GH₵1000/day" },
    { value: "1000+", label: "Above GH₵1000/day" },
  ]

  const getVehicleCategory = (v: Vehicle): string => {
    if (v.seats >= 12) return "Bus"
    if (v.seats >= 6) return "SUV"
    if (v.price_per_day >= 700) return "Luxury"
    return "Sedan"
  }

  const filteredVehicles = vehicles.filter((v) => {
    const cat = getVehicleCategory(v)
    if (selectedCategory !== "all" && cat !== selectedCategory) return false
    const q = searchQuery.toLowerCase()
    if (searchQuery && !v.name.toLowerCase().includes(q) && !v.brand.toLowerCase().includes(q) && !v.model.toLowerCase().includes(q)) return false
    if (priceRange === "0-500" && v.price_per_day >= 500) return false
    if (priceRange === "500-1000" && (v.price_per_day < 500 || v.price_per_day >= 1000)) return false
    if (priceRange === "1000+" && v.price_per_day < 1000) return false
    return true
  })

  return (
    <div className="min-h-screen bg-ksk-cream">
      <div className="bg-ksk-dark py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Car Rentals</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Reliable vehicles for weddings, personal trips, and corporate events. Pick up at our office in Wa, Upper West Region.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search vehicles (Toyota, Mercedes, Bus...)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold bg-white text-sm">
              {allCategories.map((t) => (<option key={t} value={t}>{t === "all" ? "All Types" : t}</option>))}
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
            <button onClick={loadVehicles} className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-ksk-gold animate-spin mb-4" />
            <p className="text-gray-500">Loading vehicles...</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-ksk-dark mb-2">No vehicles found</h3>
            <p className="text-gray-500">Try adjusting your search or filter options.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
                <Link href={`/rentals/${vehicle.id}`}>
                  <div className="relative h-52 overflow-hidden bg-gray-100">
                    <img src={vehicle.images[0] || "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=600"} alt={vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {!vehicle.is_available && <span className="absolute top-3 left-3 px-2 py-1 bg-ksk-red text-white text-xs font-semibold rounded flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Unavailable</span>}
                    {vehicle.is_available && <span className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">Available</span>}
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-ksk-gold uppercase tracking-wide">{vehicle.brand} • {getVehicleCategory(vehicle)}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500"><Users className="w-3.5 h-3.5" />{vehicle.seats} seats</span>
                  </div>
                  <Link href={`/rentals/${vehicle.id}`}>
                    <h3 className="font-semibold text-ksk-dark text-lg group-hover:text-ksk-gold transition-colors mb-1">{vehicle.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-500 mb-3">{vehicle.model} Model</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-ksk-brown">GH₵ {vehicle.price_per_day.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">per day</p>
                    </div>
                    <Link
                      href={`/rentals/${vehicle.id}`}
                      className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        vehicle.is_available ? "bg-ksk-gold text-ksk-dark hover:bg-amber-400" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                      aria-disabled={!vehicle.is_available}
                      onClick={(e) => !vehicle.is_available && e.preventDefault()}
                    >
                      <Calendar className="w-4 h-4" />{vehicle.is_available ? "Book Now" : "Sold Out"}
                    </Link>
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
