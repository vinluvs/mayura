'use client'

import { useState } from 'react'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { BarChart3, Package, ShoppingBag, Users, LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const ADMIN_STATS = {
  totalRevenue: 12450,
  totalOrders: 248,
  totalCustomers: 156,
  totalProducts: 342,
}

const RECENT_ORDERS = [
  { id: 'ORD-001', customer: 'Sarah Johnson', amount: 299, status: 'Delivered' },
  { id: 'ORD-002', customer: 'Emma Wilson', amount: 199, status: 'Processing' },
  { id: 'ORD-003', customer: 'Jessica Lee', amount: 349, status: 'Shipped' },
  { id: 'ORD-004', customer: 'Michael Brown', amount: 179, status: 'Pending' },
]

const TOP_OUTFITS = [
  { id: 1, name: 'Evening Elegance', sales: 45, revenue: 13455 },
  { id: 2, name: 'Party Glamour', sales: 38, revenue: 13262 },
  { id: 3, name: 'Casual Chic', sales: 32, revenue: 6368 },
  { id: 4, name: 'Weekend Vibe', sales: 28, revenue: 5012 },
]

type TabType = 'overview' | 'products' | 'outfits' | 'orders' | 'customers' | 'analytics'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    if (!supabase) {
      router.push('/')
      return
    }
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.warn('[v0] Error signing out:', error)
    }
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 border-r border-border/50 glass fixed h-screen left-0 top-0 z-40`}>
          <div className="p-6 flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-light tracking-widest">MAYURA ADMIN</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-secondary/50 rounded transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <nav className="mt-8 space-y-2 px-4">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'outfits', label: 'Outfits', icon: ShoppingBag },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            ].map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-secondary/50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-semibold">{item.label}</span>}
                </button>
              )
            })}
          </nav>

          <div className="absolute bottom-6 left-4 right-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-semibold">Logout</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-5xl font-light tracking-widest text-foreground mb-2">ADMIN DASHBOARD</h1>
                  <p className="text-muted-foreground">Welcome to Mayura Admin Panel</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Revenue', value: `$${ADMIN_STATS.totalRevenue.toLocaleString()}`, icon: '💰' },
                    { label: 'Total Orders', value: ADMIN_STATS.totalOrders, icon: '📦' },
                    { label: 'Total Customers', value: ADMIN_STATS.totalCustomers, icon: '👥' },
                    { label: 'Total Products', value: ADMIN_STATS.totalProducts, icon: '🛍️' },
                  ].map((metric, i) => (
                    <div key={i} className="glass-sm p-6 rounded-2xl">
                      <div className="text-3xl mb-3">{metric.icon}</div>
                      <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                      <p className="text-3xl font-light text-accent">{metric.value}</p>
                    </div>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Sales Chart Placeholder */}
                  <div className="glass-sm p-8 rounded-2xl">
                    <h2 className="text-xl font-light tracking-widest text-foreground mb-6">MONTHLY SALES</h2>
                    <div className="h-64 bg-secondary/50 rounded-lg flex items-center justify-center text-muted-foreground">
                      [Sales chart will be here]
                    </div>
                  </div>

                  {/* Orders Chart Placeholder */}
                  <div className="glass-sm p-8 rounded-2xl">
                    <h2 className="text-xl font-light tracking-widest text-foreground mb-6">ORDERS BY STATUS</h2>
                    <div className="h-64 bg-secondary/50 rounded-lg flex items-center justify-center text-muted-foreground">
                      [Orders chart will be here]
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="glass-sm p-8 rounded-2xl">
                  <h2 className="text-xl font-light tracking-widest text-foreground mb-6">RECENT ORDERS</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-3 px-4 text-muted-foreground">Order ID</th>
                          <th className="text-left py-3 px-4 text-muted-foreground">Customer</th>
                          <th className="text-left py-3 px-4 text-muted-foreground">Amount</th>
                          <th className="text-left py-3 px-4 text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {RECENT_ORDERS.map((order) => (
                          <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                            <td className="py-3 px-4 font-semibold text-foreground">{order.id}</td>
                            <td className="py-3 px-4 text-foreground">{order.customer}</td>
                            <td className="py-3 px-4 text-accent font-semibold">${order.amount}</td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'Delivered'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Outfits */}
                <div className="glass-sm p-8 rounded-2xl">
                  <h2 className="text-xl font-light tracking-widest text-foreground mb-6">TOP OUTFITS</h2>
                  <div className="space-y-4">
                    {TOP_OUTFITS.map((outfit) => (
                      <div key={outfit.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                        <div>
                          <p className="font-semibold text-foreground">{outfit.name}</p>
                          <p className="text-sm text-muted-foreground">{outfit.sales} sales</p>
                        </div>
                        <p className="text-xl font-light text-accent">${outfit.revenue.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-4xl font-light tracking-widest text-foreground">PRODUCTS</h1>
                  <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all">
                    Add Product
                  </button>
                </div>
                <div className="glass-sm p-8 rounded-2xl">
                  <p className="text-muted-foreground">Product management interface coming soon...</p>
                </div>
              </div>
            )}

            {/* Outfits Tab */}
            {activeTab === 'outfits' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-4xl font-light tracking-widest text-foreground">OUTFITS</h1>
                  <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all">
                    Create Outfit
                  </button>
                </div>
                <div className="glass-sm p-8 rounded-2xl">
                  <p className="text-muted-foreground">Outfit management interface coming soon...</p>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h1 className="text-4xl font-light tracking-widest text-foreground mb-8">ORDERS</h1>
                <div className="glass-sm p-8 rounded-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-4 px-4 text-muted-foreground">Order ID</th>
                          <th className="text-left py-4 px-4 text-muted-foreground">Customer</th>
                          <th className="text-left py-4 px-4 text-muted-foreground">Amount</th>
                          <th className="text-left py-4 px-4 text-muted-foreground">Status</th>
                          <th className="text-left py-4 px-4 text-muted-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {RECENT_ORDERS.map((order) => (
                          <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30">
                            <td className="py-4 px-4 font-semibold">{order.id}</td>
                            <td className="py-4 px-4">{order.customer}</td>
                            <td className="py-4 px-4 text-accent">${order.amount}</td>
                            <td className="py-4 px-4">
                              <span className="px-3 py-1 rounded-full text-xs bg-accent/10 text-accent">
                                {order.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <button className="text-accent hover:underline text-sm font-semibold">View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
              <div>
                <h1 className="text-4xl font-light tracking-widest text-foreground mb-8">CUSTOMERS</h1>
                <div className="glass-sm p-8 rounded-2xl">
                  <p className="text-muted-foreground">Customer management interface coming soon...</p>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h1 className="text-4xl font-light tracking-widest text-foreground mb-8">ANALYTICS</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-sm p-8 rounded-2xl h-96 flex items-center justify-center text-muted-foreground">
                    [Advanced analytics coming soon...]
                  </div>
                  <div className="glass-sm p-8 rounded-2xl h-96 flex items-center justify-center text-muted-foreground">
                    [More analytics...]
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
