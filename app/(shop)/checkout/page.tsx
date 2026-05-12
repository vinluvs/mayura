'use client'

import { useState, useEffect } from 'react'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { Lock, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { useUser } from '@/hooks/use-user'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Address {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
  country: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { session, isLoading: isUserLoading } = useUser()
  const { items, isLoading: isCartLoading, clearCart } = useCart()
  const supabase = createClient()

  const [currentStep, setCurrentStep] = useState(1)
  const [address, setAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    if (!isUserLoading && !session) {
      router.push('/auth/login?redirect=/checkout')
    }
  }, [session, isUserLoading, router])

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }))
  }

  // Calculate totals
  const subtotal = items.reduce((total, item) => {
    const price = item.item_type === 'product' 
      ? item.product?.price || 0 
      : item.look?.price || item.look?.pricing?.total || item.look?.look_items?.reduce((s: number, li: any) => s + (li.products?.price || 0), 0) || 0
    return total + (price * item.quantity)
  }, 0)

  const shippingPrice = 15 // Mock standard shipping
  const tax = subtotal * 0.10 // 10% mock tax
  const total = subtotal + shippingPrice + tax

  const handlePayment = async () => {
    if (!session?.user) return

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
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Insert order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        look_id: item.look_id,
        quantity: item.quantity,
        price_at_time: item.item_type === 'product' ? item.product?.price : (item.look?.price || item.look?.pricing?.total || item.look?.look_items?.reduce((s: number, li: any) => s + (li.products?.price || 0), 0) || 0),
        size: item.size,
        color: item.color
      }))

      await supabase.from('order_items').insert(orderItems)

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
      await supabase
        .from('orders')
        .update({ status: 'processing', payment_status: 'paid' })
        .eq('id', order.id)

      // 5. Clear cart & show success
      await clearCart()
      setOrderNumber(generatedOrderNumber)
      setIsSuccess(true)
      
    } catch (error) {
      console.error('Checkout failed:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isUserLoading || isCartLoading) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </LayoutWrapper>
    )
  }

  if (!session) return null // Redirect handles this

  if (isSuccess) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <div className="glass-sm p-12 rounded-3xl max-w-lg w-full text-center space-y-6">
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-light tracking-widest text-foreground">ORDER CONFIRMED</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order <span className="text-foreground font-semibold">#{orderNumber}</span> has been received and is now being processed.
            </p>
            <Link 
              href="/account/dashboard"
              className="inline-block w-full px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              View Order Status
            </Link>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

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
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {/* Step Indicator */}
              <div className="flex gap-4 mb-12">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-2 rounded-full transition-colors ${
                      step <= currentStep ? 'bg-accent' : 'bg-border'
                    }`}
                  />
                ))}
              </div>

              {/* Step 1: Shipping Address */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-light tracking-widest text-foreground">SHIPPING ADDRESS</h2>
                  
                  <div className="glass-sm p-8 rounded-2xl space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={address.firstName}
                        onChange={(e) => handleAddressChange('firstName', e.target.value)}
                        className="px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={address.lastName}
                        onChange={(e) => handleAddressChange('lastName', e.target.value)}
                        className="px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <input
                      type="email"
                      placeholder="Email"
                      value={address.email}
                      onChange={(e) => handleAddressChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground"
                    />

                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={address.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground"
                    />

                    <input
                      type="text"
                      placeholder="Street Address"
                      value={address.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      className="w-full px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={address.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        className="px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={address.zip}
                        onChange={(e) => handleAddressChange('zip', e.target.value)}
                        className="px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={address.country}
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                        className="px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Continue to Shipping
                  </button>
                </div>
              )}

              {/* Step 2: Shipping Method */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-light tracking-widest text-foreground">SHIPPING METHOD</h2>
                  
                  <div className="glass-sm p-8 rounded-2xl space-y-4">
                    {[
                      { id: 'standard', name: 'Standard Shipping', time: '5-7 business days', price: 15 },
                      { id: 'express', name: 'Express Shipping', time: '2-3 business days', price: 30 },
                      { id: 'overnight', name: 'Overnight Shipping', time: 'Next business day', price: 50 },
                    ].map((method) => (
                      <label key={method.id} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                        <input type="radio" name="shipping" defaultChecked={method.id === 'standard'} className="w-5 h-5" />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.time}</p>
                        </div>
                        <p className="text-lg font-semibold text-foreground">${method.price}</p>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 px-8 py-4 border border-accent/30 rounded-lg font-semibold hover:bg-accent/5 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-light tracking-widest text-foreground flex items-center gap-3">
                    <Lock className="w-6 h-6" />
                    PAYMENT
                  </h2>
                  
                  <div className="glass-sm p-8 rounded-2xl space-y-4">
                    <label className="flex items-center gap-4 p-4 border border-accent/30 rounded-lg cursor-pointer bg-accent/5">
                      <input
                        type="radio"
                        name="payment"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5"
                      />
                      <div>
                        <p className="font-semibold text-foreground">Razorpay</p>
                        <p className="text-sm text-muted-foreground">Pay securely with cards, wallets, or UPI</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 border border-border/50 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={paymentMethod === 'bank'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5"
                      />
                      <div>
                        <p className="font-semibold text-foreground">Bank Transfer</p>
                        <p className="text-sm text-muted-foreground">Direct bank transfer (Coming soon)</p>
                      </div>
                    </label>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      Your payment information is secure and encrypted. By proceeding, you agree to our terms and privacy policy.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 px-8 py-4 border border-accent/30 rounded-lg font-semibold hover:bg-accent/5 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={isProcessing || items.length === 0}
                      className="flex-1 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Complete Purchase'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
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
                      const price = item.item_type === 'product' ? item.product?.price : (item.look?.price || item.look?.pricing?.total || item.look?.look_items?.reduce((s: number, li: any) => s + (li.products?.price || 0), 0) || 0)
                      const image = item.item_type === 'product' ? item.product?.image_url || item.product?.images?.[0] : item.look?.model_image_url

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

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
