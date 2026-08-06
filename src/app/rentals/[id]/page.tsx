"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Users, Shield, Phone, MapPin, Check, Loader2 } from "lucide-react"

export default function VehicleDetailPage() {
  const params = useParams()
  const vehicleId = params.id as string

  const vehicle = {
    id: vehicleId,
    name: "Toyota Camry",
    model: "2020",
    brand: "Toyota",
    seats: 5,
    price_per_day: 450,
    deposit: 500,
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
    ],
    description: "Reliable and comfortable sedan perfect for personal use and small family trips. Well-maintained with AC and modern features. Ideal for weddings, airport pickups, and daily commuting around Wa and the Upper West Region.",
    is_available: true,
  }

  const [mainImage, setMainImage] = useState(vehicle.images[0])
  const [formData, setFormData] = useState({ customerName: "", phone: "", rentalDate: "", days: 1, purpose: "" })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const totalCost = vehicle.price_per_day * formData.days
  const totalWithDeposit = totalCost + vehicle.deposit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: vehicleId,
          customer_name: formData.customerName,
          phone: formData.phone,
          rental_date: formData.rentalDate,
          days: formData.days,
          purpose: formData.purpose,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
        setFormData({ customerName: "", phone: "", rentalDate: "", days: 1, purpose: "" })
        setTimeout(() => setSubmitted(false), 8000)
      } else {
        alert("Failed to submit booking. Please try again.")
      }
    } catch {
      alert("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-ksk-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/rentals" className="inline-flex items-center gap-1 text-gray-600 hover:text-ksk-gold transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />Back to Rentals
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-4">
              <img src={mainImage} alt={vehicle.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3">
              {vehicle.images.map((img, idx) => (
                <button key={idx} onClick={() => setMainImage(img)} className={`w-24 h-16 rounded-lg overflow-hidden border-2 transition-colors ${mainImage === img ? "border-ksk-gold" : "border-gray-200 hover:border-gray-400"}`}>
                  <img src={img} alt={`${vehicle.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-ksk-gold uppercase tracking-wide">{vehicle.brand}</span>
            <h1 className="text-3xl font-bold text-ksk-dark mt-1 mb-2">{vehicle.name}</h1>
            <p className="text-gray-500 mb-4">{vehicle.model} Model</p>

            <div className="flex items-center gap-6 mb-6 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Users className="w-4 h-4 text-ksk-gold" />{vehicle.seats} Seats</span>
              <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-ksk-gold" />Full Insurance</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-ksk-gold" />AC Included</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{vehicle.description}</p>

            <div className="bg-white rounded-xl p-5 border border-gray-100 mb-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-ksk-brown">GH₵ {vehicle.price_per_day.toFixed(2)}</span>
                <span className="text-gray-500">/ day</span>
              </div>
              <p className="text-sm text-gray-500">Refundable deposit: GH₵ {vehicle.deposit.toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-ksk-dark mb-4">Book This Vehicle</h3>
              {submitted ? (
                <div className="flex items-center gap-2 text-ksk-green bg-ksk-green/10 p-4 rounded-lg">
                  <Check className="w-5 h-5" /><span>Booking request submitted! We will call you shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ksk-dark mb-1">Full Name</label>
                    <input type="text" required value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ksk-dark mb-1">Phone Number</label>
                    <input type="tel" required pattern="0[0-9]{9}" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold" placeholder="024XXXXXXX" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-ksk-dark mb-1">Rental Date</label><input type="date" required value={formData.rentalDate} onChange={(e) => setFormData({ ...formData, rentalDate: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold" /></div>
                    <div><label className="block text-sm font-medium text-ksk-dark mb-1">Days</label><input type="number" min={1} required value={formData.days} onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) || 1 })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold" /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ksk-dark mb-1">Purpose</label>
                    <select required value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold">
                      <option value="">Select purpose</option><option value="wedding">Wedding</option><option value="personal">Personal Use</option><option value="corporate">Corporate Event</option><option value="airport">Airport Pickup</option><option value="other">Other</option>
                    </select>
                  </div>

                  <div className="bg-ksk-cream/50 rounded-lg p-4 text-sm">
                    <div className="flex justify-between mb-1"><span>Rental ({formData.days} days)</span><span>GH₵ {totalCost.toFixed(2)}</span></div>
                    <div className="flex justify-between mb-1"><span>Deposit</span><span>GH₵ {vehicle.deposit.toFixed(2)}</span></div>
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-ksk-dark"><span>Total</span><span>GH₵ {totalWithDeposit.toFixed(2)}</span></div>
                  </div>

                  <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-ksk-gold text-ksk-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50">
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Submitting...</> : <><Calendar className="w-5 h-5" />Submit Booking Request</>}
                  </button>
                  <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1"><Phone className="w-3 h-3" />We will call you to confirm.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
