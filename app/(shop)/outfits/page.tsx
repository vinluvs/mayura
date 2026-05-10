'use client'

import { useState, useMemo } from 'react'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { OutfitCard } from '@/components/outfits/outfit-card'
import { Filter, ChevronDown, X } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'


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

export default function OutfitsPage() {
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
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }

    return result
  }, [selectedOccasion, selectedSeason, selectedPriceRange, sortBy])

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) newFavorites.delete(id)
    else newFavorites.add(id)
    setFavorites(newFavorites)
  }

  return (
    <LayoutWrapper>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background/50">
          <Sidebar className="border-r border-border/20 glass" variant="floating">
            <SidebarHeader className="p-6 border-b border-border/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Filter className="w-4 h-4 text-accent-foreground" />
                </div>
                <h2 className="text-lg font-medium tracking-widest text-foreground uppercase">Refine</h2>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
              <ScrollArea className="h-full pr-4">
                <SidebarGroup>
                  <SidebarGroupLabel className="text-[10px] tracking-[0.3em] text-accent uppercase font-bold mb-4">Occasion</SidebarGroupLabel>
                  <SidebarGroupContent className="space-y-2">
                    {OCCASIONS.map((occasion) => (
                      <button
                        key={occasion}
                        onClick={() => setSelectedOccasion(occasion)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                          selectedOccasion === occasion 
                            ? 'bg-accent text-accent-foreground font-medium shadow-md' 
                            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                        }`}
                      >
                        {occasion}
                      </button>
                    ))}
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-8">
                  <SidebarGroupLabel className="text-[10px] tracking-[0.3em] text-accent uppercase font-bold mb-4">Season</SidebarGroupLabel>
                  <SidebarGroupContent className="space-y-2">
                    {SEASONS.map((season) => (
                      <button
                        key={season}
                        onClick={() => setSelectedSeason(season)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                          selectedSeason === season 
                            ? 'bg-accent text-accent-foreground font-medium shadow-md' 
                            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                        }`}
                      >
                        {season}
                      </button>
                    ))}
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-8">
                  <SidebarGroupLabel className="text-[10px] tracking-[0.3em] text-accent uppercase font-bold mb-4">Price Range</SidebarGroupLabel>
                  <SidebarGroupContent className="space-y-2">
                    {PRICE_RANGES.map((range, index) => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedPriceRange(index)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                          selectedPriceRange === index 
                            ? 'bg-accent text-accent-foreground font-medium shadow-md' 
                            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </SidebarGroupContent>
                </SidebarGroup>
              </ScrollArea>
            </SidebarContent>
          </Sidebar>

          <SidebarInset className="flex-1 bg-transparent">
            <main className="p-6 lg:p-10">
              {/* Header / Stats */}
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mb-4">
                    Curated <span className="text-accent italic font-serif">Outfits</span>
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <SidebarTrigger className="hover:text-accent transition-colors">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                      </div>
                    </SidebarTrigger>
                    <span className="w-1 h-1 bg-muted rounded-full"></span>
                    <span>{filteredOutfits.length} unique styles found</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 glass-sm px-6 py-3 rounded-full border border-border/20">
                  <span className="text-[10px] tracking-widest text-muted-foreground font-bold uppercase">Sort By</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer pr-4"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {/* Masonry Grid */}
              {filteredOutfits.length > 0 ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                  {filteredOutfits.map((outfit) => (
                    <OutfitCard
                      key={outfit.id}
                      {...outfit}
                      isFavorited={favorites.has(outfit.id)}
                      onToggleFavorite={() => toggleFavorite(outfit.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 glass rounded-3xl border-dashed">
                  <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-6">
                    <X className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-xl text-muted-foreground font-light mb-8">No masterpieces found matching your search.</p>
                  <button
                    onClick={() => {
                      setSelectedOccasion('All')
                      setSelectedSeason('All')
                      setSelectedPriceRange(0)
                    }}
                    className="btn-premium"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </LayoutWrapper>

  )
}
