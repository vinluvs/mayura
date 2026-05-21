'use client'

import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Package, MapPin, Calendar, CreditCard } from 'lucide-react'
import Image from 'next/image'

interface OrderDetailsSheetProps {
  isOpen: boolean
  onClose: () => void
  order: any
}

export function OrderDetailsSheet({
  isOpen,
  onClose,
  order,
}: OrderDetailsSheetProps) {
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!order?.id || !isOpen) return

      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('order_items')
          .select(`
            *,
            product:products (
              id,
              name,
              image_urls,
              price
            )
          `)
          .eq('order_id', order.id)

        if (error) throw error
        setItems(data || [])
      } catch (err) {
        console.error('Error fetching order items:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderItems()
  }, [order?.id, isOpen, supabase])

  if (!order) return null

  // Support both shipping_address and delivery_address
  const address = order.shipping_address || order.delivery_address || {}
  const dateFormatted = new Date(order.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="border-b border-border/50 pb-4">
          <SheetTitle className="text-xl font-light tracking-widest uppercase">
            Order Details
          </SheetTitle>
          <SheetDescription className="text-xs">
            Order #{order.order_number}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : (
          <div className="space-y-6 py-6">
            {/* Meta Info */}
            <div className="space-y-3 bg-secondary/10 p-4 rounded-xl border border-border/30">
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Calendar className="w-4 h-4 text-accent" />
                <span>Placed on {dateFormatted}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <CreditCard className="w-4 h-4 text-accent" />
                <span>
                  Payment Status:{' '}
                  <span className="font-semibold capitalize text-foreground">
                    {order.payment_status}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Package className="w-4 h-4 text-accent" />
                <span>
                  Delivery Status:{' '}
                  <span
                    className={`font-semibold capitalize ${
                      order.status === 'delivered'
                        ? 'text-green-600'
                        : 'text-blue-600'
                    }`}
                  >
                    {order.status}
                  </span>
                </span>
              </div>
            </div>

            {/* Items Ordered */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm tracking-wider text-muted-foreground uppercase">
                ITEMS ORDERED
              </h3>
              <div className="space-y-3">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No items found for this order.
                  </p>
                ) : (
                  items.map((item) => {
                    const name = item.product?.name || 'Fashion Item'
                    const image = item.product?.image_urls?.[0] || '/placeholder.svg'
                    const price = item.price || item.product?.price || 0

                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-3 bg-secondary/5 rounded-xl border border-border/30"
                      >
                        <div className="relative w-16 h-20 bg-secondary rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Qty: {item.quantity}
                          </p>
                          {(item.size || item.color) && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && ' | '}
                              {item.color && `Color: ${item.color}`}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-foreground">
                            ${(price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              ${price} each
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-3 border-t border-border/50 pt-4">
              <h3 className="font-semibold text-sm tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                SHIPPING ADDRESS
              </h3>
              {address.firstName ? (
                <div className="text-xs text-muted-foreground space-y-1 bg-secondary/5 p-4 rounded-xl border border-border/30">
                  <p className="font-semibold text-foreground">
                    {address.firstName} {address.lastName}
                  </p>
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} - {address.zip}
                  </p>
                  <p>{address.country}</p>
                  <p className="pt-1.5 border-t border-border/30 mt-1.5 text-foreground">
                    Phone: {address.phone}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Address details not available.
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="border-t border-border/50 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtotal</span>
                <span>${(order.total_amount - 15 - (order.total_amount - 15) * (0.10 / 1.10)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Shipping</span>
                <span>$15.00</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Estimated Tax (10%)</span>
                <span>${((order.total_amount - 15) * (0.10 / 1.10)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-border/30 pt-2 font-semibold">
                <span className="text-sm">Total Paid</span>
                <span className="text-lg text-accent">
                  ${Number(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
