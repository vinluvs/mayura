'use client'

import { useState } from 'react'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { Lock, ChevronRight } from 'lucide-react'
import Link from 'next/link'

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

const CART_SUMMARY = {
  subtotal: 488,
  shipping: 15,
  tax: 49.8,
  total: 552.8,
}

export default function CheckoutPage() {
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

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Razorpay integration will be implemented here
    console.log('Processing payment with:', { address, paymentMethod })
    setTimeout(() => {
      setIsProcessing(false)
      // Redirect to order confirmation
    }, 2000)
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

                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
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
                      disabled={isProcessing}
                      className="flex-1 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Complete Purchase'}
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
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div className="flex justify-between text-sm pb-3 border-b border-border/50">
                    <span className="text-muted-foreground">Evening Elegance (1x)</span>
                    <span className="font-semibold text-foreground">$299</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Silk Evening Gown (2x)</span>
                    <span className="font-semibold text-foreground">$378</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-3 border-t border-border/50 pt-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${CART_SUMMARY.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">${CART_SUMMARY.shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-semibold">${CART_SUMMARY.tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-border/50 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-3xl font-light text-accent">${CART_SUMMARY.total.toFixed(2)}</span>
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
