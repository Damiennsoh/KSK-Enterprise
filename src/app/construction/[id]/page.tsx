"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { ArrowLeft, ShoppingCart, Package, Check } from "lucide-react"

export default function MaterialDetailPage() {
  const params = useParams()
  const materialId = params.id as string
  const { addItem } = useCart()

  const material = {
    id: materialId,
    name: "Portland Cement (Dangote)",
    description: "High-quality Dangote Portland cement for all construction needs. 50kg bag. Ideal for foundations, walls, plastering, and general building work. Meets Ghana Standards Authority requirements.",
    price: 85,
    unit: "bag",
    stock: 500,
    images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"],
    category: "Cement",
  }

  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: material.id,
      name: material.name,
      price: material.price,
      image: material.images[0],
      unit: material.unit,
      type: "material",
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-ksk-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/construction" className="inline-flex items-center gap-1 text-gray-600 hover:text-ksk-gold transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />Back to Materials
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img src={material.images[0]} alt={material.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <span className="text-sm font-medium text-ksk-gold uppercase tracking-wide">{material.category}</span>
            <h1 className="text-3xl font-bold text-ksk-dark mt-2 mb-4">{material.name}</h1>
            <p className="text-3xl font-bold text-ksk-brown mb-2">GH₵ {material.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mb-6">per {material.unit}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{material.description}</p>

            <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
              <Package className="w-4 h-4 text-ksk-gold" />
              <span>{material.stock} {material.unit}s available</span>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-ksk-dark mb-2">Quantity ({material.unit}s)</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 font-bold">-</button>
                <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 font-bold">+</button>
              </div>
            </div>

            <div className="bg-ksk-cream/50 rounded-lg p-4 mb-6">
              <div className="flex justify-between font-bold text-ksk-dark text-lg">
                <span>Total</span>
                <span>GH₵ {(material.price * quantity).toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handleAddToCart} className={`w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg transition-colors ${added ? "bg-ksk-green text-white" : "bg-ksk-gold text-ksk-dark hover:bg-amber-400"}`}>
              {added ? <><Check className="w-5 h-5" />Added to Cart</> : <><ShoppingCart className="w-5 h-5" />Add to Cart</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
