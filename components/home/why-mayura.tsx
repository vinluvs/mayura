'use client'

import { motion } from "framer-motion"
import { Sparkle, ShieldCheck, Paintbrush } from "lucide-react"

const features = [
  {
    icon: <Paintbrush className="w-6 h-6" />,
    title: 'Curated Elegance',
    description: 'Each ensemble is a masterpiece, hand-selected to ensure perfect harmony in every stitch and shade.'
  },
  {
    icon: <Sparkle className="w-6 h-6" />,
    title: 'Bespoke Experience',
    description: 'Beyond off-the-shelf. We offer personalized consultations to tailor our collections to your unique silhouette.'
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Artisan Quality',
    description: 'Heritage craftsmanship meets modern durability. We source only the finest fabrics from global textile houses.'
  }
]

export function WhyMayura() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-light tracking-[0.2em] text-foreground mb-6"
          >
            THE <span className="gold-accent">MAYURA</span> STANDARD
          </motion.h2>
          <div className="w-24 h-px bg-accent/30 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="glass-premium p-10 text-center hover:border-accent/40 transition-colors duration-500 group"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8 text-accent group-hover:scale-110 transition-transform duration-500">
                {item.icon}
              </div>
              <h3 className="text-2xl font-light text-foreground mb-6 tracking-wide uppercase">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-light">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
