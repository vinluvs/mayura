import Link from 'next/link'
import { Star, Heart, ArrowRight } from 'lucide-react'
import { useState } from 'react'

interface OutfitCardProps {
  id: string | number
  name: string
  price: number
  image: string
  occasion: string
  season?: string
  genderBadge?: string | null
  rating: number
  reviews: number
  isFavorited?: boolean
  onToggleFavorite?: () => void
}

export function OutfitCard({
  id,
  name,
  price,
  image,
  season,
  rating,
  isFavorited = false,
  onToggleFavorite,
}: OutfitCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/outfits/${id}`} className="block mb-8 break-inside-avoid">
      <div
        className="group relative overflow-hidden rounded-2xl border border-border/10 hover:border-accent/40 transition-all duration-700 cursor-pointer gold-shine bg-background"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Full Image Container */}
        <div className="relative w-full overflow-hidden bg-secondary/20">
          <img
            src={image}
            alt={name}
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Absolute Dark Overlay Scrim revealed on hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

          {/* Top Indicators revealed on hover */}
          <div className="absolute top-4 inset-x-4 flex items-start justify-between z-20 pointer-events-none">
            {/* Price Badge */}
            <div className="glass bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 translate-y-[-8px] group-hover:translate-y-0 transition-all duration-500 delay-75">
              <p className="text-sm font-medium tracking-wide text-accent">$ {price}</p>
            </div>

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                onToggleFavorite?.()
              }}
              className="p-2.5 glass-premium border border-white/10 hover:bg-accent hover:border-accent rounded-xl opacity-0 group-hover:opacity-100 translate-y-[-8px] group-hover:translate-y-0 transition-all duration-500 delay-100 pointer-events-auto group/fav"
            >
              <Heart
                className={`w-4 h-4 transition-all duration-500 ${isFavorited ? 'fill-accent text-accent scale-110' : 'text-white group-hover/fav:text-accent-foreground'
                  }`}
              />
            </button>
          </div>

          {/* Bottom Overlay Content block revealed on hover */}
          <div className="absolute bottom-0 inset-x-0 p-4 z-20 flex flex-col justify-end opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 pointer-events-none">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                {season && (
                  <p className="text-[9px] tracking-[0.2em] text-white/80 uppercase font-medium">{season}</p>
                )}
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                <Star className="w-2.5 h-2.5 fill-accent text-accent" />
                <span className="text-[10px] font-bold text-white">{rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Permanent Footer Block below the full image */}
        <div className="p-4 flex items-center justify-between gap-3 border-t border-border/5 bg-background/40 backdrop-blur-xs">
          <h3 className="text-md font-medium text-foreground tracking-wide truncate group-hover:text-accent transition-colors duration-300">
            {name}
          </h3>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-300 shrink-0" />
        </div>
      </div>
    </Link>
  )
}

