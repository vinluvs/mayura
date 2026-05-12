'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { OutfitCard } from '@/components/outfits/outfit-card'
import { Filter, X, SlidersHorizontal, Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLooks } from '@/hooks/use-looks'
import { useFavorites } from '@/hooks/use-favorites'

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
  
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [sortBy, setSortBy] = useState('featured')

  // Real data hooks
  const { looks, isLoading, error } = useLooks()
  const { favoriteIds, toggleFavorite } = useFavorites()

  // Dynamically extract categories from available looks
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>()
    looks.forEach(look => {
      if (look.categories?.name) {
        uniqueCategories.add(look.categories.name)
      }
    })
    return ['All', ...Array.from(uniqueCategories)]
  }, [looks])

  const filteredOutfits = useMemo(() => {
    let result = looks.filter((outfit) => {
      const categoryMatch = selectedCategory === 'All' || outfit.categories?.name === selectedCategory
      const priceRange = PRICE_RANGES[selectedPriceRange]
      const priceMatch = outfit.price >= priceRange.min && outfit.price <= priceRange.max
      return categoryMatch && priceMatch
    })

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break
      case 'price-high': result.sort((a, b) => b.price - a.price); break
      case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break
      // 'featured' naturally defaults to whatever order they are fetched, but we can prioritize featured flag
      case 'featured': result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break
      default: break
    }

    return result
  }, [looks, selectedCategory, selectedPriceRange, sortBy])

  const hasActiveFilters =
    selectedCategory !== 'All' || selectedPriceRange !== 0

  const resetFilters = () => {
    setSelectedCategory('All')
    setSelectedPriceRange(0)
  }

  if (error) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen pt-32 px-6 flex justify-center text-center">
          <p className="text-red-500">Failed to load outfits. Please try again later.</p>
        </div>
      </LayoutWrapper>
    )
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
                  <span>{isLoading ? 'Loading...' : `${filteredOutfits.length} styles found`}</span>
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
                    label="Category"
                    options={categories}
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
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
            {isLoading ? (
              <div className="flex justify-center items-center py-32">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              </div>
            ) : filteredOutfits.length > 0 ? (
              <motion.div
                layout
                className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5"
              >
                {filteredOutfits.map((outfit) => (
                  <OutfitCard
                    key={outfit.id}
                    id={outfit.id}
                    name={outfit.title || outfit.name}
                    price={outfit.price}
                    occasion={outfit.categories?.name || 'Outfit'}
                    season={outfit.categories?.name || ''}
                    image={outfit.model_image_url}
                    rating={5.0} // Fallback until ratings table is used for aggregation
                    reviews={0}
                    isFavorited={favoriteIds.includes(outfit.id)}
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

