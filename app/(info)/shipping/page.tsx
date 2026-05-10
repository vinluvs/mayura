'use client'

import { LayoutWrapper } from '@/components/layout/layout-wrapper'

export default function ShippingPage() {
  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/50 px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-light tracking-widest text-foreground mb-6">
              SHIPPING POLICY
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="space-y-8">
            {/* Shipping Options */}
            <div className="glass-sm p-8 rounded-2xl">
              <h2 className="text-3xl font-light tracking-widest text-foreground mb-6">SHIPPING OPTIONS</h2>
              <div className="space-y-6">
                {[
                  {
                    name: 'Standard Shipping',
                    time: '5-7 business days',
                    cost: '$15.00',
                    description: 'Perfect for planned purchases. Delivery within 5-7 business days.',
                  },
                  {
                    name: 'Express Shipping',
                    time: '2-3 business days',
                    cost: '$30.00',
                    description: 'Faster delivery for urgent orders. Arrives within 2-3 business days.',
                  },
                  {
                    name: 'Overnight Shipping',
                    time: 'Next business day',
                    cost: '$50.00',
                    description: 'For rush orders. Delivery guaranteed by next business day.',
                  },
                ].map((option, i) => (
                  <div key={i} className="border-l-4 border-accent pl-6 py-2">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{option.name}</h3>
                        <p className="text-muted-foreground text-sm">{option.time}</p>
                      </div>
                      <p className="text-2xl font-light text-accent">{option.cost}</p>
                    </div>
                    <p className="text-muted-foreground">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Processing Time */}
            <div className="glass-sm p-8 rounded-2xl">
              <h2 className="text-3xl font-light tracking-widest text-foreground mb-6">PROCESSING TIME</h2>
              <p className="text-muted-foreground mb-4">
                Most orders are processed and shipped within 1-2 business days. However, during peak seasons (holidays, sales events), processing may take up to 5 business days.
              </p>
              <p className="text-muted-foreground">
                You will receive a confirmation email with tracking information once your order ships.
              </p>
            </div>

            {/* Delivery Areas */}
            <div className="glass-sm p-8 rounded-2xl">
              <h2 className="text-3xl font-light tracking-widest text-foreground mb-6">DELIVERY AREAS</h2>
              <p className="text-muted-foreground mb-4">
                We currently ship to all 50 U.S. states and territories. For deliveries to Alaska, Hawaii, and U.S. territories, additional charges may apply.
              </p>
              <p className="text-muted-foreground">
                We are expanding our international shipping soon. Please check back for updates on availability to your country.
              </p>
            </div>

            {/* Order Tracking */}
            <div className="glass-sm p-8 rounded-2xl">
              <h2 className="text-3xl font-light tracking-widest text-foreground mb-6">ORDER TRACKING</h2>
              <p className="text-muted-foreground mb-4">
                Once your order ships, you&apos;ll receive a tracking number via email. You can use this number to track your package in real-time through our carrier&apos;s website.
              </p>
              <p className="text-muted-foreground">
                You can also track your order anytime by logging into your Mayura account and viewing your order details.
              </p>
            </div>

            {/* Shipping Issues */}
            <div className="glass-sm p-8 rounded-2xl">
              <h2 className="text-3xl font-light tracking-widest text-foreground mb-6">SHIPPING ISSUES</h2>
              <h3 className="text-lg font-semibold text-foreground mb-3">Lost or Damaged Packages</h3>
              <p className="text-muted-foreground mb-6">
                If your package arrives damaged or goes missing, please contact our customer service team immediately at hello@mayura.com. We&apos;ll work with our shipping carrier to resolve the issue and provide a replacement or refund.
              </p>
              <h3 className="text-lg font-semibold text-foreground mb-3">Late Deliveries</h3>
              <p className="text-muted-foreground">
                While we strive for on-time delivery, occasional delays may occur due to weather or carrier issues. If your delivery is significantly delayed, please reach out to us for assistance.
              </p>
            </div>

            {/* Returns Shipping */}
            <div className="glass-sm p-8 rounded-2xl">
              <h2 className="text-3xl font-light tracking-widest text-foreground mb-6">RETURNS SHIPPING</h2>
              <p className="text-muted-foreground mb-4">
                Return shipping is free for orders over $100. For orders under $100, a return shipping fee of $10 will be deducted from your refund. We recommend using tracked shipping for all returns.
              </p>
              <p className="text-muted-foreground">
                Please allow 7-10 business days for your return to be processed after we receive it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
