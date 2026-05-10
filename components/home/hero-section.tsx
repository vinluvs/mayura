'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-background">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-20 bg-accent/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-20 bg-accent/20 blur-[120px]"></div>

        {/* Animated Gold Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-accent/5 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/10 rounded-full"
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-12 flex justify-center"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full group-hover:bg-accent/40 transition-all duration-700"></div>
            <img src="/mayura-logo.png" alt="Mayura" className="relative h-32 md:h-40 w-auto drop-shadow-2xl" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-light tracking-[0.2em] text-foreground mb-8"
        >
          WEAR YOUR <span className="gold-accent">FORM</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light tracking-widest leading-relaxed"
        >
          Where timeless elegance meets modern sophistication. <br className="hidden md:block" />
          Discover curated ensembles crafted for your most significant moments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
        >
          <Link
            href="/outfits"
            className="btn-gold px-10 py-5 rounded-full font-medium tracking-widest uppercase text-sm flex items-center justify-center gap-3 group"
          >
            Explore Collections
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="btn-premium px-10 py-5 rounded-full font-medium tracking-widest uppercase text-sm flex items-center justify-center border-accent/20 hover:bg-accent/5"
          >
            Our Philosophy
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="grid grid-cols-3 gap-12 max-w-3xl mx-auto pt-8 border-t border-accent/10"
        >
          {[
            { label: "Curated Styles", val: "500+" },
            { label: "Bespoke Fits", val: "100%" },
            { label: "Global Presence", val: "24/7" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl md:text-3xl font-serif italic gold-accent mb-1">{stat.val}</p>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">Scroll</span>
        <div className="w-px h-12 bg-linear-to-b from-accent/40 to-transparent"></div>
      </motion.div>
    </section>
  )
}
