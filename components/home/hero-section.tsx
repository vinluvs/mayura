'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from "framer-motion"

function PeacockLogo() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
      {/* Outer Glow Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 rounded-full border border-accent/20 shadow-[0_0_50px_rgba(212,175,55,0.1)]"
      />

      {/* Animated Inner Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 rounded-full border-[0.5px] border-accent/10 border-dashed"
      />

      <motion.img
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        src="/only mayura logo.png"
        alt="Mayura Logo"
        className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
      />
    </div>
  )
}

function DiamondIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2L4 12L12 22L20 12L12 2Z" />
    </svg>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,var(--secondary)_0%,var(--background)_100%)] p-10">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        <PeacockLogo />

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-5xl md:text-7xl font-serif tracking-[0.4em] text-foreground flex items-center justify-center gap-2 md:gap-4">
            M<span>A</span>YUR<span>A</span>
          </h1>
        </motion.div>

        {/* Divider with Diamond */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "200px", opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="h-[0.5px] flex-1 bg-accent/40" />
          <DiamondIcon className="w-2.5 h-2.5 gold-accent" />
          <div className="h-[0.5px] flex-1 bg-accent/40" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-xs md:text-sm tracking-[0.5em] text-muted-foreground uppercase font-light mb-12"
        >
          Wear Your Form
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
        >
          <Link
            href="/outfits"
            className="btn-gold px-10 py-4 rounded-sm tracking-widest uppercase flex items-center justify-center gap-3 group"
          >
            Explore Collections
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="px-10 py-4 rounded-sm tracking-widest uppercase flex items-center justify-center border border-accent/20 hover:bg-accent/5 transition-colors"
          >
            Our Philosophy
          </Link>
        </motion.div>

        {/* Scroll Indicator (Provided Code) */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">Scroll</span>
          <div className="w-px h-12 bg-linear-to-b from-accent/40 to-transparent"></div>
        </motion.div>
        {/* Stats Section (Provided Code) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="grid grid-cols-3 gap-12 w-full max-w-3xl mx-auto pt-8 border-t border-accent/10"
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

    </section>
  )
}
