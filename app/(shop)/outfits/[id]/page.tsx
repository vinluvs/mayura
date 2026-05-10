'use client'

import { useState } from 'react'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { Star, Heart, Plus, Share2, ChevronRight } from 'lucide-react'
import Link from 'next/link'

// Sample data
const OUTFIT_DETAILS = {
  id: '1',
  name: 'Evening Elegance',
  price: 299,
  occasion: 'Formal',
  season: 'Summer',
  rating: 4.8,
  reviews: 124,
  heroImage: '/placeholder.svg?height=600&width=600',
  images: [
    '/placeholder.svg?height=600&width=600',
    '/placeholder.svg?height=600&width=600',
    '/placeholder.svg?height=600&width=600',
    '/placeholder.svg?height=600&width=600',
  ],
  description: 'Experience timeless elegance with our evening collection. This curated outfit combines sophisticated pieces designed to make you feel confident and radiant at any formal occasion. Perfect for galas, ceremonies, and upscale events.',
  styleGuide: 'Layer with a classic blazer for boardroom meetings or pair with heels for evening galas.',
  careInstructions: 'Dry clean recommended. Store on padded hangers away from direct sunlight.',
  products: [
    {
      id: '1',
      name: 'Silk Evening Gown',
      price: 189,
      color: 'Black',
      size: 'XS-XL',
      isOptional: false,
    },
    {
      id: '2',
      name: 'Satin Blazer',
      price: 89,
      color: 'White',
      size: 'XS-XL',
      isOptional: true,
    },
    {
      id: '3',
      name: 'Diamond Earrings',
      price: 21,
      color: 'Silver',
      size: 'One Size',
      isOptional: true,
    },
  ],
  customerReviews: [
    {
      id: 1,
      author: 'Sarah M.',
      rating: 5,
      text: 'Absolutely stunning! The quality is exceptional and it fits perfectly.',
      date: '2 weeks ago',
    },
    {
      id: 2,
      author: 'Emma L.',
      rating: 5,
      text: 'Worth every penny. Got so many compliments at the gala!',
      date: '1 month ago',
    },
    {
      id: 3,
      author: 'Jessica K.',
      rating: 4,
      text: 'Beautiful outfit, though I wished there were more size options.',
      date: '2 months ago',
    },
  ],
  similarOutfits: [
    { id: '2', name: 'Casual Chic', price: 199, image: '/placeholder.svg?height=300&width=300', rating: 4.6 },
    { id: '3', name: 'Party Glamour', price: 349, image: '/placeholder.svg?height=300&width=300', rating: 4.9 },
    { id: '4', name: 'Corporate Chic', price: 329, image: '/placeholder.svg?height=300&width=300', rating: 4.8 },
  ],
}

