'use client'

import { useState } from 'react'
import { OrderDetailsSheet } from './order-details-sheet'
import { ChevronRight, ShoppingBag } from 'lucide-react'

interface OrdersTabProps {
  orders: any[]
}

export function OrdersTab({ orders }: OrdersTabProps) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  return (
    <div className="glass-sm p-8 rounded-2xl">
      <h2 className="text-2xl font-light tracking-widest text-foreground mb-6 uppercase">
        Order History
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <p className="text-muted-foreground text-sm">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="flex items-center justify-between p-6 border border-border/50 rounded-xl hover:bg-secondary/30 transition-all cursor-pointer group"
            >
              <div className="space-y-1">
                <p className="font-semibold text-foreground text-base group-hover:text-accent transition-colors">
                  {order.order_number}
                </p>
                <p className="text-xs text-muted-foreground">
                  Placed on {new Date(order.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">
                    ${Number(order.total_amount).toFixed(2)}
                  </p>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block mt-1 capitalize ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200/20'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200/20'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-1 duration-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order details sheet */}
      <OrderDetailsSheet
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  )
}
