'use client'

import { useState } from 'react'
import { ProfileDialog } from './profile-dialog'
import { OrderDetailsSheet } from './order-details-sheet'
import { Edit2, ShieldAlert } from 'lucide-react'

interface OverviewTabProps {
  profile: any
  session: any
  orders: any[]
  favoriteIds: string[]
  onUpdate: () => void
  onSetActiveTab: (tab: 'overview' | 'orders' | 'favorites' | 'settings') => void
}

export function OverviewTab({
  profile,
  session,
  orders,
  favoriteIds,
  onUpdate,
  onSetActiveTab,
}: OverviewTabProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const userDisplayName =
    profile?.full_name || session?.user?.email?.split('@')[0] || 'User'
  const userEmail = session?.user?.email || 'No email provided'
  const userPhone = profile?.phone || 'No phone number provided'
  
  const addressesCount = Array.isArray(profile?.addresses)
    ? profile.addresses.length
    : 0

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="glass-sm p-8 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full transition-all group-hover:scale-110" />
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-light tracking-widest text-foreground">
            PROFILE SUMMARY
          </h2>
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 text-xs bg-accent/10 hover:bg-accent/20 text-accent px-4 py-2.5 rounded-xl font-semibold transition-all hover:scale-[1.03] duration-200 cursor-pointer shadow-xs"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1">
              NAME
            </p>
            <p className="text-base font-semibold text-foreground truncate">
              {userDisplayName}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1">
              EMAIL
            </p>
            <p className="text-base font-semibold text-foreground truncate">
              {userEmail}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1">
              PHONE
            </p>
            <p className="text-base font-semibold text-foreground truncate">
              {userPhone}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onSetActiveTab('orders')}
          className="glass-sm p-6 rounded-2xl text-center hover:bg-secondary/40 transition-colors cursor-pointer group"
        >
          <p className="text-4xl font-light text-accent mb-2 group-hover:scale-105 transition-transform">
            {orders.length}
          </p>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Total Orders
          </p>
        </button>
        <button
          onClick={() => onSetActiveTab('favorites')}
          className="glass-sm p-6 rounded-2xl text-center hover:bg-secondary/40 transition-colors cursor-pointer group"
        >
          <p className="text-4xl font-light text-accent mb-2 group-hover:scale-105 transition-transform">
            {favoriteIds.length}
          </p>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Saved Outfits
          </p>
        </button>
        <button
          onClick={() => onSetActiveTab('settings')}
          className="glass-sm p-6 rounded-2xl text-center hover:bg-secondary/40 transition-colors cursor-pointer group"
        >
          <p className="text-4xl font-light text-accent mb-2 group-hover:scale-105 transition-transform">
            {addressesCount}
          </p>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Saved Addresses
          </p>
        </button>
      </div>

      {/* Recent Orders */}
      <div className="glass-sm p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-light tracking-widest text-foreground">
            RECENT ORDERS
          </h3>
          {orders.length > 0 && (
            <button
              onClick={() => onSetActiveTab('orders')}
              className="text-accent hover:underline text-xs font-semibold tracking-wider uppercase"
            >
              View All
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm space-y-2">
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 2).map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="flex items-center justify-between p-4 bg-secondary/20 hover:bg-secondary/40 border border-border/30 rounded-xl cursor-pointer transition-colors"
              >
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {order.order_number}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground text-sm">
                    ${Number(order.total_amount).toFixed(2)}
                  </p>
                  <p
                    className={`text-xs font-medium mt-0.5 ${
                      order.status === 'delivered'
                        ? 'text-green-600'
                        : 'text-blue-600'
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile edit modal */}
      <ProfileDialog
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        session={session}
        onUpdate={onUpdate}
      />

      {/* Order details sheet */}
      <OrderDetailsSheet
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  )
}