export default function OutfitDetailPage({ params }: { params: { id: string } }) {
  const [mainImage, setMainImage] = useState(OUTFIT_DETAILS.heroImage)
  const [isFavorited, setIsFavorited] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState(
    OUTFIT_DETAILS.products.filter((p) => !p.isOptional).map((p) => p.id)
  )
  const [quantity, setQuantity] = useState(1)

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  const handleAddToCart = () => {
    // Will be implemented with Supabase
    console.log('Adding to cart:', { outfitId: OUTFIT_DETAILS.id, selectedProducts, quantity })
  }

  const totalPrice = OUTFIT_DETAILS.products
    .filter((p) => selectedProducts.includes(p.id))
    .reduce((sum, p) => sum + p.price, 0)

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="border-b border-border/50 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/outfits" className="hover:text-foreground transition-colors">Outfits</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{OUTFIT_DETAILS.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Images */}
            <div>
              <div className="glass-sm rounded-2xl overflow-hidden mb-4">
                <img
                  src={mainImage}
                  alt={OUTFIT_DETAILS.name}
                  className="w-full h-full aspect-square object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {OUTFIT_DETAILS.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`glass-sm rounded-lg overflow-hidden border-2 transition-all ${
                      mainImage === img ? 'border-accent' : 'border-transparent hover:border-accent/50'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full aspect-square object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <p className="text-xs tracking-widest text-accent mb-3 uppercase">{OUTFIT_DETAILS.occasion}</p>

              <h1 className="text-4xl md:text-5xl font-light tracking-widest text-foreground mb-4">
                {OUTFIT_DETAILS.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(OUTFIT_DETAILS.rating) ? 'fill-accent text-accent' : 'fill-muted text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {OUTFIT_DETAILS.rating.toFixed(1)} based on {OUTFIT_DETAILS.reviews} reviews
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6 leading-relaxed">{OUTFIT_DETAILS.description}</p>

              {/* Products in Outfit */}
              <div className="glass-sm p-6 rounded-2xl mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">ITEMS IN THIS OUTFIT</h3>
                <div className="space-y-3">
                  {OUTFIT_DETAILS.products.map((product) => (
                    <label
                      key={product.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProduct(product.id)}
                        disabled={!product.isOptional && selectedProducts.includes(product.id)}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-foreground">{product.name}</p>
                          <p className="text-accent font-semibold">${product.price}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {product.color} • Size: {product.size}
                          {product.isOptional && ' • (Optional)'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price and Quantity */}
              <div className="glass-sm p-6 rounded-2xl mb-6">
                <div className="mb-6 pb-6 border-b border-border/50">
                  <p className="text-sm text-muted-foreground mb-2">Total Price</p>
                  <p className="text-4xl font-light text-accent">${totalPrice}</p>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-semibold text-foreground mb-3 block">QUANTITY</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 border border-border/50 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border border-border/50 rounded-lg py-2 bg-transparent"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 border border-border/50 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300 mb-4"
                >
                  <Plus className="w-5 h-5" />
                  Add to Cart
                </button>

                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 border border-accent/30 rounded-lg font-semibold hover:bg-accent/5 transition-all duration-300"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-accent' : ''}`} />
                  {isFavorited ? 'Added to Favorites' : 'Add to Favorites'}
                </button>
              </div>

              {/* Share */}
              <button className="flex items-center justify-center gap-2 px-6 py-3 border border-border/50 rounded-lg hover:bg-secondary/50 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Additional Info Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="glass-sm p-8 rounded-2xl">
              <h3 className="text-xl font-semibold text-foreground mb-4 tracking-wide">STYLING GUIDE</h3>
              <p className="text-muted-foreground leading-relaxed">{OUTFIT_DETAILS.styleGuide}</p>
            </div>
            <div className="glass-sm p-8 rounded-2xl">
              <h3 className="text-xl font-semibold text-foreground mb-4 tracking-wide">CARE INSTRUCTIONS</h3>
              <p className="text-muted-foreground leading-relaxed">{OUTFIT_DETAILS.careInstructions}</p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-light tracking-widest text-foreground mb-8">CUSTOMER REVIEWS</h2>
            <div className="space-y-6">
              {OUTFIT_DETAILS.customerReviews.map((review) => (
                <div key={review.id} className="glass-sm p-6 rounded-2xl">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{review.author}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'fill-accent text-accent' : 'fill-muted'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Outfits */}
          <div>
            <h2 className="text-3xl font-light tracking-widest text-foreground mb-8">SIMILAR OUTFITS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {OUTFIT_DETAILS.similarOutfits.map((outfit) => (
                <Link key={outfit.id} href={`/outfits/${outfit.id}`}>
                  <div className="group glass-sm overflow-hidden rounded-2xl hover:shadow-premium transition-all cursor-pointer">
                    <div className="relative h-80 overflow-hidden bg-secondary/50">
                      <img
                        src={outfit.image}
                        alt={outfit.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{outfit.name}</h3>
                      <div className="flex justify-between items-center">
                        <p className="text-2xl font-light text-accent">${outfit.price}</p>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(outfit.rating) ? 'fill-accent' : 'fill-muted'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
