'use client'

import Link from 'next/link'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { Trash2, Plus, Minus, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface CartItem {
  id: string
  type: 'outfit' | 'product'
  name: string
  price: number
  quantity: number
  image: string
}

const SAMPLE_CART_ITEMS: CartItem[] = [
  {
    id: '1',
    type: 'outfit',
    name: 'Evening Elegance Outfit',
    price: 299,
    quantity: 1,
    image: '/placeholder.svg?height=150&width=150',
  },
  {
    id: '2',
    type: 'product',
    name: 'Silk Evening Gown',
    price: 189,
    quantity: 2,
    image: '/placeholder.svg?height=150&width=150',
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(SAMPLE_CART_ITEMS)
  const [promoCode, setPromoCode] = useState('')

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      )
    }
  }

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
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
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="glass-sm p-6 rounded-2xl flex gap-6">
                      {/* Image */}
                      <div className="w-32 h-32 bg-secondary/50 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs tracking-widest text-accent mb-1 uppercase">{item.type}</p>
                          <h3 className="text-lg font-semibold text-foreground mb-2">{item.name}</h3>
                          <p className="text-2xl font-light text-accent">${item.price}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-secondary/50 rounded transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-12 text-center border border-border/50 rounded-lg py-1 bg-transparent"
                            />
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-secondary/50 rounded transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right flex flex-col justify-between">
                        <p className="text-sm text-muted-foreground">Item Total</p>
                        <p className="text-2xl font-light text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
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
                        className="flex-1 px-4 py-2 border border-border/50 rounded-lg bg-transparent text-sm"
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

                    <button className="w-full px-8 py-4 border border-accent/30 rounded-lg font-semibold hover:bg-accent/5 transition-all duration-300">
                      Continue Shopping
                    </button>
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
