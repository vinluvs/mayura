'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { OutfitCard } from '@/components/outfits/outfit-card'
import { Filter, X, SlidersHorizontal } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Sample data - will be replaced with Supabase queries
const SAMPLE_OUTFITS = [
  {
    id: '1',
    name: 'Royal Silk Collection',
    price: 599,
    occasion: 'Formal',
    season: 'Summer',
    image: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?q=80&w=1000',
    rating: 4.9,
    reviews: 124,
  },
  {
    id: '2',
    name: 'Emerald Velvet Gown',
    price: 899,
    occasion: 'Party',
    season: 'Winter',
    image: 'https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?q=80&w=1000',
    rating: 5.0,
    reviews: 86,
  },
  {
    id: '3',
    name: 'Ivory Day Saree',
    price: 299,
    occasion: 'Casual',
    season: 'Spring',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1000',
    rating: 4.7,
    reviews: 54,
  },
  {
    id: '4',
    name: 'Midnight Gold Lehenga',
    price: 1299,
    occasion: 'Formal',
    season: 'Winter',
    image: 'https://images.unsplash.com/photo-1599032909756-5dee8c9583d1?q=80&w=1000',
    rating: 4.9,
    reviews: 210,
  },
  {
    id: '5',
    name: 'Summer Petal Anarkali',
    price: 450,
    occasion: 'Casual',
    season: 'Summer',
    image: 'https://images.unsplash.com/photo-1610030469983-98e55ec2999e?q=80&w=1000',
    rating: 4.8,
    reviews: 92,
  },
  {
    id: '6',
    name: 'Ruby Evening Wrap',
    price: 350,
    occasion: 'Party',
    season: 'Autumn',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000',
    rating: 4.6,
    reviews: 43,
  },
  {
    id: '7',
    name: 'Cerulean Dream Drape',
    price: 680,
    occasion: 'Formal',
    season: 'Spring',
    image: 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?q=80&w=1000',
    rating: 4.9,
    reviews: 115,
  },
  {
    id: '8',
    name: 'Tuscan Sun Kurta',
    price: 180,
    occasion: 'Casual',
    season: 'Summer',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000',
    rating: 4.5,
    reviews: 67,
  },
]

const OCCASIONS = ['All', 'Casual', 'Formal', 'Party']
const SEASONS = ['All', 'Spring', 'Summer', 'Autumn', 'Winter']
const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $300', min: 0, max: 300 },
  { label: '$300 - $600', min: 300, max: 600 },
  { label: '$600 - $1000', min: 600, max: 1000 },
  { label: 'Above $1000', min: 1000, max: Infinity },
]

