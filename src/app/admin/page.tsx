"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { HeroCarouselManager } from "@/components/admin/HeroCarouselManager"
import {
  LayoutDashboard, ShoppingBag, Car, HardHat, MessageSquare,
  Users, DollarSign, Package, TrendingUp, LogOut,
  Plus, Edit, Trash2, Eye, Search, Filter, X, Upload, Loader2
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Product, Vehicle, Material, Order, RentalBooking, Inquiry } from "@/types"
import {
  createProduct, updateProduct, deleteProduct,
  createVehicle, updateVehicle, deleteVehicle,
  createMaterial, updateMaterial, deleteMaterial,
  updateOrderStatus, updateBookingStatus, updateInquiryStatus,
  uploadImage
} from "@/lib/actions/admin"
import { getProducts, getVehicles, getMaterials, getOrders, getRentalBookings, getInquiries } from "@/lib/actions/products"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"product" | "vehicle" | "material" | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [uploading, setUploading] = useState(false)

  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, bookings: 0, inquiries: 0, users: 0 })
  const [products, setProducts] = useState<Product[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [bookings, setBookings] = useState<RentalBooking[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [productsData, vehiclesData, materialsData, ordersData, bookingsData, inquiriesData] = await Promise.all([
        getProducts(),
        getVehicles(),
        getMaterials(),
        getOrders(),
        getRentalBookings(),
        getInquiries()
      ])
      setProducts(productsData)
      setVehicles(vehiclesData)
      setMaterials(materialsData)
      setOrders(ordersData)
      setBookings(bookingsData)
      setInquiries(inquiriesData)
      setStats({
        orders: ordersData.length,
        revenue: ordersData.reduce((sum, o) => sum + o.total, 0),
        products: productsData.length,
        bookings: bookingsData.length,
        inquiries: inquiriesData.length,
        users: 0
      })
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    new: "bg-red-100 text-red-800",
    in_progress: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
  }

  const statsArray = [
    { label: "Total Orders", value: stats.orders.toString(), icon: ShoppingBag, color: "bg-blue-500" },
    { label: "Total Revenue", value: `GH₵ ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "bg-green-500" },
    { label: "Products", value: stats.products.toString(), icon: Package, color: "bg-amber-500" },
    { label: "Rental Bookings", value: stats.bookings.toString(), icon: Car, color: "bg-purple-500" },
    { label: "Inquiries", value: stats.inquiries.toString(), icon: MessageSquare, color: "bg-rose-500" },
    { label: "New Users", value: stats.users.toString(), icon: Users, color: "bg-cyan-500" },
  ]

  const handleDelete = async (id: string, type: "product" | "vehicle" | "material") => {
    if (!confirm("Are you sure you want to delete this item?")) return
    try {
      if (type === "product") await deleteProduct(id)
      else if (type === "vehicle") await deleteVehicle(id)
      else if (type === "material") await deleteMaterial(id)
      await loadData()
    } catch (error) {
      alert("Error deleting item: " + (error as Error).message)
    }
  }

  const handleStatusUpdate = async (id: string, status: string, type: "order" | "booking" | "inquiry") => {
    try {
      if (type === "order") await updateOrderStatus(id, status)
      else if (type === "booking") await updateBookingStatus(id, status)
      else if (type === "inquiry") await updateInquiryStatus(id, status)
      await loadData()
    } catch (error) {
      alert("Error updating status: " + (error as Error).message)
    }
  }

  const handleImageUpload = async (file: File, bucket: string): Promise<string> => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("bucket", bucket)
      const url = await uploadImage(formData)
      return url
    } catch (error) {
      alert("Error uploading image: " + (error as Error).message)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const openModal = (type: "product" | "vehicle" | "material", item?: any) => {
    setModalType(type)
    setEditingItem(item || null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType(null)
    setEditingItem(null)
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "carousel", label: "Hero Carousel", icon: HardHat },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "bookings", label: "Bookings", icon: Car },
    { id: "inquiries", label: "Inquiries", icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-ksk-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-ksk-gold rounded-full flex items-center justify-center">
                <span className="text-ksk-dark font-bold text-sm">K</span>
              </div>
              <span className="font-bold">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 hidden sm:inline">admin@kskenterprise.com</span>
              <Link href="/" className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />Exit
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-ksk-gold/10 text-ksk-gold border-l-4 border-ksk-gold"
                      : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div>
                <h2 className="text-2xl font-bold text-ksk-dark mb-6">Dashboard Overview</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {statsArray.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold text-ksk-dark">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-ksk-dark">Recent Orders</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-ksk-dark">{order.id}</p>
                          <p className="text-sm text-gray-500">{order.customer_name} · {order.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-ksk-brown">GH₵ {order.total.toFixed(2)}</p>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* HERO CAROUSEL TAB */}
            {activeTab === "carousel" && <HeroCarouselManager />}

            {/* PRODUCTS TAB */}
            {activeTab === "products" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-ksk-dark">Products</h2>
                  <button onClick={() => openModal("product")} className="flex items-center gap-2 px-4 py-2 bg-ksk-gold text-ksk-dark text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors">
                    <Plus className="w-4 h-4" />Add Product
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Product</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Category</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Price</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Stock</th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-ksk-dark">{p.name}</td>
                            <td className="px-4 py-3 text-gray-600">{p.category}</td>
                            <td className="px-4 py-3 text-ksk-brown font-semibold">GH₵ {p.price.toFixed(2)}</td>
                            <td className="px-4 py-3 text-gray-600">{p.stock}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => openModal("product", p)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(p.id, "product")} className="p-1.5 text-gray-400 hover:text-ksk-red transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-ksk-dark">Orders</h2>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="Search orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ksk-gold" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Order ID</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Customer</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Phone</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Total</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.map((o) => (
                          <tr key={o.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-ksk-dark">{o.id}</td>
                            <td className="px-4 py-3 text-gray-600">{o.customer_name}</td>
                            <td className="px-4 py-3 text-gray-600">{o.phone}</td>
                            <td className="px-4 py-3 font-semibold text-ksk-brown">GH₵ {o.total.toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <select
                                value={o.status}
                                onChange={(e) => handleStatusUpdate(o.id, e.target.value, "order")}
                                className={`px-2 py-0.5 rounded text-xs font-medium border-0 ${statusColors[o.status]}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === "bookings" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-ksk-dark">Rental Bookings</h2>
                  <button onClick={() => openModal("vehicle")} className="flex items-center gap-2 px-4 py-2 bg-ksk-gold text-ksk-dark text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors">
                    <Plus className="w-4 h-4" />Add Vehicle
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Booking ID</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Customer</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Vehicle</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Days</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bookings.map((b) => {
                          const vehicle = vehicles.find(v => v.id === b.vehicle_id)
                          return (
                            <tr key={b.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-ksk-dark">{b.id}</td>
                              <td className="px-4 py-3 text-gray-600">{b.customer_name}<br /><span className="text-xs text-gray-400">{b.phone}</span></td>
                              <td className="px-4 py-3 text-gray-600">{vehicle?.name || "Unknown"}</td>
                              <td className="px-4 py-3 text-gray-600">{new Date(b.rental_date).toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-gray-600">{b.days}</td>
                              <td className="px-4 py-3">
                                <select
                                  value={b.status}
                                  onChange={(e) => handleStatusUpdate(b.id, e.target.value, "booking")}
                                  className={`px-2 py-0.5 rounded text-xs font-medium border-0 ${statusColors[b.status]}`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Vehicles List */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-ksk-dark mb-4">Vehicles</h3>
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Vehicle</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Brand</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Model</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Price/Day</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Available</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {vehicles.map((v) => (
                            <tr key={v.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-ksk-dark">{v.name}</td>
                              <td className="px-4 py-3 text-gray-600">{v.brand}</td>
                              <td className="px-4 py-3 text-gray-600">{v.model}</td>
                              <td className="px-4 py-3 text-ksk-brown font-semibold">GH₵ {v.price_per_day.toFixed(2)}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${v.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                  {v.is_available ? "Yes" : "No"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => openModal("vehicle", v)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"><Edit className="w-4 h-4" /></button>
                                  <button onClick={() => handleDelete(v.id, "vehicle")} className="p-1.5 text-gray-400 hover:text-ksk-red transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* INQUIRIES TAB */}
            {activeTab === "inquiries" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-ksk-dark">Construction Inquiries</h2>
                  <button onClick={() => openModal("material")} className="flex items-center gap-2 px-4 py-2 bg-ksk-gold text-ksk-dark text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors">
                    <Plus className="w-4 h-4" />Add Material
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">ID</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Type</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Message</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {inquiries.map((i) => (
                          <tr key={i.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-ksk-dark">{i.id}</td>
                            <td className="px-4 py-3 text-gray-600">{i.name}<br /><span className="text-xs text-gray-400">{i.phone}</span></td>
                            <td className="px-4 py-3"><span className="capitalize text-gray-600">{i.type}</span></td>
                            <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{i.message}</td>
                            <td className="px-4 py-3">
                              <select
                                value={i.status}
                                onChange={(e) => handleStatusUpdate(i.id, e.target.value, "inquiry")}
                                className={`px-2 py-0.5 rounded text-xs font-medium border-0 ${statusColors[i.status]}`}
                              >
                                <option value="new">New</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 text-gray-500">{new Date(i.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Materials List */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-ksk-dark mb-4">Materials</h3>
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Material</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Category</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Price</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Unit</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Stock</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {materials.map((m) => (
                            <tr key={m.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-ksk-dark">{m.name}</td>
                              <td className="px-4 py-3 text-gray-600">{m.category}</td>
                              <td className="px-4 py-3 text-ksk-brown font-semibold">GH₵ {m.price.toFixed(2)}</td>
                              <td className="px-4 py-3 text-gray-600">{m.unit}</td>
                              <td className="px-4 py-3 text-gray-600">{m.stock}</td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => openModal("material", m)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"><Edit className="w-4 h-4" /></button>
                                  <button onClick={() => handleDelete(m.id, "material")} className="p-1.5 text-gray-400 hover:text-ksk-red transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-ksk-dark">
                {editingItem ? `Edit ${modalType}` : `Add ${modalType}`}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              try {
                if (modalType === "product") {
                  if (editingItem) await updateProduct(editingItem.id, formData)
                  else await createProduct(formData)
                } else if (modalType === "vehicle") {
                  if (editingItem) await updateVehicle(editingItem.id, formData)
                  else await createVehicle(formData)
                } else if (modalType === "material") {
                  if (editingItem) await updateMaterial(editingItem.id, formData)
                  else await createMaterial(formData)
                }
                await loadData()
                closeModal()
              } catch (error) {
                alert("Error saving: " + (error as Error).message)
              }
            }} className="p-6 space-y-4">
              {modalType === "product" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input name="name" defaultValue={editingItem?.name} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" defaultValue={editingItem?.description || ""} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (GH₵)</label>
                      <input name="price" type="number" step="0.01" defaultValue={editingItem?.price} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input name="stock" type="number" defaultValue={editingItem?.stock} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input name="category" defaultValue={editingItem?.category} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma-separated)</label>
                    <input name="sizes" defaultValue={editingItem?.sizes?.join(", ") || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma-separated)</label>
                    <input name="colors" defaultValue={editingItem?.colors?.join(", ") || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images (comma-separated URLs)</label>
                    <textarea name="images" defaultValue={editingItem?.images?.join(", ") || ""} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" />
                  </div>
                </>
              )}

              {modalType === "vehicle" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input name="name" defaultValue={editingItem?.name} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                      <input name="brand" defaultValue={editingItem?.brand} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                      <input name="model" defaultValue={editingItem?.model} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                      <input name="seats" type="number" defaultValue={editingItem?.seats} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price/Day (GH₵)</label>
                      <input name="price_per_day" type="number" step="0.01" defaultValue={editingItem?.price_per_day} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deposit (GH₵)</label>
                    <input name="deposit" type="number" step="0.01" defaultValue={editingItem?.deposit} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" defaultValue={editingItem?.description || ""} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images (comma-separated URLs)</label>
                    <textarea name="images" defaultValue={editingItem?.images?.join(", ") || ""} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="is_available" defaultChecked={editingItem?.is_available ?? true} className="w-4 h-4 text-ksk-gold rounded focus:ring-ksk-gold" />
                    <label className="text-sm font-medium text-gray-700">Available for rent</label>
                  </div>
                </>
              )}

              {modalType === "material" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input name="name" defaultValue={editingItem?.name} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" defaultValue={editingItem?.description || ""} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (GH₵)</label>
                      <input name="price" type="number" step="0.01" defaultValue={editingItem?.price} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <input name="unit" defaultValue={editingItem?.unit} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" placeholder="e.g., bag, piece, kg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input name="stock" type="number" defaultValue={editingItem?.stock} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input name="category" defaultValue={editingItem?.category} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images (comma-separated URLs)</label>
                    <textarea name="images" defaultValue={editingItem?.images?.join(", ") || ""} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={uploading} className="px-4 py-2 bg-ksk-gold text-ksk-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingItem ? "Update" : "Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
