"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { ArrowLeft, CreditCard, Smartphone, Banknote, Check, Loader2, ShoppingCart, MapPin } from "lucide-react"
import { getDeliveryZones } from "@/lib/actions/settings"

const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ""

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<"momo" | "bank_card" | "cash">("momo")
  const [formData, setFormData] = useState({ customerName: "", phone: "", email: "", address: "" })
  const [loading, setLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [selectedZone, setSelectedZone] = useState<number | null>(null)
  const [deliveryZones, setDeliveryZones] = useState<any[]>([])
  const [loadingZones, setLoadingZones] = useState(true)

  useEffect(() => {
    loadDeliveryZones()
  }, [])

  const loadDeliveryZones = async () => {
    try {
      const zones = await getDeliveryZones()
      setDeliveryZones(zones)
      if (zones.length > 0) {
        setSelectedZone(zones[0].id)
      }
    } catch (error) {
      console.error("Failed to load delivery zones:", error)
    } finally {
      setLoadingZones(false)
    }
  }

  const calculateDeliveryCost = () => {
    if (!selectedZone) return 0
    const zone = deliveryZones.find(z => z.id === selectedZone)
    if (!zone) return 0

    let totalDeliveryCost = 0
    items.forEach(item => {
      if (item.includeDeliveryInSummary !== false) {
        const cost = item.deliveryCostOverride || zone.base_delivery_cost
        totalDeliveryCost += cost * item.quantity
      }
    })
    return totalDeliveryCost
  }

  const deliveryFee = calculateDeliveryCost()
  const total = totalPrice + deliveryFee

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-ksk-cream flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-ksk-dark mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add items before checking out.</p>
          <Link href="/fashion" className="inline-flex items-center gap-2 px-6 py-3 bg-ksk-gold text-ksk-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (paymentMethod === "cash") {
      try {
        const orderData = {
          items: items.map((i) => ({ product_id: i.id, name: i.name, price: i.price, quantity: i.quantity, size: i.size, color: i.color })),
          total, customer_name: formData.customerName, phone: formData.phone, email: formData.email, address: formData.address, payment_method: paymentMethod,
        }
        const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderData) })
        if (res.ok) { clearCart(); setOrderComplete(true) }
      } catch (err) { console.error(err); alert("Something went wrong.") }
      setLoading(false)
      return
    }

    if (typeof window !== "undefined" && (window as any).PaystackPop) {
      const handler = (window as any).PaystackPop.setup({
        key: PAYSTACK_KEY, email: formData.email || `${formData.phone}@kskenterprise.com`, amount: total * 100, currency: "GHS", ref: "KSK-" + Date.now(),
        metadata: { custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: formData.customerName },
          { display_name: "Phone", variable_name: "phone", value: formData.phone },
          { display_name: "Address", variable_name: "address", value: formData.address },
        ]},
        callback: function (response: any) {
          (async () => {
            try {
              const orderData = {
                items: items.map((i) => ({ product_id: i.id, name: i.name, price: i.price, quantity: i.quantity, size: i.size, color: i.color })),
                total, customer_name: formData.customerName, phone: formData.phone, email: formData.email, address: formData.address, payment_method: paymentMethod, paystack_reference: response.reference,
              }
              const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderData) })
              if (res.ok) { clearCart(); setOrderComplete(true) }
            } catch (err) { console.error(err) }
            setLoading(false)
          })()
        },
        onClose: function () { setLoading(false) },
      })
      handler.openIframe()
    } else { alert("Paystack is loading. Please try again."); setLoading(false) }
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-ksk-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-xl p-8 border border-gray-100 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-ksk-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-ksk-green" />
          </div>
          <h2 className="text-2xl font-bold text-ksk-dark mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">Thank you {formData.customerName}. We will contact you at {formData.phone} to confirm your order.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-ksk-gold text-ksk-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors">Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ksk-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/cart" className="inline-flex items-center gap-1 text-gray-600 hover:text-ksk-gold transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-ksk-dark mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-ksk-dark mb-4">Delivery Information</h3>
                
                {/* Delivery Zone Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-ksk-dark mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Select Delivery Location
                  </label>
                  {loadingZones ? (
                    <div className="text-sm text-gray-500">Loading delivery zones...</div>
                  ) : (
                    <select 
                      value={selectedZone || ""} 
                      onChange={(e) => setSelectedZone(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold"
                      required
                    >
                      {deliveryZones.map(zone => (
                        <option key={zone.id} value={zone.id}>
                          {zone.zone_name} - GH₵{zone.base_delivery_cost.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-ksk-dark mb-1">Full Name *</label>
                    <input type="text" required value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ksk-dark mb-1">Phone Number *</label>
                    <input type="tel" required pattern="0[0-9]{9}" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold" placeholder="024XXXXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ksk-dark mb-1">Email (Optional)</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold" placeholder="your@email.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-ksk-dark mb-1">Delivery Address *</label>
                    <textarea required rows={3} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ksk-gold resize-none" placeholder="Your delivery address" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-ksk-dark mb-4">Payment Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button type="button" onClick={() => setPaymentMethod("momo")} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${paymentMethod === "momo" ? "border-ksk-gold bg-ksk-gold/5" : "border-gray-200 hover:border-gray-300"}`}>
                    <Smartphone className="w-6 h-6 text-ksk-gold" /><span className="text-sm font-medium">Mobile Money</span><span className="text-xs text-gray-500">MTN MoMo / Telecel</span>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod("bank_card")} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${paymentMethod === "bank_card" ? "border-ksk-gold bg-ksk-gold/5" : "border-gray-200 hover:border-gray-300"}`}>
                    <CreditCard className="w-6 h-6 text-ksk-gold" /><span className="text-sm font-medium">Bank Card</span><span className="text-xs text-gray-500">Visa / Mastercard</span>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod("cash")} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${paymentMethod === "cash" ? "border-ksk-gold bg-ksk-gold/5" : "border-gray-200 hover:border-gray-300"}`}>
                    <Banknote className="w-6 h-6 text-ksk-gold" /><span className="text-sm font-medium">Cash</span><span className="text-xs text-gray-500">Pay at our office</span>
                  </button>
                </div>
              </div>

              {(paymentMethod === "momo" || paymentMethod === "bank_card") && (<script src="https://js.paystack.co/v1/inline.js" async />)}

              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-ksk-gold text-ksk-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Processing...</> : <>Complete Order</>}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-ksk-dark mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ksk-dark truncate">{item.name}</p>
                      <div className="text-xs text-gray-500">
                        <p>Qty: {item.quantity}</p>
                        {item.showDimensions && item.lengthCm && item.widthCm && (
                          <p>{item.lengthCm}cm × {item.widthCm}cm</p>
                        )}
                        {item.showSizes && item.size && <p>Size: {item.size}</p>}
                        {item.showColors && item.color && <p>Color: {item.color}</p>}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-ksk-brown">GH₵ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">GH₵ {totalPrice.toFixed(2)}</span></div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">{deliveryFee === 0 ? "Free" : `GH₵ ${deliveryFee.toFixed(2)}`}</span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-gray-400">Delivery cost based on selected location</p>
                )}
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between font-bold text-lg text-ksk-dark"><span>Total</span><span>GH₵ {total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
