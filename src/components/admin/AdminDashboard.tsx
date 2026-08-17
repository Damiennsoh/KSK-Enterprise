"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { HeroCarouselManager } from "@/components/admin/HeroCarouselManager"
import { ImagePicker } from "@/components/admin/ImagePicker"
import {
  LayoutDashboard, ShoppingBag, Car, HardHat, MessageSquare,
  Users, DollarSign, Package, TrendingUp, LogOut, Home,
  Plus, Edit, Trash2, Eye, Search, Filter, X, Upload, Loader2, Menu,
  Settings, ChevronDown, ChevronUp, MapPin, AlertTriangle, Archive
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Product, Vehicle, Material, Order, RentalBooking, Inquiry } from "@/types"
import {
  createProduct, updateProduct, deleteProduct,
  createVehicle, updateVehicle, deleteVehicle,
  createMaterial, updateMaterial, deleteMaterial,
  updateOrderStatus, updateBookingStatus, updateInquiryStatus,
  markInquiryAsRead, archiveInquiry, unarchiveInquiry, deleteInquiry
} from "@/lib/actions/admin"
import { getProducts, getVehicles, getMaterials, getOrders, getRentalBookings, getInquiries, getUserCount } from "@/lib/actions/products"
import { getStockSettings, updateStockSettings, getDeliveryZones, createDeliveryZone, updateDeliveryZone, deleteDeliveryZone } from "@/lib/actions/settings"
import type { StockSettings, DeliveryZone } from "@/types"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"product" | "vehicle" | "material" | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, materials: 0, bookings: 0, inquiries: 0, users: 0 })
  const [products, setProducts] = useState<Product[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [bookings, setBookings] = useState<RentalBooking[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedMessageFilter, setSelectedMessageFilter] = useState<"all" | "unread" | "archived">("all")
  const [stockSettings, setStockSettings] = useState<StockSettings | null>(null)
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([])
  const [expandedSettings, setExpandedSettings] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [productsData, vehiclesData, materialsData, ordersData, bookingsData, inquiriesData, userCount, stockSettingsData, deliveryZonesData] = await Promise.all([
        getProducts(),
        getVehicles(),
        getMaterials(),
        getOrders(),
        getRentalBookings(),
        getInquiries(),
        getUserCount(),
        getStockSettings(),
        getDeliveryZones()
      ])
      setProducts(productsData)
      setVehicles(vehiclesData)
      setMaterials(materialsData)
      setOrders(ordersData)
      setBookings(bookingsData)
      setInquiries(inquiriesData)
      setStockSettings(stockSettingsData)
      setDeliveryZones(deliveryZonesData)
      setStats({
        orders: ordersData.length,
        revenue: ordersData
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + (o.total || 0), 0),
        products: productsData.length,
        materials: materialsData.length,
        bookings: bookingsData.length,
        inquiries: inquiriesData.length,
        users: userCount
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
    { label: "Fashion Products", value: stats.products.toString(), icon: Package, color: "bg-amber-500" },
    { label: "Construction Materials", value: stats.materials.toString(), icon: HardHat, color: "bg-orange-500" },
    { label: "Car Bookings", value: stats.bookings.toString(), icon: Car, color: "bg-purple-500" },
    { label: "Unread Messages", value: inquiries.filter(i => (!i.is_read || i.is_read === false) && (!i.is_archived || i.is_archived === false)).length.toString(), icon: MessageSquare, color: "bg-rose-500" },
    { label: "Registered Users", value: stats.users.toString(), icon: Users, color: "bg-cyan-500" },
  ]

  const handleDelete = async (id: string, type: "product" | "vehicle" | "material" | "inquiry") => {
    if (!confirm("Are you sure you want to delete this item?")) return
    try {
      if (type === "product") await deleteProduct(id)
      else if (type === "vehicle") await deleteVehicle(id)
      else if (type === "material") await deleteMaterial(id)
      else if (type === "inquiry") await deleteInquiry(id)
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

  const handleMarkAsRead = async (id: string) => {
    try {
      await markInquiryAsRead(id)
      await loadData()
    } catch (error) {
      alert("Error marking as read: " + (error as Error).message)
    }
  }

  const handleArchive = async (id: string) => {
    try {
      await archiveInquiry(id)
      await loadData()
    } catch (error) {
      alert("Error archiving message: " + (error as Error).message)
    }
  }

  const handleUnarchive = async (id: string) => {
    try {
      await unarchiveInquiry(id)
      await loadData()
    } catch (error) {
      alert("Error unarchiving message: " + (error as Error).message)
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
    { id: "carousel", label: "Carousel", icon: HardHat },
    { id: "products", label: "Fashion Products", icon: Package },
    { id: "materials", label: "Construction Materials", icon: HardHat },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "bookings", label: "Car Bookings", icon: Car },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header - Standalone */}
      <div className="bg-ksk-dark text-white sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
                <Menu className="w-5 h-5" />
              </button>
              <span className="font-bold text-sm sm:text-base">Admin</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="p-2 hover:bg-white/10 rounded-lg" title="Back to Home">
                <Home className="w-5 h-5" />
              </Link>
              <Link href="/login" className="p-2 hover:bg-white/10 rounded-lg" title="Logout">
                <LogOut className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform lg:transition-none pt-16 lg:pt-0`}>
          <div className="p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-ksk-gold text-ksk-dark"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-ksk-dark mb-4 lg:mb-6">Overview</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
                  {statsArray.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-3 lg:p-5 border border-gray-100">
                      <div className="flex items-center justify-between mb-2 lg:mb-3">
                        <div className={`w-8 h-8 lg:w-10 lg:h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                          <stat.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                        </div>
                        <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-green-500 hidden sm:block" />
                      </div>
                      <p className="text-lg lg:text-2xl font-bold text-ksk-dark">{stat.value}</p>
                      <p className="text-xs lg:text-sm text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 lg:px-6 lg:py-4 border-b border-gray-100">
                    <h3 className="font-bold text-ksk-dark text-sm lg:text-base">Recent Orders</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="px-4 py-3 lg:px-6 lg:py-4 flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-ksk-dark text-sm truncate">{order.id}</p>
                          <p className="text-xs text-gray-500 truncate">{order.customer_name}</p>
                        </div>
                        <div className="text-right ml-2 shrink-0">
                          <p className="font-bold text-ksk-brown text-sm">GH₵ {order.total.toFixed(2)}</p>
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl lg:text-2xl font-bold text-ksk-dark">Fashion Products</h2>
                  <button onClick={() => openModal("product")} className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-ksk-gold text-ksk-dark text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors">
                    <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add</span>
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm">Product</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden sm:table-cell">Category</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm">Price</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden md:table-cell">Stock</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-right font-semibold text-gray-600 text-xs lg:text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 lg:px-4 lg:py-3 font-medium text-ksk-dark text-sm">{p.name}</td>
                            <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-600 text-sm hidden sm:table-cell">{p.category}</td>
                            <td className="px-3 py-2 lg:px-4 lg:py-3 text-ksk-brown font-semibold text-sm">GH₵ {p.price.toFixed(2)}</td>
                            <td className="px-3 py-2 lg:px-4 lg:py-3 text-sm hidden md:table-cell">
                              <div className="flex items-center gap-2">
                                <span className={p.stock < 10 ? "text-ksk-red font-bold" : p.stock < 20 ? "text-amber-600 font-semibold" : "text-gray-600"}>
                                  {p.stock}
                                </span>
                                {p.stock < 10 && (
                                  <span className="px-2 py-0.5 bg-ksk-red/10 text-ksk-red text-xs font-semibold rounded-full">Low Stock</span>
                                )}
                                {p.stock >= 10 && p.stock < 20 && (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Limited</span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2 lg:px-4 lg:py-3 text-right">
                              <div className="flex items-center justify-end gap-1 lg:gap-2">
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl lg:text-2xl font-bold text-ksk-dark">Orders</h2>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ksk-gold w-40 lg:w-auto" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm">ID</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden sm:table-cell">Customer</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm">Total</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm">Status</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden md:table-cell">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.map((o) => (
                          <tr key={o.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 lg:px-4 lg:py-3 font-medium text-ksk-dark text-sm truncate">{o.id.slice(0, 8)}...</td>
                            <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-600 text-sm hidden sm:table-cell">{o.customer_name}</td>
                            <td className="px-3 py-2 lg:px-4 lg:py-3 font-semibold text-ksk-brown text-sm">GH₵ {o.total.toFixed(2)}</td>
                            <td className="px-3 py-2 lg:px-4 lg:py-3">
                              <select
                                value={o.status}
                                onChange={(e) => handleStatusUpdate(o.id, e.target.value, "order")}
                                className={`px-2 py-1 rounded text-xs font-medium border-0 ${statusColors[o.status]}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-500 text-xs lg:text-sm hidden md:table-cell">{new Date(o.created_at).toLocaleDateString()}</td>
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl lg:text-2xl font-bold text-ksk-dark">Car Bookings</h2>
                  <button onClick={() => openModal("vehicle")} className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-ksk-gold text-ksk-dark text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors">
                    <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Vehicle</span>
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm">ID</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden sm:table-cell">Customer</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden md:table-cell">Vehicle</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm">Date</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden md:table-cell">Days</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bookings.map((b) => {
                          const vehicle = vehicles.find(v => v.id === b.vehicle_id)
                          return (
                            <tr key={b.id} className="hover:bg-gray-50">
                              <td className="px-3 py-2 lg:px-4 lg:py-3 font-medium text-ksk-dark text-sm truncate">{b.id.slice(0, 8)}...</td>
                              <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-600 text-sm hidden sm:table-cell">{b.customer_name}</td>
                              <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-600 text-sm hidden md:table-cell">{vehicle?.name || "Unknown"}</td>
                              <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-600 text-sm">{new Date(b.rental_date).toLocaleDateString()}</td>
                              <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-600 text-sm hidden md:table-cell">{b.days}</td>
                              <td className="px-3 py-2 lg:px-4 lg:py-3">
                                <select
                                  value={b.status}
                                  onChange={(e) => handleStatusUpdate(b.id, e.target.value, "booking")}
                                  className={`px-2 py-1 rounded text-xs font-medium border-0 ${statusColors[b.status]}`}
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
                <div className="mt-6 lg:mt-8">
                  <h3 className="text-lg lg:text-xl font-bold text-ksk-dark mb-3 lg:mb-4">Vehicles</h3>
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm">Vehicle</th>
                            <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden sm:table-cell">Brand</th>
                            <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden md:table-cell">Model</th>
                            <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm">Price/Day</th>
                            <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden md:table-cell">Available</th>
                            <th className="px-3 py-2 lg:px-4 lg:py-3 text-right font-semibold text-gray-600 text-xs lg:text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {vehicles.map((v) => (
                            <tr key={v.id} className="hover:bg-gray-50">
                              <td className="px-3 py-2 lg:px-4 lg:py-3 font-medium text-ksk-dark text-sm">{v.name}</td>
                              <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-600 text-sm hidden sm:table-cell">{v.brand}</td>
                              <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-600 text-sm hidden md:table-cell">{v.model}</td>
                              <td className="px-3 py-2 lg:px-4 lg:py-3 text-ksk-brown font-semibold text-sm">GH₵ {v.price_per_day.toFixed(2)}</td>
                              <td className="px-3 py-2 lg:px-4 lg:py-3 hidden md:table-cell">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${v.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                  {v.is_available ? "Yes" : "No"}
                                </span>
                              </td>
                              <td className="px-3 py-2 lg:px-4 lg:py-3 text-right">
                                <div className="flex items-center justify-end gap-1 lg:gap-2">
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

            {/* MESSAGES TAB */}
            {activeTab === "messages" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl lg:text-2xl font-bold text-ksk-dark">Messages</h2>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setSelectedMessageFilter("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedMessageFilter === "all" ? "bg-ksk-gold text-ksk-dark" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                  >
                    All Messages
                  </button>
                  <button
                    onClick={() => setSelectedMessageFilter("unread")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedMessageFilter === "unread" ? "bg-ksk-gold text-ksk-dark" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                  >
                    Unread ({inquiries.filter(i => (!i.is_read || i.is_read === false) && (!i.is_archived || i.is_archived === false)).length})
                  </button>
                  <button
                    onClick={() => setSelectedMessageFilter("archived")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedMessageFilter === "archived" ? "bg-ksk-gold text-ksk-dark" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                  >
                    Archived
                  </button>
                </div>
                {(() => {
                  const filteredInquiries = inquiries.filter(i => {
                    if (selectedMessageFilter === "unread") return (!i.is_read || i.is_read === false) && (!i.is_archived || i.is_archived === false)
                    if (selectedMessageFilter === "archived") return i.is_archived === true
                    return !i.is_archived || i.is_archived === false
                  })
                  
                  if (filteredInquiries.length === 0) {
                    return (
                      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No messages found. Messages from the contact form will appear here.</p>
                      </div>
                    )
                  }
                  
                  return (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm">ID</th>
                              <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden sm:table-cell">Name</th>
                              <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden md:table-cell">Phone</th>
                              <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden md:table-cell">Type</th>
                              <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden lg:table-cell">Message</th>
                              <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm">Status</th>
                              <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden md:table-cell">Date</th>
                              <th className="px-3 py-2 lg:px-4 lg:py-3 text-right font-semibold text-gray-600 text-xs lg:text-sm">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredInquiries.map((i) => (
                              <tr key={i.id} className={`hover:bg-gray-50 ${(!i.is_read || i.is_read === false) ? "bg-blue-50/50" : ""}`}>
                                <td className="px-3 py-2 lg:px-4 lg:py-3 font-medium text-ksk-dark text-sm truncate">{i.id.slice(0, 8)}...</td>
                                <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-600 text-sm hidden sm:table-cell">
                                  <div className="flex items-center gap-2">
                                    {i.name}
                                    {(!i.is_read || i.is_read === false) && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                                  </div>
                                </td>
                                <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-600 text-sm hidden md:table-cell">{i.phone}</td>
                                <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-600 text-sm hidden md:table-cell capitalize">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    i.type === 'general' ? 'bg-gray-100 text-gray-700' :
                                    i.type === 'construction' ? 'bg-orange-100 text-orange-700' :
                                    i.type === 'rental' ? 'bg-purple-100 text-purple-700' :
                                    i.type === 'order' ? 'bg-blue-100 text-blue-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {i.type}
                                  </span>
                                </td>
                                <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-600 text-sm hidden lg:table-cell max-w-xs truncate">{i.message}</td>
                                <td className="px-3 py-2 lg:px-4 lg:py-3">
                                  <select
                                    value={i.status}
                                    onChange={(e) => handleStatusUpdate(i.id, e.target.value, "inquiry")}
                                    className={`px-2 py-1 rounded text-xs font-medium border-0 ${statusColors[i.status]}`}
                                  >
                                    <option value="new">New</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                  </select>
                                </td>
                                <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-500 text-xs lg:text-sm hidden md:table-cell">{new Date(i.created_at).toLocaleDateString()}</td>
                                <td className="px-3 py-2 lg:px-4 lg:py-3 text-right">
                                  <div className="flex items-center justify-end gap-1 lg:gap-2">
                                    {!i.is_read && (
                                      <button onClick={() => handleMarkAsRead(i.id)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors" title="Mark as read">
                                        <Eye className="w-4 h-4" />
                                      </button>
                                    )}
                                    {!i.is_archived ? (
                                      <button onClick={() => handleArchive(i.id)} className="p-1.5 text-gray-400 hover:text-amber-500 transition-colors" title="Archive">
                                        <Archive className="w-4 h-4" />
                                      </button>
                                    ) : (
                                      <button onClick={() => handleUnarchive(i.id)} className="p-1.5 text-gray-400 hover:text-green-500 transition-colors" title="Unarchive">
                                        <Archive className="w-4 h-4" />
                                      </button>
                                    )}
                                    <button onClick={() => handleDelete(i.id, "inquiry")} className="p-1.5 text-gray-400 hover:text-ksk-red transition-colors" title="Delete">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* MATERIALS TAB */}
            {activeTab === "materials" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl lg:text-2xl font-bold text-ksk-dark">Construction Materials</h2>
                  <button onClick={() => openModal("material")} className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-ksk-gold text-ksk-dark text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors">
                    <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Material</span>
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm">Material</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden sm:table-cell">Category</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm">Price</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden md:table-cell">Unit</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-left font-semibold text-gray-600 text-xs lg:text-sm hidden md:table-cell">Stock</th>
                          <th className="px-3 py-2 lg:px-4 lg:py-3 text-right font-semibold text-gray-600 text-xs lg:text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {materials.map((m) => (
                          <tr key={m.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 lg:px-4 lg:py-3 font-medium text-ksk-dark text-sm">{m.name}</td>
                            <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-600 text-sm hidden sm:table-cell">{m.category}</td>
                            <td className="px-3 py-2 lg:px-4 lg:py-3 text-ksk-brown font-semibold text-sm">GH₵ {m.price.toFixed(2)}</td>
                            <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-600 text-sm hidden md:table-cell">{m.unit}</td>
                            <td className="px-3 py-2 lg:px-4 lg:py-3 text-sm hidden md:table-cell">
                              <div className="flex items-center gap-2">
                                <span className={m.stock < 20 ? "text-ksk-red font-bold" : m.stock < 100 ? "text-amber-600 font-semibold" : "text-gray-600"}>
                                  {m.stock}
                                </span>
                                {m.stock < 20 && (
                                  <span className="px-2 py-0.5 bg-ksk-red/10 text-ksk-red text-xs font-semibold rounded-full">Low Stock</span>
                                )}
                                {m.stock >= 20 && m.stock < 100 && (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Limited</span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2 lg:px-4 lg:py-3 text-right">
                              <div className="flex items-center justify-end gap-1 lg:gap-2">
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
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-ksk-dark mb-4 lg:mb-6">Settings</h2>
                
                {/* Stock Status Settings */}
                <div className="bg-white rounded-xl border border-gray-100 mb-4 lg:mb-6">
                  <button 
                    onClick={() => setExpandedSettings(expandedSettings === "stock" ? null : "stock")}
                    className="w-full px-4 py-3 lg:px-6 lg:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-ksk-gold" />
                      <span className="font-semibold text-ksk-dark text-sm lg:text-base">Stock Status Settings</span>
                    </div>
                    {expandedSettings === "stock" ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>
                  
                  {expandedSettings === "stock" && (
                    <div className="px-4 py-4 lg:px-6 lg:py-6 border-t border-gray-100">
                      <form action={async (formData) => {
                        try {
                          await updateStockSettings(formData)
                          await loadData()
                          alert("Stock settings updated successfully!")
                        } catch (error) {
                          alert("Error updating stock settings: " + (error as Error).message)
                        }
                      }} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                            <input 
                              name="low_stock_threshold" 
                              type="number" 
                              defaultValue={stockSettings?.low_stock_threshold || 10}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent"
                              placeholder="e.g., 10"
                            />
                            <p className="text-xs text-gray-500 mt-1">Stock below this shows "Low Stock"</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Limited Stock Threshold</label>
                            <input 
                              name="limited_stock_threshold" 
                              type="number" 
                              defaultValue={stockSettings?.limited_stock_threshold || 20}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent"
                              placeholder="e.g., 20"
                            />
                            <p className="text-xs text-gray-500 mt-1">Stock below this shows "Limited"</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Label</label>
                            <input 
                              name="label_low_stock" 
                              type="text" 
                              defaultValue={stockSettings?.custom_labels?.low_stock || "Low Stock"}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Limited Stock Label</label>
                            <input 
                              name="label_limited_stock" 
                              type="text" 
                              defaultValue={stockSettings?.custom_labels?.limited_stock || "Limited"}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent"
                            />
                          </div>
                        </div>
                        <button type="submit" className="px-4 py-2 bg-ksk-gold text-ksk-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors">
                          Save Stock Settings
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Delivery Zones Settings */}
                <div className="bg-white rounded-xl border border-gray-100">
                  <button 
                    onClick={() => setExpandedSettings(expandedSettings === "delivery" ? null : "delivery")}
                    className="w-full px-4 py-3 lg:px-6 lg:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-ksk-gold" />
                      <span className="font-semibold text-ksk-dark text-sm lg:text-base">Delivery Zones</span>
                    </div>
                    {expandedSettings === "delivery" ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>
                  
                  {expandedSettings === "delivery" && (
                    <div className="px-4 py-4 lg:px-6 lg:py-6 border-t border-gray-100">
                      <div className="mb-4">
                        <h4 className="font-semibold text-ksk-dark mb-3">Current Delivery Zones</h4>
                        <div className="space-y-2">
                          {deliveryZones.map((zone) => (
                            <div key={zone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-ksk-dark">{zone.zone_name}</p>
                                <p className="text-sm text-gray-600">GH₵ {zone.base_delivery_cost.toFixed(2)}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => {
                                    const newCost = prompt(`Update delivery cost for ${zone.zone_name}:`, zone.base_delivery_cost.toString())
                                    if (newCost) {
                                      const formData = new FormData()
                                      formData.append("zone_name", zone.zone_name)
                                      formData.append("base_delivery_cost", newCost)
                                      formData.append("display_order", zone.display_order.toString())
                                      formData.append("is_active", zone.is_active ? "true" : "false")
                                      updateDeliveryZone(zone.id, formData).then(() => loadData())
                                    }
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    if (confirm(`Delete ${zone.zone_name}?`)) {
                                      deleteDeliveryZone(zone.id).then(() => loadData())
                                    }
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-ksk-red transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <form 
                        action={async (formData) => {
                          try {
                            await createDeliveryZone(formData)
                            await loadData()
                            alert("Delivery zone added successfully!")
                          } catch (error) {
                            alert("Error adding delivery zone: " + (error as Error).message)
                          }
                        }}
                        className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3"
                      >
                        <h4 className="font-semibold text-ksk-dark">Add New Delivery Zone</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Zone Name</label>
                            <input 
                              name="zone_name" 
                              type="text" 
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent"
                              placeholder="e.g., Wa Central"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Cost (GH₵)</label>
                            <input 
                              name="base_delivery_cost" 
                              type="number" 
                              step="0.01"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent"
                              placeholder="e.g., 15.00"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                          <input 
                            name="display_order" 
                            type="number" 
                            defaultValue={deliveryZones.length + 1}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent"
                          />
                        </div>
                        <button type="submit" className="px-4 py-2 bg-ksk-gold text-ksk-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors">
                          Add Delivery Zone
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-ksk-dark">
                {editingItem ? `Edit ${modalType === "product" ? "Fashion Product" : modalType === "vehicle" ? "Vehicle" : "Material"}` : `Add ${modalType === "product" ? "Fashion Product" : modalType === "vehicle" ? "Vehicle" : "Material"}`}
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
                    <select name="category" defaultValue={editingItem?.category || "Male Smocks"} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent">
                      <option value="Male Smocks">Male Smocks</option>
                      <option value="Female Smocks">Female Smocks</option>
                      <option value="Children Smocks">Children Smocks</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Hats">Hats</option>
                      <option value="Sandals">Sandals</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
                      <input name="length_cm" type="number" step="0.1" defaultValue={editingItem?.length_cm ?? ""} placeholder="e.g., 120" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
                      <input name="width_cm" type="number" step="0.1" defaultValue={editingItem?.width_cm ?? ""} placeholder="e.g., 80" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma-separated, e.g., S, M, L, XL, XXL)</label>
                    <input name="sizes" defaultValue={editingItem?.sizes?.join(", ") || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma-separated)</label>
                    <input name="colors" defaultValue={editingItem?.colors?.join(", ") || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent" />
                  </div>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700">Display in Cart & Checkout:</p>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="show_dimensions" defaultChecked={editingItem?.show_dimensions ?? true} className="w-4 h-4 rounded border-gray-300 text-ksk-gold focus:ring-ksk-gold" />
                        <span className="text-sm text-gray-700">Show Dimensions (L/W)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="show_sizes" defaultChecked={editingItem?.show_sizes ?? true} className="w-4 h-4 rounded border-gray-300 text-ksk-gold focus:ring-ksk-gold" />
                        <span className="text-sm text-gray-700">Show Sizes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="show_colors" defaultChecked={editingItem?.show_colors ?? true} className="w-4 h-4 rounded border-gray-300 text-ksk-gold focus:ring-ksk-gold" />
                        <span className="text-sm text-gray-700">Show Colors</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700">Delivery Settings:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Cost Override (GH₵)</label>
                        <input 
                          name="delivery_cost_override" 
                          type="number" 
                          step="0.01" 
                          defaultValue={editingItem?.delivery_cost_override ?? ""} 
                          placeholder="Leave empty for zone default"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ksk-gold focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Overrides zone-based cost if set</p>
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" name="include_delivery_in_summary" defaultChecked={editingItem?.include_delivery_in_summary ?? true} className="w-4 h-4 rounded border-gray-300 text-ksk-gold focus:ring-ksk-gold" />
                          <span className="text-sm text-gray-700">Include delivery in order summary</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product images</label>
                    <ImagePicker name="images" bucket="products" value={editingItem?.images || []} />
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle images</label>
                    <ImagePicker name="images" bucket="vehicles" value={editingItem?.images || []} />
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Material images</label>
                    <ImagePicker name="images" bucket="materials" value={editingItem?.images || []} />
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
