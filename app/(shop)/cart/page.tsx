'use client'

import Link from 'next/link'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { Trash2, Plus, Minus, ChevronRight, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/hooks/use-cart'

export default function CartPage() {
  const { items, isLoading, updateQuantity, removeFromCart } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleUpdateQuantity = async (id: string | undefined, newQuantity: number) => {
    if (!id) return
    setIsUpdating(id)
    try {
      await updateQuantity(id, newQuantity)
    } catch (error) {
      console.error('Failed to update quantity', error)
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRemoveItem = async (id: string | undefined) => {
    if (!id) return
    setIsUpdating(id)
    try {
      await removeFromCart(id)
    } catch (error) {
      console.error('Failed to remove item', error)
    } finally {
      setIsUpdating(null)
    }
  }

  // Calculate live totals
  const subtotal = items.reduce((sum, item) => {
    let price = 0
    if (item.item_type === 'product') {
      price = item.product?.price || 0
    } else {
      const basePrice = item.look?.look_items?.reduce((s: number, li: any) => s + (li.products?.price || 0), 0) || 0
      const discountPct = item.look?.discount || 0
      price = discountPct > 0 
        ? Math.round(basePrice * (1 - discountPct / 100) * 100) / 100 
        : basePrice
    }
    return sum + (price * item.quantity)
  }, 0)

  const shipping = subtotal > 0 ? 15 : 0
  const tax = subtotal > 0 ? Math.round(subtotal * 0.1 * 100) / 100 : 0
  const total = subtotal + shipping + tax

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/50 px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-light tracking-widest text-foreground mb-3">
              SHOPPING CART
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">Cart</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {items.map((item) => {
                    const isProduct = item.item_type === 'product'
                    const name = isProduct 
                      ? item.product?.name || 'Product Item' 
                      : item.look?.title || item.look?.name || 'Curated Look'
                    
                    let price = 0
                    if (isProduct) {
                      price = item.product?.price || 0
                    } else {
                      const basePrice = item.look?.look_items?.reduce((s: number, li: any) => s + (li.products?.price || 0), 0) || 0
                      const discountPct = item.look?.discount || 0
                      price = discountPct > 0 
                        ? Math.round(basePrice * (1 - discountPct / 100) * 100) / 100 
                        : basePrice
                    }

                    const image = isProduct
                      ? item.product?.image_urls?.[0] || '/placeholder.svg?height=150&width=150'
                      : item.look?.image_urls?.[0] || '/placeholder.svg?height=150&width=150'

                    const itemDisabled = isUpdating === item.id

                    return (
                      <div key={item.id || Math.random()} className={`glass-sm p-6 rounded-2xl flex gap-6 transition-opacity ${itemDisabled ? 'opacity-50' : ''}`}>
                        {/* Image */}
                        <div className="w-32 h-32 bg-secondary/50 rounded-xl overflow-hidden shrink-0">
                          <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <p className="text-xs tracking-widest text-accent mb-1 uppercase">{item.item_type}</p>
                            <h3 className="text-lg font-semibold text-foreground mb-1 truncate">{name}</h3>
                            <div className="flex gap-3 text-xs text-muted-foreground mb-2">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                            </div>
                            <p className="text-2xl font-light text-accent">${price}</p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={itemDisabled}
                                className="p-1 hover:bg-secondary/50 rounded transition-colors disabled:cursor-not-allowed"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={itemDisabled}
                                className="p-1 hover:bg-secondary/50 rounded transition-colors disabled:cursor-not-allowed"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={itemDisabled}
                              className="ml-auto p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right flex flex-col justify-between shrink-0">
                          <p className="text-sm text-muted-foreground">Item Total</p>
                          <p className="text-2xl font-light text-foreground">${(price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Continue Shopping */}
                <div className="mt-8">
                  <Link
                    href="/outfits"
                    className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-semibold"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="glass-sm p-8 rounded-2xl sticky top-28 space-y-6">
                  <h2 className="text-2xl font-light tracking-widest text-foreground">ORDER SUMMARY</h2>

                  {/* Promo Code */}
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-3 block">PROMO CODE</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-4 py-2 border border-border/50 rounded-lg bg-transparent text-sm text-foreground"
                      />
                      <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-semibold">
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-3 border-t border-border/50 pt-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-semibold text-foreground">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-semibold text-foreground">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-border/50 pt-6">
                    <div className="flex justify-between mb-6">
                      <span className="text-lg font-semibold text-foreground">Total</span>
                      <span className="text-3xl font-light text-accent">${total.toFixed(2)}</span>
                    </div>

                    <Link
                      href="/checkout"
                      className="w-full block text-center px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300 mb-3"
                    >
                      Proceed to Checkout
                    </Link>

                    <Link
                      href="/outfits"
                      className="w-full block text-center px-8 py-4 border border-accent/30 rounded-lg font-semibold hover:bg-accent/5 transition-all duration-300"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl text-muted-foreground mb-8">Your cart is empty</p>
              <Link
                href="/outfits"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  )
}
