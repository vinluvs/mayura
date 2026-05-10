'use client'

import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'
import { motion } from "framer-motion"

const featuredOutfits = [
  {
    id: 1,
    name: 'Evening Elegance',
    price: 299,
    occasion: 'Formal',
    image: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?q=80&w=1000',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Casual Chic',
    price: 199,
    occasion: 'Casual',
    image: 'https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?q=80&w=1000',
    rating: 4.6,
  },
  {
    id: 3,
    name: 'Party Glamour',
    price: 349,
    occasion: 'Party',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1000',
    rating: 4.9,
  },
  {
    id: 4,
    name: 'Weekend Vibe',
    price: 179,
    occasion: 'Casual',
    image: 'https://images.unsplash.com/photo-1610030469983-98e55ec2999e?q=80&w=1000',
    rating: 4.7,
  },
]

export function FeaturedCollections() {
  return (
    <section className="py-32 px-4 bg-linear-to-b from-background via-secondary/5 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-xs uppercase tracking-[0.4em] text-accent font-bold mb-4 block"
            >
              Curated Selection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-light tracking-tight text-foreground leading-tight"
            >
              FEATURED <span className="font-serif italic">Collections</span>
            </motion.h2>
          </div>
          <Link
            href="/outfits"
            className="group flex items-center gap-3 text-sm uppercase tracking-widest font-bold text-muted-foreground hover:text-accent transition-colors"
          >
            View All Masterpieces
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredOutfits.map((outfit, index) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/outfits/${outfit.id}`}>
                <div className="group relative glass-sm overflow-hidden h-full flex flex-col hover:shadow-premium transition-all duration-500 cursor-pointer gold-shine">
                  {/* Image */}
                  <div className="relative aspect-3/4 overflow-hidden bg-secondary/20">
                    <img
                      src={outfit.image}
                      alt={outfit.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                    {/* Floating Price */}
                    <div className="absolute top-4 right-4 glass-premium px-3 py-1 text-sm font-medium gold-accent">
                      ${outfit.price}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 bg-background/40 backdrop-blur-md flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-[10px] tracking-[0.2em] text-accent uppercase font-bold">{outfit.occasion}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-accent text-accent" />
                        <span className="text-[10px] font-bold text-muted-foreground">{outfit.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-light text-foreground mb-4 group-hover:text-accent transition-colors">
                      {outfit.name}
                    </h3>

                    <div className="mt-auto pt-4 border-t border-accent/10 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-accent transition-colors">
                      Details
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
