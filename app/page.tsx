'use client'

import Link from 'next/link'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { ArrowRight, Star } from 'lucide-react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkle as SparkleIcon } from "@phosphor-icons/react"

export default function Home() {
  const featuredOutfits = [
    {
      id: 1,
      name: 'Evening Elegance',
      price: 299,
      occasion: 'Formal',
      image: '/placeholder.svg?height=400&width=300',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Casual Chic',
      price: 199,
      occasion: 'Casual',
      image: '/placeholder.svg?height=400&width=300',
      rating: 4.6,
    },
    {
      id: 3,
      name: 'Party Glamour',
      price: 349,
      occasion: 'Party',
      image: '/placeholder.svg?height=400&width=300',
      rating: 4.9,
    },
    {
      id: 4,
      name: 'Weekend Vibe',
      price: 179,
      occasion: 'Casual',
      image: '/placeholder.svg?height=400&width=300',
      rating: 4.7,
    },
  ]

  return (
    <LayoutWrapper>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-linear-to-br from-background via-background to-secondary/30">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-5 bg-accent blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full opacity-5 bg-accent blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img src="/mayura-logo.png" alt="Mayura" className="h-24 w-auto" />
          </div>

          <h1 className="text-5xl md:text-7xl font-light tracking-widest text-foreground mb-6">
            WEAR YOUR FORM
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-light tracking-wide">
            Discover curated fashion outfits designed for every occasion. Shop complete looks or handpick your favorites.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/outfits"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:gap-3"
            >
              Shop Outfits
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 border border-accent/30 rounded-lg font-semibold hover:bg-accent/5 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>

          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">500+</p>
              <p>Curated Outfits</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">50K+</p>
              <p>Happy Customers</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">100%</p>
              <p>Premium Quality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Outfits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-widest text-foreground mb-4">
              FEATURED COLLECTIONS
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore our latest curated outfits for every style and occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredOutfits.map((outfit) => (
              <Link key={outfit.id} href={`/outfits/${outfit.id}`}>
                <div className="group glass-sm overflow-hidden h-full flex flex-col hover:shadow-premium transition-all duration-300 cursor-pointer">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-secondary/50">
                    <img
                      src={outfit.image}
                      alt={outfit.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col p-4">
                    <p className="text-xs tracking-widest text-accent mb-2">{outfit.occasion}</p>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{outfit.name}</h3>

                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(outfit.rating) ? 'fill-accent' : 'fill-muted'}`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">{outfit.rating}</span>
                    </div>

                    <p className="text-2xl font-light text-accent">${outfit.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Mayura Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light tracking-widest text-foreground text-center mb-16">
            WHY MAYURA
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Curated Collections',
                description: 'Each outfit is carefully designed and curated by our fashion experts to ensure perfect style harmony.'
              },
              {
                title: 'Complete Flexibility',
                description: 'Add entire outfits to your cart or mix and match individual pieces. Shop your way, your style.'
              },
              {
                title: 'Premium Quality',
                description: 'We partner with top fashion brands to bring you high-quality, sustainable, and timeless pieces.'
              }
            ].map((item, i) => (
              <div key={i} className="glass-sm p-8 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4 tracking-wide">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Look Section */}
      <section className="py-28 px-6 relative overflow-hidden bg-linear-to-b from-background to-background/95">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l2 28 28 2-28 2-2 28-2-28-28-2 28-2z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto relative"
        >
          {/* Decorative Sparkle */}
          <div className="absolute -top-14 left-1/2 -translate-x-1/2">
            <SparkleIcon size={28} weight="fill" className="text-accent drop-shadow-md" />
          </div>

          {/* Heading */}
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-5 block font-light"
            >
              Curated Elegance
            </motion.span>

            <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-6 text-foreground">
              <span className="block">Discover your</span>
              <span className="block font-serif italic">perfect look</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              Share your vision with our style experts. We’ll craft a bespoke ensemble that reflects your individuality with timeless sophistication.
            </p>
          </div>

          {/* Input + Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="flex flex-col sm:flex-row gap-4 p-1 max-w-2xl mx-auto">
              <Input
                placeholder="Describe your dream outfit..."
                className="h-14 bg-background/70 backdrop-blur border border-foreground/20 focus:border-accent/50 rounded-none px-6 text-base placeholder:text-muted-foreground/60 font-light"
              />
              <Button
                className="h-14 px-10 rounded-none bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-sm uppercase tracking-widest font-medium shadow-md border-none"
              >
                Request Look
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-5 tracking-wide">
              Complimentary styling consultation • Response within 24 hours
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-16 mt-16"
          >
            {[
              { number: "10K+", label: "Looks Curated" },
              { number: "4.9", label: "Client Rating" },
              { number: "98%", label: "Satisfaction" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-serif italic text-foreground">{stat.number}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-light">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

    </LayoutWrapper>
  )
}
