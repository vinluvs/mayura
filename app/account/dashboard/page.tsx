'use client'

import { useState } from 'react'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { Settings, Package, Heart, LogOut, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const SAMPLE_ORDERS = [
  {
    id: 'ORD-001',
    date: '2024-05-02',
    total: 299,
    status: 'Delivered',
    items: 'Evening Elegance',
  },
  {
    id: 'ORD-002',
    date: '2024-04-28',
    total: 199,
    status: 'Processing',
    items: 'Casual Chic',
  },
  {
    id: 'ORD-003',
    date: '2024-04-15',
    total: 349,
    status: 'Delivered',
    items: 'Party Glamour',
  },
]

const SAMPLE_FAVORITES = [
  { id: '1', name: 'Evening Elegance', price: 299, image: '/placeholder.svg?height=200&width=200' },
  { id: '2', name: 'Casual Chic', price: 199, image: '/placeholder.svg?height=200&width=200' },
  { id: '3', name: 'Weekend Vibe', price: 179, image: '/placeholder.svg?height=200&width=200' },
]

type TabType = 'overview' | 'orders' | 'favorites' | 'settings'

export default function AccountDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [user, setUser] = useState({ name: 'Sarah Johnson', email: 'sarah@example.com' })
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
    <LayoutWrapper>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/50 px-4 py-12 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-light tracking-widest text-foreground mb-3">
              MY ACCOUNT
            </h1>
            <p className="text-muted-foreground">Welcome back, {user.name}!</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="glass-sm p-6 rounded-2xl sticky top-28 space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-secondary/50 text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-current rounded" />
                    <span className="font-semibold">Overview</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-secondary/50 text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5" />
                    <span className="font-semibold">Orders</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'favorites'
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-secondary/50 text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5" />
                    <span className="font-semibold">Favorites</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-secondary/50 text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5" />
                    <span className="font-semibold">Settings</span>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors mt-4 border-t border-border/50 pt-4"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5" />
                    <span className="font-semibold">Logout</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Profile Card */}
                  <div className="glass-sm p-8 rounded-2xl">
                    <h2 className="text-2xl font-light tracking-widest text-foreground mb-6">PROFILE</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">NAME</p>
                        <p className="text-lg font-semibold text-foreground">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">EMAIL</p>
                        <p className="text-lg font-semibold text-foreground">{user.email}</p>
                      </div>
                      <button className="mt-6 px-6 py-2 border border-accent/30 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-semibold">
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="glass-sm p-6 rounded-2xl text-center">
                      <p className="text-3xl font-light text-accent mb-2">3</p>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </div>
                    <div className="glass-sm p-6 rounded-2xl text-center">
                      <p className="text-3xl font-light text-accent mb-2">3</p>
                      <p className="text-sm text-muted-foreground">Saved Items</p>
                    </div>
                    <div className="glass-sm p-6 rounded-2xl text-center">
                      <p className="text-3xl font-light text-accent mb-2">2</p>
                      <p className="text-sm text-muted-foreground">Addresses</p>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="glass-sm p-8 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-light tracking-widest text-foreground">RECENT ORDERS</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-accent hover:underline text-sm font-semibold">
                        View All
                      </button>
                    </div>
                    <div className="space-y-3">
                      {SAMPLE_ORDERS.slice(0, 2).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                          <div>
                            <p className="font-semibold text-foreground">{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.items}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">${order.total}</p>
                            <p className={`text-sm ${order.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'}`}>
                              {order.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="glass-sm p-8 rounded-2xl">
                  <h2 className="text-2xl font-light tracking-widest text-foreground mb-6">ORDER HISTORY</h2>
                  <div className="space-y-4">
                    {SAMPLE_ORDERS.map((order) => (
                      <Link key={order.id} href={`/account/orders/${order.id}`}>
                        <div className="flex items-center justify-between p-6 border border-border/50 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer">
                          <div>
                            <p className="font-semibold text-foreground text-lg mb-2">{order.id}</p>
                            <p className="text-muted-foreground">{order.items}</p>
                            <p className="text-sm text-muted-foreground mt-2">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-light text-accent mb-2">${order.total}</p>
                            <p className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
                              order.status === 'Delivered'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                            }`}>
                              {order.status}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground ml-4" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-2xl font-light tracking-widest text-foreground mb-6">SAVED OUTFITS</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SAMPLE_FAVORITES.map((outfit) => (
                      <Link key={outfit.id} href={`/outfits/${outfit.id}`}>
                        <div className="group glass-sm overflow-hidden rounded-2xl hover:shadow-premium transition-all cursor-pointer">
                          <div className="relative h-60 overflow-hidden bg-secondary/50">
                            <img
                              src={outfit.image}
                              alt={outfit.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-foreground mb-2">{outfit.name}</h3>
                            <p className="text-2xl font-light text-accent">${outfit.price}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="glass-sm p-8 rounded-2xl space-y-6">
                  <div>
                    <h2 className="text-2xl font-light tracking-widest text-foreground mb-6">ACCOUNT SETTINGS</h2>
                    
                    <div className="space-y-6">
                      {/* Password */}
                      <div className="border-b border-border/50 pb-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">PASSWORD</h3>
                        <button className="px-6 py-2 border border-accent/30 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-semibold">
                          Change Password
                        </button>
                      </div>

                      {/* Addresses */}
                      <div className="border-b border-border/50 pb-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">DELIVERY ADDRESSES</h3>
                        <Link href="/account/settings#addresses" className="text-accent hover:underline font-semibold">
                          Manage Addresses
                        </Link>
                      </div>

                      {/* Notifications */}
                      <div className="border-b border-border/50 pb-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">NOTIFICATIONS</h3>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5" />
                            <span className="text-muted-foreground">Email notifications for order updates</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5" />
                            <span className="text-muted-foreground">Marketing emails</span>
                          </label>
                        </div>
                      </div>

                      {/* Delete Account */}
                      <div>
                        <h3 className="text-lg font-semibold text-red-600 mb-4">DANGER ZONE</h3>
                        <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
