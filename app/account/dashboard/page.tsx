'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { Settings, Package, Heart, LogOut, Shield, User, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/hooks/use-user'
import { useOrders } from '@/hooks/use-orders'
import { useFavorites } from '@/hooks/use-favorites'
import { useLooks } from '@/hooks/use-looks'

// Import modular tab components
import { OverviewTab } from '@/components/account/overview-tab'
import { OrdersTab } from '@/components/account/orders-tab'
import { FavoritesTab } from '@/components/account/favorites-tab'
import { SettingsTab } from '@/components/account/settings-tab'

type TabType = 'overview' | 'orders' | 'favorites' | 'settings'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') as TabType | null

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (tabParam && ['overview', 'orders', 'favorites', 'settings'].includes(tabParam)) {
      return tabParam
    }
    return 'overview'
  })

  // Sync activeTab when the query parameter changes
  useEffect(() => {
    if (tabParam && ['overview', 'orders', 'favorites', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const supabase = createClient()

  // SWR hooks
  const { profile, session, isLoading: isUserLoading, mutate: mutateUser } = useUser()
  const { orders, isLoading: isOrdersLoading, mutate: mutateOrders } = useOrders()
  const { favoriteIds, isLoading: isFavoritesLoading, toggleFavorite } = useFavorites()
  const { looks, isLoading: isLooksLoading } = useLooks()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      router.push('/')
    }
  }

  // Filter outfits that are in the user's favorites
  const favoriteLooks = useMemo(() => {
    return looks.filter((look) => favoriteIds.includes(look.id))
  }, [looks, favoriteIds])

  const handleRemoveFavorite = async (lookId: string) => {
    await toggleFavorite(lookId)
  }

  // Re-fetch all data on profile updates
  const handleUpdate = () => {
    mutateUser()
    mutateOrders()
  }

  if (isUserLoading || !session) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-accent" />
          <p className="text-muted-foreground text-sm tracking-wider uppercase font-semibold animate-pulse">
            Loading profile...
          </p>
        </div>
      </LayoutWrapper>
    )
  }

  const userDisplayName =
    profile?.full_name || session.user.email?.split('@')[0] || 'User'

  const isDataLoading = isOrdersLoading || isFavoritesLoading || isLooksLoading

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/50 px-4 py-16 bg-secondary/15 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-accent/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <h1 className="text-5xl md:text-6xl font-light tracking-widest text-foreground mb-3 uppercase">
              MY ACCOUNT
            </h1>
            <p className="text-muted-foreground text-sm tracking-wider uppercase">
              Welcome back, <span className="text-accent font-semibold">{userDisplayName}</span>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="glass-sm p-6 rounded-2xl sticky top-28 space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                    activeTab === 'overview'
                      ? 'bg-accent text-accent-foreground shadow-md shadow-accent/20'
                      : 'hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-semibold text-sm">Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                    activeTab === 'orders'
                      ? 'bg-accent text-accent-foreground shadow-md shadow-accent/20'
                      : 'hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-semibold text-sm">Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                    activeTab === 'favorites'
                      ? 'bg-accent text-accent-foreground shadow-md shadow-accent/20'
                      : 'hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-semibold text-sm">Favorites</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                    activeTab === 'settings'
                      ? 'bg-accent text-accent-foreground shadow-md shadow-accent/20'
                      : 'hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-semibold text-sm">Settings</span>
                </button>

                {profile?.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="w-full text-left px-4 py-3 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-all flex items-center gap-3 mt-2"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold text-sm">Admin Dashboard</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-500/10 transition-all flex items-center gap-3 mt-4 border-t border-border/50 pt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-semibold text-sm">Logout</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 min-h-[400px] relative">
              {isDataLoading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-xs flex items-center justify-center z-50 rounded-2xl">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              )}

              {/* Render Tab Contents */}
              {activeTab === 'overview' && (
                <OverviewTab
                  profile={profile}
                  session={session}
                  orders={orders}
                  favoriteIds={favoriteIds}
                  onUpdate={handleUpdate}
                  onSetActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'orders' && <OrdersTab orders={orders} />}

              {activeTab === 'favorites' && (
                <FavoritesTab
                  favoriteLooks={favoriteLooks}
                  onRemoveFavorite={handleRemoveFavorite}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsTab
                  profile={profile}
                  session={session}
                  onUpdate={handleUpdate}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default function AccountDashboard() {
  return (
    <Suspense fallback={
      <LayoutWrapper>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-accent" />
          <p className="text-muted-foreground text-sm tracking-wider uppercase font-semibold animate-pulse">
            Loading dashboard...
          </p>
        </div>
      </LayoutWrapper>
    }>
      <DashboardContent />
    </Suspense>
  )
}