function FilterGroup({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: string[]
  selected: string
  onSelect: (v: string) => void
}) {
  return (
    <div className="mb-8">
      <p className="text-[10px] tracking-[0.3em] text-accent uppercase font-bold mb-3">{label}</p>
      <div className="space-y-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
              selected === opt
                ? 'bg-accent text-accent-foreground font-medium shadow-sm'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function OutfitsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Default sidebar open on desktop, closed on mobile
  useEffect(() => {
    const onResize = () => setSidebarOpen(window.innerWidth >= 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const [selectedOccasion, setSelectedOccasion] = useState('All')
  const [selectedSeason, setSelectedSeason] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [sortBy, setSortBy] = useState('featured')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const filteredOutfits = useMemo(() => {
    let result = SAMPLE_OUTFITS.filter((outfit) => {
      const occasionMatch = selectedOccasion === 'All' || outfit.occasion === selectedOccasion
      const seasonMatch = selectedSeason === 'All' || outfit.season === selectedSeason
      const priceRange = PRICE_RANGES[selectedPriceRange]
      const priceMatch = outfit.price >= priceRange.min && outfit.price <= priceRange.max
      return occasionMatch && seasonMatch && priceMatch
    })

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break
      case 'price-high': result.sort((a, b) => b.price - a.price); break
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      default: break
    }

    return result
  }, [selectedOccasion, selectedSeason, selectedPriceRange, sortBy])

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) newFavorites.delete(id)
    else newFavorites.add(id)
    setFavorites(newFavorites)
  }

  const hasActiveFilters =
    selectedOccasion !== 'All' || selectedSeason !== 'All' || selectedPriceRange !== 0

  const resetFilters = () => {
    setSelectedOccasion('All')
    setSelectedSeason('All')
    setSelectedPriceRange(0)
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen pt-24 bg-background">

        {/* Page Header */}
        <div className="px-6 lg:px-10 mb-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-5 w-full"
          >
            {/* Title row */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-6xl font-light text-foreground tracking-tight mb-2">
                  Curated <span className="text-accent italic font-serif">Outfits</span>
                </h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{filteredOutfits.length} styles found</span>
                </div>
              </div>

              {/* Sort Dropdown — Shadcn Select */}
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <span className="text-[10px] tracking-[0.2em] text-accent uppercase font-semibold whitespace-nowrap hidden sm:inline">
                  Sort
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] rounded-xl border-border/30 bg-card/50 backdrop-blur-md text-sm font-medium shadow-sm hover:border-accent/40 transition-all duration-300 focus:ring-accent/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/20 bg-card/80 backdrop-blur-xl shadow-xl">
                    <SelectGroup>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Top Rated</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter toggle bar */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm transition-all duration-200 ${
                  sidebarOpen
                    ? 'border-accent/50 text-accent bg-accent/5'
                    : 'border-border/30 text-muted-foreground hover:text-accent hover:border-accent/30'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{sidebarOpen ? 'Hide Filters' : 'Filters'}</span>
                {hasActiveFilters && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                )}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Body: sidebar + grid side by side */}
        <div className="flex items-start px-6 lg:px-10 gap-8">

          {/* Collapsible Filter Sidebar */}
          <AnimatePresence initial={false}>
            {sidebarOpen && (
              <motion.aside
                key="filter-sidebar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="flex-none overflow-hidden shrink-0"
              >
                <div className="sticky top-28 w-[260px] rounded-2xl border border-border/20 bg-card/40 backdrop-blur-xl p-6">
                  {/* Sidebar header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center">
                        <Filter className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-sm font-light tracking-[0.2em] uppercase text-foreground">
                        Refine
                      </span>
                    </div>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="text-xs text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Clear
                      </button>
                    )}
                  </div>

                  <div className="h-px bg-border/30 mb-6" />

                  <FilterGroup
                    label="Occasion"
                    options={OCCASIONS}
                    selected={selectedOccasion}
                    onSelect={setSelectedOccasion}
                  />
                  <FilterGroup
                    label="Season"
                    options={SEASONS}
                    selected={selectedSeason}
                    onSelect={setSelectedSeason}
                  />

                  {/* Price Range */}
                  <div>
                    <p className="text-[10px] tracking-[0.3em] text-accent uppercase font-bold mb-3">
                      Price Range
                    </p>
                    <div className="space-y-1">
                      {PRICE_RANGES.map((range, index) => (
                        <button
                          key={range.label}
                          onClick={() => setSelectedPriceRange(index)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            selectedPriceRange === index
                              ? 'bg-accent text-accent-foreground font-medium shadow-sm'
                              : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Masonry Grid */}
          <div className="flex-1 min-w-0">
            {filteredOutfits.length > 0 ? (
              <motion.div
                layout
                className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5"
              >
                {filteredOutfits.map((outfit) => (
                  <OutfitCard
                    key={outfit.id}
                    {...outfit}
                    isFavorited={favorites.has(outfit.id)}
                    onToggleFavorite={() => toggleFavorite(outfit.id)}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 glass rounded-3xl border border-dashed border-border/30">
                <div className="w-14 h-14 bg-secondary/30 rounded-full flex items-center justify-center mb-5">
                  <X className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-lg text-muted-foreground font-light mb-6">
                  No styles found matching your filters.
                </p>
                <button onClick={resetFilters} className="btn-premium text-sm">
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Bottom padding */}
        <div className="h-24" />
      </div>
    </LayoutWrapper>
  )
}
