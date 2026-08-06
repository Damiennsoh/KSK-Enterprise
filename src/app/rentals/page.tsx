"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, Calendar, Users } from "lucide-react"

export default function RentalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [priceRange, setPriceRange] = useState("all")

  const vehicles = [
    { id: "1", name: "Toyota Camry", model: "2020", brand: "Toyota", seats: 5, price_per_day: 450, deposit: 500, image: "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=600", is_available: true },
    { id: "2", name: "Hyundai Elantra", model: "2019", brand: "Hyundai", seats: 5, price_per_day: 380, deposit: 400, image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600", is_available: true },
    { id: "3", name: "Toyota Land Cruiser Prado", model: "2018", brand: "Toyota", seats: 7, price_per_day: 800, deposit: 1000, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600", is_available: true },
    { id: "4", name: "Mercedes-Benz C-Class", model: "2021", brand: "Mercedes-Benz", seats: 5, price_per_day: 700, deposit: 800, image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600", is_available: true },
    { id: "5", name: "Kia Sportage", model: "2020", brand: "Kia", seats: 5, price_per_day: 500, deposit: 600, image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600", is_available: true },
    { id: "6", name: "Toyota Hiace Bus", model: "2019", brand: "Toyota", seats: 15, price_per_day: 1200, deposit: 1500, image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600", is_available: true },
  ]

  const types = ["all", "Sedan", "SUV", "Bus"]
  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-500", label: "Under GH₵500/day" },
    { value: "500-1000", label: "GH₵500 - GH₵1000/day" },
    { value: "1000+", label: "Above GH₵1000/day" },
  ]

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
            <input type="text" placeholder="Search vehicles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold bg-white text-sm">
              {types.map((t) => (<option key={t} value={t}>{t === "all" ? "All Types" : t}</option>))}
            </select>
          </div>
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold bg-white text-sm">
            {priceRanges.map((r) => (<option key={r.value} value={r.value}>{r.label}</option>))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
              <Link href={`/rentals/${vehicle.id}`}>
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {!vehicle.is_available && <span className="absolute top-3 left-3 px-2 py-1 bg-ksk-red text-white text-xs font-semibold rounded">Unavailable</span>}
                </div>
              </Link>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-ksk-gold uppercase tracking-wide">{vehicle.brand}</span>
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
                  <Link href={`/rentals/${vehicle.id}`} className="flex items-center gap-1.5 px-4 py-2 bg-ksk-gold text-ksk-dark text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors">
                    <Calendar className="w-4 h-4" />Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
