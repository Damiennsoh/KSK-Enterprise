"use client"

import { useState } from "react"
import Link from "next/link"
import { HeroCarouselManager } from "@/components/admin/HeroCarouselManager"
import {
  LayoutDashboard, ShoppingBag, Car, HardHat, MessageSquare,
  Users, DollarSign, Package, TrendingUp, LogOut,
  Plus, Edit, Trash2, Eye, Search, Filter
} from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  // Sample data for UI demonstration
  const stats = [
    { label: "Total Orders", value: "24", icon: ShoppingBag, color: "bg-blue-500" },
    { label: "Total Revenue", value: "GH₵ 12,450", icon: DollarSign, color: "bg-green-500" },
    { label: "Products", value: "32", icon: Package, color: "bg-amber-500" },
    { label: "Rental Bookings", value: "8", icon: Car, color: "bg-purple-500" },
    { label: "Inquiries", value: "15", icon: MessageSquare, color: "bg-rose-500" },
    { label: "New Users", value: "42", icon: Users, color: "bg-cyan-500" },
  ]

  const orders = [
    { id: "ORD-001", customer: "Abdul Rahman", phone: "0242123456", total: 700, status: "confirmed", date: "2024-08-05" },
    { id: "ORD-002", customer: "Fatima Issah", phone: "0202987654", total: 350, status: "pending", date: "2024-08-06" },
    { id: "ORD-003", customer: "Kwame Asante", phone: "0245566778", total: 1200, status: "shipped", date: "2024-08-04" },
    { id: "ORD-004", customer: "Amina Mohammed", phone: "0201122334", total: 85, status: "delivered", date: "2024-08-03" },
  ]

  const bookings = [
    { id: "BK-001", customer: "John Mensah", phone: "0249988776", vehicle: "Toyota Camry", date: "2024-08-10", days: 3, status: "pending" },
    { id: "BK-002", customer: "Grace Addo", phone: "0203344556", vehicle: "Mercedes-Benz C-Class", date: "2024-08-15", days: 1, status: "confirmed" },
  ]

  const inquiries = [
    { id: "INQ-001", name: "Ibrahim Sulemana", phone: "0247788990", type: "construction", message: "I need a quote for building a 3-bedroom house.", status: "new", date: "2024-08-06" },
    { id: "INQ-002", name: "Mary Bawa", phone: "0205566778", type: "labour", message: "Looking for skilled masons for a project.", status: "in_progress", date: "2024-08-05" },
  ]

  const products = [
    { id: "1", name: "Traditional Fugu Smock", category: "Smocks", price: 350, stock: 25 },
    { id: "2", name: "Premium Wedding Fugu", category: "Smocks", price: 550, stock: 15 },
    { id: "3", name: "Dangote Cement", category: "Cement", price: 85, stock: 500 },
    { id: "4", name: "Toyota Camry", category: "Rental", price: 450, stock: 1 },
  ]

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    new: "bg-red-100 text-red-800",
    in_progress: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
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
                  {stats.map((stat) => (
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
                          <p className="text-sm text-gray-500">{order.customer} · {order.phone}</p>
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
                  <button className="flex items-center gap-2 px-4 py-2 bg-ksk-gold text-ksk-dark text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors">
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
                                <button className="p-1.5 text-gray-400 hover:text-ksk-gold transition-colors"><Eye className="w-4 h-4" /></button>
                                <button className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"><Edit className="w-4 h-4" /></button>
                                <button className="p-1.5 text-gray-400 hover:text-ksk-red transition-colors"><Trash2 className="w-4 h-4" /></button>
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
                            <td className="px-4 py-3 text-gray-600">{o.customer}</td>
                            <td className="px-4 py-3 text-gray-600">{o.phone}</td>
                            <td className="px-4 py-3 font-semibold text-ksk-brown">GH₵ {o.total.toFixed(2)}</td>
                            <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColors[o.status]}`}>{o.status}</span></td>
                            <td className="px-4 py-3 text-gray-500">{o.date}</td>
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
                <h2 className="text-2xl font-bold text-ksk-dark mb-6">Rental Bookings</h2>
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
                        {bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-ksk-dark">{b.id}</td>
                            <td className="px-4 py-3 text-gray-600">{b.customer}<br /><span className="text-xs text-gray-400">{b.phone}</span></td>
                            <td className="px-4 py-3 text-gray-600">{b.vehicle}</td>
                            <td className="px-4 py-3 text-gray-600">{b.date}</td>
                            <td className="px-4 py-3 text-gray-600">{b.days}</td>
                            <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColors[b.status]}`}>{b.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* INQUIRIES TAB */}
            {activeTab === "inquiries" && (
              <div>
                <h2 className="text-2xl font-bold text-ksk-dark mb-6">Construction Inquiries</h2>
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
                            <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColors[i.status]}`}>{i.status.replace("_", " ")}</span></td>
                            <td className="px-4 py-3 text-gray-500">{i.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
