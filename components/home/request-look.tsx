'use client'

import { motion } from "framer-motion"
import { SparkleIcon, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function RequestLook() {
  return (
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
          <SparkleIcon size={28} height="fill" className="text-accent drop-shadow-md" />
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
  )
}
