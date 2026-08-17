"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Package, MapPin } from "lucide-react"
import { getDeliveryZones } from "@/lib/actions/settings"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()
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
        // Use product override if set, otherwise use zone default
        const cost = item.deliveryCostOverride || zone.base_delivery_cost
        totalDeliveryCost += cost * item.quantity
      }
    })
    return totalDeliveryCost
  }

  const deliveryFee = calculateDeliveryCost()
  const total = totalPrice + deliveryFee

  return (
    <div className="min-h-screen bg-ksk-cream">
      <div className="bg-ksk-dark py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-ksk-dark mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Browse our products and add items to your cart.</p>
            <Link href="/fashion" className="inline-flex items-center gap-2 px-6 py-3 bg-ksk-gold text-ksk-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors">
              <Package className="w-4 h-4" />Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Link href="/fashion" className="inline-flex items-center gap-1 text-gray-600 hover:text-ksk-gold transition-colors text-sm mb-2">
                <ArrowLeft className="w-4 h-4" />Continue Shopping
              </Link>

              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-100 flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-ksk-dark">{item.name}</h3>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.showDimensions && item.lengthCm && item.widthCm && (
                            <p>Dimensions: {item.lengthCm}cm × {item.widthCm}cm</p>
                          )}
                          {item.showSizes && item.size && <p>Size: {item.size}</p>}
                          {item.showColors && item.color && <p>Color: {item.color}</p>}
                          {item.unit && <p>Unit: {item.unit}</p>}
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-1.5 text-gray-400 hover:text-ksk-red transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-bold text-ksk-brown">GH₵ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 border border-gray-100 sticky top-24">
                <h3 className="text-lg font-bold text-ksk-dark mb-4">Order Summary</h3>
                
                {/* Delivery Zone Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Select Delivery Location
                  </label>
                  {loadingZones ? (
                    <div className="text-sm text-gray-500">Loading delivery zones...</div>
                  ) : (
                    <select 
                      value={selectedZone || ""} 
                      onChange={(e) => setSelectedZone(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent"
                    >
                      {deliveryZones.map(zone => (
                        <option key={zone.id} value={zone.id}>
                          {zone.zone_name} - GH₵{zone.base_delivery_cost.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-3 text-sm mb-4">
                  <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">GH₵ {totalPrice.toFixed(2)}</span></div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium">{deliveryFee === 0 ? "Free" : `GH₵ ${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-gray-400">Delivery cost based on selected location</p>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between font-bold text-lg text-ksk-dark"><span>Total</span><span>GH₵ {total.toFixed(2)}</span></div>
                </div>
                <Link href="/checkout" className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-ksk-gold text-ksk-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors">
                  Proceed to Checkout
                </Link>
                <p className="text-xs text-gray-400 text-center mt-3">Prices in Ghana Cedis (GHS)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
