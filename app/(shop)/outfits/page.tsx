'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { OutfitCard } from '@/components/outfits/outfit-card'
import { Filter, X, SlidersHorizontal, Loader2, Sparkles } from 'lucide-react'
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
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1 h-3 rounded-full bg-accent transition-all duration-500 shrink-0" />
        <p className="text-[11px] tracking-[0.25em] text-foreground font-semibold uppercase">{label}</p>
      </div>
      <div className="space-y-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs tracking-wide transition-all duration-300 flex items-center justify-between ${
              selected === opt
                ? 'bg-foreground text-background font-medium shadow-md scale-[1.02]'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
            }`}
          >
            <span className="truncate">{opt}</span>
            {selected === opt && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 shadow-xs" />
            )}
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
    const onResize = () => setSidebarOpen(window.innerWidth >= 1024)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [selectedGender, setSelectedGender] = useState('All')
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

      // Gen Z adaptive gender filter: Include Unisex looks inside Male/Female selections for high flexibility
      let genderMatch = true
      if (selectedGender !== 'All') {
        if (selectedGender === 'Male') {
          genderMatch = outfit.gender === 'Male' || outfit.gender === 'Unisex'
        } else if (selectedGender === 'Female') {
          genderMatch = outfit.gender === 'Female' || outfit.gender === 'Unisex'
        } else {
          genderMatch = outfit.gender === selectedGender
        }
      }

      return categoryMatch && priceMatch && genderMatch
    })

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break
      case 'price-high': result.sort((a, b) => b.price - a.price); break
      case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break
      case 'featured': result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break
      default: break
    }

    return result
  }, [looks, selectedCategory, selectedPriceRange, selectedGender, sortBy])

  const hasActiveFilters =
    selectedCategory !== 'All' || selectedPriceRange !== 0 || selectedGender !== 'All'

  const resetFilters = () => {
    setSelectedCategory('All')
    setSelectedPriceRange(0)
    setSelectedGender('All')
  }

  // Superior Gen Z Metallic Premium Aesthetics dynamically updated on chip toggles
  // Tailored with high-contrast, deeply rich jewel/metallic tones for impeccable text readability
  const themeConfig = useMemo(() => {
    switch (selectedGender) {
      case 'Male':
        return {
          accent: '#1d4ed8', // Lustrous Cobalt Blue / Deep Royal Sapphire (Outstanding AAA readability & richness)
          bgGlow: 'rgba(29, 78, 216, 0.12)',
          gradientText: 'from-[#1d4ed8] via-[#2563eb] to-[#60a5fa]',
          badgeBg: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
          themeLabel: 'Cobalt Chrome',
        }
      case 'Female':
        return {
          accent: '#be123c', // Lustrous Crimson / Velvet Ruby (Premium contrast & depth)
          bgGlow: 'rgba(190, 18, 60, 0.12)',
          gradientText: 'from-[#be123c] via-[#f43f5e] to-[#ff0844]',
          badgeBg: 'linear-gradient(135deg, #be123c 0%, #ff0844 100%)',
          themeLabel: 'Lustrous Chrome',
        }
      case 'Unisex':
        return {
          accent: '#6b21a8', // Deep Amethyst / Metallic Plum
          bgGlow: 'rgba(107, 33, 168, 0.12)',
          gradientText: 'from-[#6b21a8] via-[#9333ea] to-[#c084fc]',
          badgeBg: 'linear-gradient(135deg, #6b21a8 0%, #a855f7 100%)',
          themeLabel: 'Hyper-Aesthetic',
        }
      default:
        return {
          accent: '#966b2b', // Rich Antique Bronze / Deep Metallic Gold
          bgGlow: 'rgba(150, 107, 43, 0.1)',
          gradientText: 'from-[#966b2b] via-[#d4af37] to-[#f9d423]',
          badgeBg: 'linear-gradient(135deg, #966b2b 0%, #d4af37 100%)',
          themeLabel: 'Pure Iridescent',
        }
    }
  }, [selectedGender])

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
      <div
        className="min-h-screen pt-24 transition-colors duration-1000 relative overflow-hidden"
        style={{
          '--accent': themeConfig.accent,
          backgroundColor: 'var(--background)'
        } as React.CSSProperties}
      >
        {/* Dynamic ambient metallic glow gradient background */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] rounded-full blur-[150px] pointer-events-none transition-all duration-1000 -z-10 opacity-70"
          style={{ background: `radial-gradient(circle, ${themeConfig.bgGlow} 50%, transparent 100%)` }}
        />

        {/* Page Header */}
        <div className="px-6 lg:px-10 mb-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 w-full max-w-7xl mx-auto"
          >
            {/* Title row */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-accent mb-2 transition-colors duration-500">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>{themeConfig.themeLabel} Core</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-light text-foreground tracking-tight mb-2">
                  Curated <span className={`bg-linear-to-r ${themeConfig.gradientText} bg-clip-text text-transparent font-serif italic transition-all duration-500`}>Outfits</span>
                </h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{isLoading ? 'Fetching premium database items...' : `${filteredOutfits.length} elite styles available`}</span>
                </div>
              </div>

              {/* Sort Dropdown — Shadcn Select */}
              <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
                <span className="text-[10px] tracking-[0.2em] text-accent uppercase font-semibold whitespace-nowrap hidden sm:inline transition-colors duration-500">
                  Sort
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[170px] rounded-xl border-border/30 bg-card/50 backdrop-blur-md text-sm font-medium shadow-sm hover:border-accent/40 transition-all duration-300 focus:ring-accent/30">
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

            {/* Filter toggle bar & Aesthetic Gen Z Gender Toggle Chips */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-border/10">
              {/* Premium Metallic Gender Toggle Chips */}
              <div className="flex flex-wrap items-center gap-2 bg-secondary/20 p-1.5 rounded-2xl border border-border/20 backdrop-blur-md">
                <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-bold px-2.5 py-1">
                  Gender:
                </span>
                {['All', 'Male', 'Female', 'Unisex'].map((g) => {
                  const isSelected = selectedGender === g;
                  return (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(g)}
                      className={`relative px-4 py-1.5 rounded-xl text-xs tracking-wider uppercase transition-all duration-500 overflow-hidden font-medium ${isSelected
                        ? 'text-white font-bold shadow-lg scale-[1.02]'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="activeGenderChip"
                          className="absolute inset-0 rounded-xl -z-10"
                          style={{ background: themeConfig.badgeBg }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{g}</span>
                    </button>
                  )
                })}
              </div>

              {/* Sidebar filter toggle & reset buttons */}
              <div className="flex items-center gap-3 self-end md:self-auto">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-300 ${sidebarOpen
                    ? 'border-accent/50 text-accent bg-accent/5 shadow-sm'
                    : 'border-border/30 text-muted-foreground hover:text-accent hover:border-accent/30'
                    }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{sidebarOpen ? 'Hide Refinement' : 'Filter Suite'}</span>
                  {hasActiveFilters && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block transition-colors duration-500 shadow-sm shadow-accent" />
                  )}
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-muted-foreground hover:text-accent transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-secondary/40"
                  >
                    <X className="w-3.5 h-3.5" /> Clear active
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Body: sidebar + grid side by side */}
        <div className="flex items-start px-6 lg:px-10 gap-8 max-w-7xl mx-auto w-full">

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
                <div className="sticky top-28 w-[260px] rounded-2xl border border-border/20 bg-card/40 backdrop-blur-xl p-6 shadow-sm">
                  {/* Sidebar header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center transition-colors duration-500">
                        <Filter className="w-4 h-4 text-accent transition-colors duration-500" />
                      </div>
                      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground">
                        Refine
                      </span>
                    </div>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="text-xs text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Reset
                      </button>
                    )}
                  </div>

                  <div className="h-px bg-border/20 mb-6" />

                  <FilterGroup
                    label="Occasion / Class"
                    options={categories}
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                  />

                  {/* Price Range */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1 h-3 rounded-full bg-accent transition-all duration-500 shrink-0" />
                      <p className="text-[11px] tracking-[0.25em] text-foreground font-semibold uppercase">
                        Price Range
                      </p>
                    </div>
                    <div className="space-y-1">
                      {PRICE_RANGES.map((range, index) => (
                        <button
                          key={range.label}
                          onClick={() => setSelectedPriceRange(index)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs tracking-wide transition-all duration-300 flex items-center justify-between ${
                            selectedPriceRange === index
                              ? 'bg-foreground text-background font-medium shadow-md scale-[1.02]'
                              : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                          }`}
                        >
                          <span className="truncate">{range.label}</span>
                          {selectedPriceRange === index && (
                            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 shadow-xs" />
                          )}
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
              <div className="flex flex-col justify-center items-center py-32 gap-4">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              </div>
            ) : filteredOutfits.length > 0 ? (
              <motion.div
                layout
                className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
              >
                {filteredOutfits.map((outfit) => (
                  <OutfitCard
                    key={outfit.id}
                    id={outfit.id}
                    name={outfit.title || outfit.name}
                    price={outfit.price}
                    occasion={outfit.categories?.name || 'Outfit'}
                    season={outfit.categories?.name || ''}
                    genderBadge={outfit.gender}
                    image={outfit.image_urls?.[0] || '/placeholder.svg'}
                    rating={5.0}
                    reviews={12}
                    isFavorited={favoriteIds.includes(outfit.id)}
                    onToggleFavorite={() => toggleFavorite(outfit.id)}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 glass rounded-3xl border border-dashed border-border/30 text-center px-4">
                <div className="w-14 h-14 bg-secondary/30 rounded-full flex items-center justify-center mb-5">
                  <X className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-lg text-foreground font-medium mb-2">
                  No luxury styles found matching active filters.
                </p>
                <p className="text-sm text-muted-foreground font-light mb-6 max-w-md">
                  Try adjusting your gender chips or price range parameters to uncover more exclusive celebrity look structures.
                </p>
                <button onClick={resetFilters} className="btn-premium text-sm py-2.5 px-6">
                  Reset Filter Parameters
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
