'use client'

import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { Heart, Zap, Star } from 'lucide-react'

export default function AboutPage() {
  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="border-b border-border/50 px-4 py-20 bg-gradient-to-br from-background to-secondary/30">
          <div className="max-w-4xl mx-auto text-center">
            <img src="/mayura-logo.png" alt="Mayura" className="h-20 w-auto mx-auto mb-8" />
            <h1 className="text-6xl md:text-7xl font-light tracking-widest text-foreground mb-6">
              ABOUT MAYURA
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Elevating fashion through curated outfit collections that celebrate individuality and style.
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="glass-sm p-12 rounded-2xl mb-16">
            <h2 className="text-4xl font-light tracking-widest text-foreground mb-6">OUR STORY</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Mayura was founded on the belief that fashion should be accessible, inspiring, and transformative. We recognized that many people struggle with putting together cohesive outfits that truly reflect their personality and lifestyle.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Named after the graceful peacock—a symbol of elegance, beauty, and pride—Mayura brings together carefully curated clothing pieces into complete, wearable outfits. We do the styling work for you, so you can focus on expressing your unique self.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you&apos;re preparing for a formal event, a casual day out, or a night on the town, our collections are designed to make you feel confident, comfortable, and beautiful.
            </p>
          </div>

          {/* Values */}
          <h2 className="text-4xl font-light tracking-widest text-foreground mb-12 text-center">OUR VALUES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Heart,
                title: 'Curated Curation',
                description: 'Every outfit is thoughtfully selected and styled by our fashion experts to ensure perfect harmony and versatility.',
              },
              {
                icon: Zap,
                title: 'Quality First',
                description: 'We partner with premium brands to bring you high-quality, sustainable, and timeless pieces that last.',
              },
              {
                icon: Star,
                title: 'Customer Centric',
                description: 'Your satisfaction is our priority. We listen to your feedback and continuously improve our collections.',
              },
            ].map((value, i) => {
              const Icon = value.icon
              return (
                <div key={i} className="glass-sm p-8 rounded-2xl text-center">
                  <Icon className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              )
            })}
          </div>

          {/* Why Choose Us */}
          <div className="glass-sm p-12 rounded-2xl">
            <h2 className="text-4xl font-light tracking-widest text-foreground mb-8">WHY CHOOSE MAYURA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                'Complete outfits curated by fashion experts',
                'Mix and match—buy full looks or individual pieces',
                'Sustainable and ethically sourced fashion',
                'Free shipping on orders over $100',
                'Easy returns and exchanges',
                'Personal styling consultations available',
              ].map((reason, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-accent-foreground font-semibold">
                    ✓
                  </div>
                  <p className="text-foreground">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
