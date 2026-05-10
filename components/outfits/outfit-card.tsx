import Link from 'next/link'
import { Star, Heart } from 'lucide-react'
import { useState } from 'react'

interface OutfitCardProps {
  id: string | number
  name: string
  price: number
  image: string
  occasion: string
  season?: string
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
  occasion,
  season,
  rating,
  reviews,
  isFavorited = false,
  onToggleFavorite,
}: OutfitCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/outfits/${id}`} className="block mb-8 break-inside-avoid">
      <div
        className="group relative glass-sm overflow-hidden hover:shadow-premium transition-all duration-700 cursor-pointer border border-accent/10 hover:border-accent/40 gold-shine"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-secondary/20">
          <img
            src={image}
            alt={name}
            className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60"></div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              onToggleFavorite?.()
            }}
            className="absolute top-4 right-4 p-3 glass-premium border border-white/10 hover:bg-accent hover:border-accent transition-all duration-500 z-10 group/fav"
          >
            <Heart
              className={`w-4 h-4 transition-all duration-500 ${isFavorited ? 'fill-accent text-accent scale-110' : 'text-white group-hover/fav:text-accent-foreground'}`}
            />
          </button>

          {/* Price Badge */}
          <div className="absolute bottom-4 right-4 glass-premium px-4 py-1.5 border border-white/10">
            <p className="text-sm font-bold gold-accent group-hover:gold-text-gradient transition-all duration-500">${price}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-background/40 backdrop-blur-md">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <p className="text-[10px] tracking-[0.3em] text-accent uppercase font-bold">{occasion}</p>
              {season && (
                <p className="text-[9px] tracking-[0.2em] text-muted-foreground uppercase">{season}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-accent/5 rounded-full border border-accent/10">
              <Star className="w-2.5 h-2.5 fill-accent text-accent" />
              <span className="text-[10px] font-bold text-accent">{rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="text-lg font-light text-foreground mb-4 group-hover:text-accent transition-colors leading-tight tracking-wide">
            {name}
          </h3>

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 group-hover:text-accent transition-colors">
            View Ensembles
            <div className="w-4 h-px bg-accent/30 group-hover:w-8 transition-all"></div>
          </div>
        </div>
      </div>
    </Link>
  )
}

