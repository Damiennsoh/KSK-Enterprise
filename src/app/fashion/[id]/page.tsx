"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { ArrowLeft, ShoppingCart, Heart, Share2, Check } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { addItem } = useCart()

  const product = {
    id: productId,
    name: "Traditional Fugu Smock",
    description: "Hand-woven traditional smock made by skilled artisans in the Upper West Region. Features intricate geometric patterns and comfortable fit. Perfect for weddings, ceremonies, and cultural events. Each smock is unique and crafted with care using locally sourced cotton threads.",
    price: 350,
    category: "Smocks",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White/Black", "Blue/White", "Red/Black", "Green/Yellow"],
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
    ],
    stock: 25,
  }

  const [selectedSize, setSelectedSize] = useState("M")
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const [mainImage, setMainImage] = useState(product.images[0])
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      type: "product",
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-ksk-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/fashion" className="inline-flex items-center gap-1 text-gray-600 hover:text-ksk-gold transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />Back to Fashion
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button key={idx} onClick={() => setMainImage(img)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${mainImage === img ? "border-ksk-gold" : "border-gray-200 hover:border-gray-400"}`}>
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-ksk-gold uppercase tracking-wide">{product.category}</span>
            <h1 className="text-3xl font-bold text-ksk-dark mt-2 mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-ksk-brown mb-6">GH₵ {product.price.toFixed(2)}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-ksk-dark mb-2">Size</label>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 rounded-lg border-2 font-semibold text-sm transition-colors ${selectedSize === size ? "border-ksk-gold bg-ksk-gold/10 text-ksk-gold" : "border-gray-200 hover:border-gray-400 text-gray-700"}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-ksk-dark mb-2">Color</label>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${selectedColor === color ? "border-ksk-gold bg-ksk-gold/10 text-ksk-gold" : "border-gray-200 hover:border-gray-400 text-gray-700"}`}>
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-ksk-dark mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100">-</button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100">+</button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg transition-colors ${added ? "bg-ksk-green text-white" : "bg-ksk-gold text-ksk-dark hover:bg-amber-400"}`}>
                {added ? <><Check className="w-5 h-5" />Added to Cart</> : <><ShoppingCart className="w-5 h-5" />Add to Cart</>}
              </button>
              <button className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <button className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <p className="text-sm text-gray-500">{product.stock} items in stock. Order now!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
