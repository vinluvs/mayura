'use client'

import Link from 'next/link'
import { Heart, Trash2 } from 'lucide-react'

interface FavoritesTabProps {
  favoriteLooks: any[]
  onRemoveFavorite: (id: string) => void
}

export function FavoritesTab({
  favoriteLooks,
  onRemoveFavorite,
}: FavoritesTabProps) {
  return (
    <div>
      <h2 className="text-2xl font-light tracking-widest text-foreground mb-6 uppercase">
        Saved Outfits
      </h2>

      {favoriteLooks.length === 0 ? (
        <div className="glass-sm p-12 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
            <Heart className="w-8 h-8" />
          </div>
          <p className="text-muted-foreground text-sm">
            You have no saved outfits yet.
          </p>
          <Link
            href="/looks"
            className="inline-block px-6 py-2.5 bg-accent text-accent-foreground rounded-lg font-semibold text-xs hover:shadow-md transition-all"
          >
            Explore Outfits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteLooks.map((outfit) => (
            <div
              key={outfit.id}
              className="group glass-sm overflow-hidden rounded-2xl hover:shadow-premium transition-all flex flex-col relative"
            >
              {/* Unfavorite button */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onRemoveFavorite(outfit.id)
                }}
                className="absolute top-3 right-3 z-10 w-9 h-9 bg-background/80 backdrop-blur-xs text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-md"
                title="Remove from favorites"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <Link href={`/outfits/${outfit.id}`} className="flex-1 flex flex-col cursor-pointer">
                <div className="relative h-64 overflow-hidden bg-secondary/50">
                  <img
                    src={outfit.image_urls?.[0] || '/placeholder.svg'}
                    alt={outfit.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                    {outfit.name}
                  </h3>
                  <p className="text-lg font-semibold text-accent mt-1">
                    ${Number(outfit.price).toFixed(2)}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
