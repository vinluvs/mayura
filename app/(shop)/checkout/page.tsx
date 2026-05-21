'use client'

import { useState, useEffect } from 'react'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { Lock, ChevronRight, Loader2, Check, Plus, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { useUser } from '@/hooks/use-user'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { toast } from 'sonner'

interface Address {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { session, profile, isLoading: isUserLoading } = useUser()
  const { items, isLoading: isCartLoading, clearCart } = useCart()
  const supabase = createClient()

  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  })
  
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  const savedAddresses: Address[] = Array.isArray(profile?.addresses) 
    ? profile.addresses 
    : []

  // Redirect if not logged in
  useEffect(() => {
    if (!isUserLoading && !session) {
      router.push('/auth/login?redirect=/checkout')
    }
  }, [session, isUserLoading, router])

  // Set default address on load
  useEffect(() => {
    if (savedAddresses.length > 0) {
      const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0]
      setSelectedAddressId(defaultAddr.id)
      setAddress({
        firstName: defaultAddr.firstName || '',
        lastName: defaultAddr.lastName || '',
        email: defaultAddr.email || '',
        phone: defaultAddr.phone || '',
        street: defaultAddr.street || '',
        city: defaultAddr.city || '',
        state: defaultAddr.state || '',
        zip: defaultAddr.zip || '',
        country: defaultAddr.country || 'India',
      })
    } else {
      setSelectedAddressId('new')
      if (session?.user) {
        setAddress(prev => ({
          ...prev,
          email: session.user.email || '',
          phone: profile?.phone || '',
        }))
      }
    }
  }, [profile, session])

  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handleSelectSavedAddress = (addrId: string) => {
    setSelectedAddressId(addrId)
    if (addrId === 'new') {
      setAddress({
        firstName: '',
        lastName: '',
        email: session?.user?.email || '',
        phone: profile?.phone || '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
      })
    } else {
      const selected = savedAddresses.find(a => a.id === addrId)
      if (selected) {
        setAddress({
          firstName: selected.firstName || '',
          lastName: selected.lastName || '',
          email: selected.email || '',
          phone: selected.phone || '',
          street: selected.street || '',
          city: selected.city || '',
          state: selected.state || '',
          zip: selected.zip || '',
          country: selected.country || 'India',
        })
      }
    }
  }

  // Calculate totals
  const subtotal = items.reduce((total, item) => {
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
    return total + (price * item.quantity)
  }, 0)

  const shippingPrice = 15 // Mock standard shipping
  const tax = subtotal * 0.10 // 10% mock tax
  const total = subtotal + shippingPrice + tax

  const handlePayment = async () => {
    if (!session?.user) return

    // Validation
    if (
      !address.firstName ||
      !address.lastName ||
      !address.email ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zip ||
      !address.country
    ) {
      toast.error('Please fill out all shipping address details.')
      return
    }

    setIsProcessing(true)
    try {
      // 1. Create order in Supabase
      const generatedOrderNumber = `MAY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          order_number: generatedOrderNumber,
          total_amount: total,
          status: 'pending',
          payment_status: 'pending',
          shipping_address: address,
          delivery_address: address, // Keep for backward compatibility
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Insert order items
      const orderItems: any[] = []
      for (const item of items) {
        if (item.item_type === 'product') {
          orderItems.push({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.product?.price || 0,
            size: item.size || null,
            color: item.color || null,
          })
        } else if (item.item_type === 'look') {
          const lookItems = item.look?.look_items || []
          const discountPct = item.look?.discount || 0
          for (const lookItem of lookItems) {
            const basePrice = lookItem.products?.price || 0
            const finalPrice = discountPct > 0 
              ? Math.round(basePrice * (1 - discountPct / 100) * 100) / 100
              : basePrice
            orderItems.push({
              order_id: order.id,
              product_id: lookItem.product_id,
              quantity: item.quantity,
              price: finalPrice,
              size: item.size || null,
              color: item.color || null,
            })
          }
        }
      }

      if (orderItems.length > 0) {
        const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
        if (itemsError) throw itemsError
      }

      // 2. Create mock Razorpay order via API
      const response = await fetch('/api/checkout/razorpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total })
      })

      if (!response.ok) throw new Error('Failed to create payment order')

      // 3. Mock Verification Process
      const verifyResponse = await fetch('/api/checkout/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: 'mock_ord_id',
          razorpay_payment_id: 'mock_pay_id',
          razorpay_signature: 'mock_sig'
        })
      })

      if (!verifyResponse.ok) throw new Error('Payment verification failed')

      // 4. Update order to processing
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'processing', payment_status: 'paid' })
        .eq('id', order.id)

      if (updateError) throw updateError

      // 5. Clear cart & redirect
      await clearCart()
      toast.success('Order placed successfully!')
      router.push('/account/dashboard?tab=orders')
      
    } catch (error: any) {
      console.error('Checkout failed:', error)
      toast.error(error.message || 'Checkout failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isUserLoading || isCartLoading) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </LayoutWrapper>
    )
  }

  if (!session) return null

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/50 px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-light tracking-widest text-foreground mb-3">
              CHECKOUT
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">Checkout</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Address Selection & Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Saved Addresses Section */}
              {savedAddresses.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-light tracking-widest text-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent" />
                    SELECT SAVED ADDRESS
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectSavedAddress(addr.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative group flex flex-col justify-between ${
                          selectedAddressId === addr.id
                            ? 'border-accent bg-accent/5 shadow-md shadow-accent/5'
                            : 'border-border/50 bg-secondary/10 hover:bg-secondary/20 hover:border-border/80'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-xs px-2.5 py-1 rounded-full uppercase bg-secondary/80 text-foreground border border-border/30">
                              {addr.name}
                            </span>
                            {selectedAddressId === addr.id && (
                              <span className="w-5 h-5 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-foreground text-sm">
                            {addr.firstName} {addr.lastName}
                          </p>
                          <p className="text-muted-foreground text-xs mt-1">{addr.street}</p>
                          <p className="text-muted-foreground text-xs">
                            {addr.city}, {addr.state} - {addr.zip}
                          </p>
                          <p className="text-muted-foreground text-xs">{addr.country}</p>
                          <p className="text-muted-foreground text-xs mt-2">
                            Phone: {addr.phone}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Use New Address Card */}
                    <div
                      onClick={() => handleSelectSavedAddress('new')}
                      className={`p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[160px] gap-2 ${
                        selectedAddressId === 'new'
                          ? 'border-accent bg-accent/5 text-accent'
                          : 'border-border/60 hover:border-accent/60 hover:bg-accent/5 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Plus className="w-6 h-6" />
                      <span className="font-semibold text-sm">Use a new address</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Address Inputs (shown if new is selected, or if no saved addresses exist) */}
              {selectedAddressId === 'new' ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-light tracking-widest text-foreground">
                    {savedAddresses.length > 0 ? 'ENTER NEW SHIPPING ADDRESS' : 'SHIPPING ADDRESS'}
                  </h2>
                  
                  <div className="glass-sm p-8 rounded-2xl space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={address.firstName}
                        onChange={(e) => handleAddressChange('firstName', e.target.value)}
                        className="px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors w-full"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={address.lastName}
                        onChange={(e) => handleAddressChange('lastName', e.target.value)}
                        className="px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors w-full"
                      />
                    </div>

                    <input
                      type="email"
                      placeholder="Email"
                      value={address.email}
                      onChange={(e) => handleAddressChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                    />

                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={address.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                    />

                    <input
                      type="text"
                      placeholder="Street Address"
                      value={address.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      className="w-full px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors w-full"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={address.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        className="px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={address.zip}
                        onChange={(e) => handleAddressChange('zip', e.target.value)}
                        className="px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors w-full"
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={address.country}
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                        className="px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors w-full"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Selected Address Summary View */
                <div className="space-y-4">
                  <h2 className="text-xl font-light tracking-widest text-foreground">SHIPPING DETAILS</h2>
                  <div className="glass-sm p-8 rounded-2xl border border-accent/20 bg-accent/5">
                    <p className="font-semibold text-foreground text-base">
                      {address.firstName} {address.lastName}
                    </p>
                    <p className="text-muted-foreground text-sm mt-2">{address.street}</p>
                    <p className="text-muted-foreground text-sm">
                      {address.city}, {address.state} - {address.zip}
                    </p>
                    <p className="text-muted-foreground text-sm">{address.country}</p>
                    <div className="mt-4 pt-4 border-t border-border/40 flex flex-col md:flex-row gap-2 md:gap-8">
                      <p className="text-muted-foreground text-xs">
                        <span className="font-semibold text-foreground">Email:</span> {address.email}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        <span className="font-semibold text-foreground">Phone:</span> {address.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Buy Now Button (Below Address Section - visible on Mobile) */}
              <div className="pt-2 block lg:hidden">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || items.length === 0}
                  className="w-full px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Buy Now'
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary Sidebar */}
            <div>
              <div className="glass-sm p-8 rounded-2xl sticky top-28 space-y-6">
                <h2 className="text-2xl font-light tracking-widest text-foreground">ORDER SUMMARY</h2>

                {/* Items */}
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Your cart is empty</p>
                  ) : (
                    items.map((item, index) => {
                      const name = item.item_type === 'product' ? item.product?.name : item.look?.title || item.look?.name
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
                      const image = item.item_type === 'product' ? item.product?.image_urls?.[0] : item.look?.image_urls?.[0]

                      return (
                        <div key={index} className="flex gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                          {image && (
                            <div className="relative w-16 h-20 rounded-md overflow-hidden bg-secondary">
                              <Image src={image} alt={name || 'Item'} fill className="object-cover" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground line-clamp-1">{name}</p>
                            <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                            {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                          </div>
                          <div className="font-semibold text-foreground text-sm">
                            ${(price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Pricing */}
                <div className="space-y-3 border-t border-border/50 pt-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">${shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-border/50 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-3xl font-light text-accent">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Buy Now Button (Sticky Sidebar) */}
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || items.length === 0}
                  className="w-full px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 lg:flex"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Buy Now'
                  )}
                </button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Secure Razorpay checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
