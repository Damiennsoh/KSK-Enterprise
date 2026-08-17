"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Send, Check, Loader2 } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "", type: "general" })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSubmitted(true)
        setFormData({ name: "", phone: "", email: "", message: "", type: "general" })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        alert("Failed to send message. Please try again.")
      }
    } catch {
      alert("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-ksk-cream">
      <div className="bg-ksk-dark py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-gray-400 max-w-xl mx-auto">We would love to hear from you. Reach out for orders, bookings, or inquiries.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-bold text-ksk-dark mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-ksk-gold shrink-0 mt-0.5" /><div><p className="font-medium text-ksk-dark">Address</p><p className="text-sm text-gray-600">Wa, Upper West Region, Ghana</p></div></div>
                <div className="flex items-start gap-3"><Phone className="w-5 h-5 text-ksk-gold shrink-0 mt-0.5" /><div><p className="font-medium text-ksk-dark">Phone</p><p className="text-sm text-gray-600">0242 070 938</p><p className="text-sm text-gray-600">0202 348 762</p></div></div>
                <div className="flex items-start gap-3"><Mail className="w-5 h-5 text-ksk-gold shrink-0 mt-0.5" /><div><p className="font-medium text-ksk-dark">Email</p><p className="text-sm text-gray-600">info@kskenterprise.com</p></div></div>
                <div className="flex items-start gap-3"><Clock className="w-5 h-5 text-ksk-gold shrink-0 mt-0.5" /><div><p className="font-medium text-ksk-dark">Business Hours</p><p className="text-sm text-gray-600">Mon - Sat: 8:00 AM - 6:00 PM</p><p className="text-sm text-gray-600">Sunday: Closed</p></div></div>
              </div>
            </div>
            <div className="bg-ksk-gold/10 rounded-xl p-6 border border-ksk-gold/20">
              <h3 className="font-bold text-ksk-dark mb-2">Quick Call</h3>
              <p className="text-sm text-gray-600 mb-4">Need immediate assistance? Call us now.</p>
              <a href="tel:0242070938" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-ksk-gold text-ksk-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors">
                <Phone className="w-4 h-4" />Call 0242 070 938
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-ksk-dark mb-6">Send Us a Message</h3>
              {submitted ? (
                <div className="flex items-center gap-2 text-ksk-green bg-ksk-green/10 p-4 rounded-lg">
                  <Check className="w-5 h-5" /><span>Thank you! We will get back to you shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-medium text-ksk-dark mb-1">Full Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold" placeholder="Your name" /></div>
                    <div><label className="block text-sm font-medium text-ksk-dark mb-1">Phone Number *</label><input type="tel" required pattern="0[0-9]{9}" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold" placeholder="024XXXXXXX" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-ksk-dark mb-1">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold" placeholder="your@email.com" /></div>
                  <div><label className="block text-sm font-medium text-ksk-dark mb-1">Inquiry Type</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold"><option value="general">General Inquiry</option><option value="order">Order/Purchase</option><option value="rental">Car Rental</option><option value="construction">Construction Services</option><option value="labour">Labour Services</option></select></div>
                  <div><label className="block text-sm font-medium text-ksk-dark mb-1">Message *</label><textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold resize-none" placeholder="How can we help you?" /></div>
                  <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-ksk-gold text-ksk-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending...</> : <><Send className="w-4 h-4" />Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
