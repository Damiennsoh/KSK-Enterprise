"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { ArrowLeft, ShoppingCart, Heart, Share2, Check, Loader2, AlertTriangle, Ruler } from "lucide-react"
import { getProductById, getStockSettingsForDisplay } from "@/lib/actions/products"
import type { Product } from "@/types"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [mainImage, setMainImage] = useState("")
  const [added, setAdded] = useState(false)
  const [stockSettings, setStockSettings] = useState<any>(null)

  useEffect(() => {
    loadProduct()
  }, [productId])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const [data, settings] = await Promise.all([
        getProductById(productId),
        getStockSettingsForDisplay()
      ])
      if (!data) {
        setError("Product not found")
        return
      }
      setProduct(data)
      setStockSettings(settings)
      setMainImage(data.images[0] || "")
      setSelectedSize(data.sizes?.[0] || "")
      setSelectedColor(data.colors?.[0] || "")
    } catch (err) {
      console.error("Failed to load product:", err)
      setError("Failed to load product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.png",
      size: selectedSize,
      color: selectedColor,
      type: "product",
      showDimensions: product.show_dimensions,
      showSizes: product.show_sizes,
      showColors: product.show_colors,
      lengthCm: product.length_cm,
      widthCm: product.width_cm,
      deliveryCostOverride: product.delivery_cost_override,
      includeDeliveryInSummary: product.include_delivery_in_summary,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ksk-cream flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-ksk-gold animate-spin mb-4" />
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-ksk-cream">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-ksk-red" />
          </div>
          <h1 className="text-2xl font-bold text-ksk-dark mb-3">{error || "Product Not Found"}</h1>
          <p className="text-gray-500 mb-8">The product you are looking for does not exist or has been removed.</p>
          <Link href="/fashion" className="inline-flex items-center gap-2 px-6 py-3 bg-ksk-gold text-ksk-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />Back to Fashion
          </Link>
        </div>
      </div>
    )
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
              <img src={mainImage || "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800"} alt={product.name} className="w-full h-full object-cover" />
              {stockSettings && product.stock < stockSettings.limited_stock_threshold && (
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-ksk-red text-white text-sm font-semibold rounded-lg flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  {product.stock === 0 ? "Out of Stock" : 
                   product.stock < stockSettings.low_stock_threshold ? 
                   `${stockSettings.custom_labels?.low_stock || "Low Stock"} (${product.stock} left)` :
                   `${stockSettings.custom_labels?.limited_stock || "Limited"} (${product.stock} left)`}
                </div>
              )}
            </div>
            {product.images.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {product.images.map((img, idx) => (
                  <button key={idx} onClick={() => setMainImage(img)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${mainImage === img ? "border-ksk-gold" : "border-gray-200 hover:border-gray-400"}`}>
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="text-sm font-medium text-ksk-gold uppercase tracking-wide">{product.category}</span>
            <h1 className="text-3xl font-bold text-ksk-dark mt-2 mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-ksk-brown mb-6">GH₵ {product.price.toFixed(2)}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {(product.length_cm || product.width_cm) && (
              <div className="mb-6 p-4 bg-ksk-gold/5 border border-ksk-gold/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Ruler className="w-4 h-4 text-ksk-gold" />
                  <span className="text-sm font-semibold text-ksk-dark">Product Dimensions</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  {product.length_cm && (
                    <div>
                      <span className="text-gray-500">Length: </span>
                      <span className="font-semibold text-ksk-dark">{product.length_cm} cm</span>
                    </div>
                  )}
                  {product.width_cm && (
                    <div>
                      <span className="text-gray-500">Width: </span>
                      <span className="font-semibold text-ksk-dark">{product.width_cm} cm</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {product.show_sizes && product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-ksk-dark mb-2">Size</label>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2.5 min-w-[3rem] rounded-lg border-2 font-semibold text-sm transition-colors ${selectedSize === size ? "border-ksk-gold bg-ksk-gold/10 text-ksk-gold" : "border-gray-200 hover:border-gray-400 text-gray-700"}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.show_colors && product.colors && product.colors.length > 0 && (
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
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-ksk-dark mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-lg font-medium">-</button>
                <span className="w-14 text-center font-semibold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-lg font-medium">+</button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  added ? "bg-ksk-green text-white" : product.stock === 0 ? "bg-gray-300 text-gray-500" : "bg-ksk-gold text-ksk-dark hover:bg-amber-400"
                }`}
              >
                {added ? <><Check className="w-5 h-5" />Added to Cart</> : product.stock === 0 ? "Out of Stock" : <><ShoppingCart className="w-5 h-5" />Add to Cart</>}
              </button>
              <button className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" title="Add to Wishlist">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <button className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" title="Share">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className={`p-4 rounded-lg ${product.stock === 0 ? "bg-red-50 border border-red-200" : product.stock < 10 ? "bg-amber-50 border border-amber-200" : product.stock < 20 ? "bg-yellow-50 border border-yellow-200" : "bg-green-50 border border-green-200"}`}>
              <p className={`text-sm font-medium ${product.stock === 0 ? "text-red-700" : product.stock < 10 ? "text-amber-700" : product.stock < 20 ? "text-yellow-700" : "text-green-700"}`}>
                {product.stock === 0 ? "This product is currently out of stock." :
                 product.stock < 10 ? `Hurry! Only ${product.stock} items left in stock.` :
                 product.stock < 20 ? `Limited stock: ${product.stock} items available.` :
                 `${product.stock} items in stock. Order now!`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
