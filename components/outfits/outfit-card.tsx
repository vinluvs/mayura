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
    <Link href={`/outfits/${id}`} className="block mb-6 break-inside-avoid">
      <div
        className="group glass-sm overflow-hidden hover:shadow-premium transition-all duration-500 cursor-pointer border border-border/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-secondary/30">
          <img
            src={image}
            alt={name}
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all duration-500"></div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              onToggleFavorite?.()
            }}
            className="absolute top-4 right-4 p-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-accent hover:border-accent transition-all duration-300 z-10"
          >
            <Heart
              className={`w-4 h-4 ${isFavorited ? 'fill-white text-white' : 'text-white'}`}
            />
          </button>

          {/* Badges Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {occasion && (
              <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <p className="text-[10px] tracking-widest text-white uppercase font-medium">{occasion}</p>
              </div>
            )}
            {season && (
              <div className="bg-accent/80 backdrop-blur-md px-3 py-1 rounded-full">
                <p className="text-[10px] tracking-widest text-accent-foreground font-bold uppercase">{season}</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 bg-linear-to-b from-transparent to-black/5">

          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] tracking-[0.2em] text-accent uppercase font-medium">{occasion}</p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-accent text-accent" />
              <span className="text-[10px] font-medium text-muted-foreground">{rating.toFixed(1)}</span>
            </div>
          </div>
          
          <h3 className="text-base font-medium text-foreground mb-3 group-hover:text-accent transition-colors leading-tight">
            {name}
          </h3>

          <p className="text-xl font-light text-foreground/90 tracking-tight">
            <span className="text-accent font-medium mr-1">$</span>
            {price.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  )
}

