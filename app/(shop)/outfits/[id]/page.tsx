'use client'

import { useState, useEffect, use, useMemo } from 'react'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { Star, Heart, Plus, Share2, ChevronRight, Loader2, MessageSquare, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useLook, useLooks } from '@/hooks/use-looks'
import { useFavorites } from '@/hooks/use-favorites'
import { useCart } from '@/hooks/use-cart'
import { useReviews } from '@/hooks/use-reviews'
import { useUser } from '@/hooks/use-user'
import { OutfitCard } from '@/components/outfits/outfit-card'
import { motion, AnimatePresence } from 'framer-motion'

export default function OutfitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const id = unwrappedParams.id

  const { look, isLoading, error } = useLook(id)
  const { looks: allLooks } = useLooks()
  const { favoriteIds, toggleFavorite } = useFavorites()
  const { addToCart } = useCart()
  const { reviews, isLoading: isReviewsLoading, addReview } = useReviews(id)
  const { session } = useUser()

  const [mainImageState, setMainImageState] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Review Form state
  const [newRating, setNewRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [newReviewText, setNewReviewText] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState(false)

  const isFavorited = favoriteIds.includes(id)

  // Unique list of all gallery images (looks + products inside looks)
  const allGalleryImages = useMemo(() => {
    if (!look) return []
    const outfitImages = look.image_urls || []
    const productImages = look.look_items
      ?.flatMap((item: any) => item.products?.image_urls || [])
      .filter(Boolean) || []

    return Array.from(new Set([...outfitImages, ...productImages]))
  }, [look])

  const activeImage = mainImageState || allGalleryImages[0] || null

  useEffect(() => {
    if (look) {
      // By default, select all products in the look
      setSelectedProducts(look.look_items?.map((item: any) => item.products?.id).filter(Boolean) || [])
    }
  }, [look])

  // Related outfits logic
  const relatedOutfits = useMemo(() => {
    if (!look || !allLooks.length) return []
    let filtered = allLooks.filter(
      (l) => l.category_id === look.category_id && l.id !== look.id
    )
    if (filtered.length < 4) {
      const others = allLooks.filter(
        (l) => l.id !== look.id && l.category_id !== look.category_id
      )
      filtered = [...filtered, ...others]
    }
    return filtered.slice(0, 4)
  }, [allLooks, look])

  // Calculate ratings breakdown
  const reviewsCount = reviews.length
  const avgRating = reviewsCount > 0
    ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount).toFixed(1))
    : 5.0

  const ratingDistribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((r) => r.rating === stars).length
      const percentage = reviewsCount > 0 ? Math.round((count / reviewsCount) * 100) : 0
      return { stars, count, percentage }
    })
  }, [reviews, reviewsCount])

  if (isLoading) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen pt-32 flex flex-col justify-center items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground tracking-widest uppercase">Fetching Outfit Detail...</p>
        </div>
      </LayoutWrapper>
    )
  }

  if (error || !look) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen pt-32 px-6 flex justify-center text-center">
          <p className="text-red-500">Failed to load outfit details. Please try again later.</p>
        </div>
      </LayoutWrapper>
    )
  }

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      const allItems = look.look_items?.map((item: any) => item.products?.id).filter(Boolean) || []
      const allSelected = allItems.length > 0 && allItems.every((id: string) => selectedProducts.includes(id))

      if (allSelected) {
        await addToCart({
          item_type: 'look',
          look_id: look.id,
          quantity: quantity,
          size: 'Default',
          color: 'Default',
          look: look
        })
      } else {
        // Add the selected products as individual cart items.
        for (const productId of selectedProducts) {
          const item = look.look_items?.find((i: any) => i.products?.id === productId)
          if (item && item.products) {
            await addToCart({
              item_type: 'product',
              product_id: item.products.id,
              quantity: quantity,
              size: item.products.size_options?.[0] || 'Default',
              color: item.products.color_options?.[0] || 'Default',
              product: item.products
            })
          }
        }
      }
      alert('Added selected products to cart successfully!')
    } catch (e) {
      console.error(e)
      alert('Failed to add products to cart.')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    setIsSubmittingReview(true)
    setReviewError('')
    setReviewSuccess(false)
    try {
      await addReview(newRating, newReviewText)
      setNewReviewText('')
      setNewRating(5)
      setReviewSuccess(true)
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review.')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const originalTotalPrice = look.look_items?.reduce((sum: number, item: any) => {
    if (item.products && selectedProducts.includes(item.products.id)) {
      return sum + item.products.price
    }
    return sum
  }, 0) || 0

  const allItems = look.look_items?.map((item: any) => item.products?.id).filter(Boolean) || []
  const allSelected = allItems.length > 0 && allItems.every((id: string) => selectedProducts.includes(id))
  const hasDiscount = allSelected && look.discount && look.discount > 0
  const discountedPrice = hasDiscount
    ? originalTotalPrice * (1 - look.discount / 100)
    : originalTotalPrice

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-background pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="border-b border-border/30 px-4 py-4 backdrop-blur-md bg-background/50 sticky top-16 z-20">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors uppercase tracking-wider">Home</Link>
            <ChevronRight className="w-4 h-4 text-accent" />
            <Link href="/outfits" className="hover:text-foreground transition-colors uppercase tracking-wider">Outfits</Link>
            <ChevronRight className="w-4 h-4 text-accent" />
            <span className="text-foreground truncate font-medium uppercase tracking-wider">{look.title || look.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Gallery Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="glass-sm rounded-2xl overflow-hidden relative border border-border/20 group">
                <AnimatePresence mode="wait">
                  {activeImage && (
                    <motion.img
                      key={activeImage}
                      src={activeImage}
                      alt={look.title || look.name}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full aspect-3/4 object-cover animate-fade-in"
                    />
                  )}
                </AnimatePresence>
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/30 text-xs font-semibold text-accent tracking-widest uppercase">
                  {look.categories?.name || 'Curated'}
                </div>
              </div>

              {/* Thumbnails Row */}
              {allGalleryImages.length > 1 && (
                <div className="grid grid-cols-5 md:grid-cols-6 gap-3 pt-2">
                  {allGalleryImages.map((img, idx) => {
                    const isSelected = activeImage === img
                    return (
                      <button
                        key={idx}
                        onClick={() => setMainImageState(img)}
                        className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all duration-300 ${
                          isSelected ? 'border-accent scale-[1.04] shadow-md shadow-accent/20' : 'border-border/30 hover:border-accent/40'
                        }`}
                      >
                        <img src={img || undefined} alt={`Gallery view ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Config & Details Column */}
            <div className="lg:col-span-5 flex flex-col space-y-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-accent mb-2">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>{look.gender || 'Unisex'} Showcase</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-light tracking-wide text-foreground leading-tight">
                  {look.title || look.name}
                </h1>
              </div>

              {/* Dynamic Review rating display */}
              <div className="flex items-center gap-3 pb-6 border-b border-border/20">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(avgRating)
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground font-light">
                  ({reviewsCount} customer {reviewsCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {/* Description */}
              {look.description && (
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-light">
                  {look.description}
                </p>
              )}

              {/* Products in Outfit List */}
              {look.look_items && look.look_items.length > 0 && (
                <div className="glass-sm p-6 rounded-2xl border border-border/20">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs tracking-[0.2em] font-semibold text-foreground uppercase">Items in this set</h3>
                    <span className="text-[10px] text-muted-foreground">Select products to purchase</span>
                  </div>
                  <div className="space-y-3">
                    {look.look_items.map((item: any) => {
                      if (!item.products) return null
                      const isSelected = selectedProducts.includes(item.products.id)
                      return (
                        <div
                          key={item.products.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                            isSelected
                              ? 'border-accent bg-accent/5 shadow-sm shadow-accent/5'
                              : 'border-border/30 hover:border-accent/20 hover:bg-secondary/20'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleProduct(item.products.id)}
                            className="w-5 h-5 cursor-pointer accent-accent shrink-0 rounded-md"
                          />
                          <div className="w-12 h-14 rounded-lg overflow-hidden bg-secondary shrink-0 relative animate-fade-in">
                            <img src={item.products.image_urls?.[0] || undefined} alt={item.products.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-sm text-foreground truncate pr-2">{item.products.name}</p>
                              <p className="text-accent font-bold text-sm shrink-0">${item.products.price}</p>
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate font-light mt-0.5">
                              {item.label ? `${item.label} • ` : ''}
                              {item.products.in_stock ? 'In Stock' : 'Out of Stock'}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Purchase Card */}
              <div className="glass-sm p-6 rounded-2xl border border-border/20">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border/20">
                  <div>
                    <p className="text-xs text-muted-foreground font-light mb-1">Combined Price</p>
                    {hasDiscount ? (
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-3xl font-light text-foreground">${discountedPrice.toFixed(2)}</span>
                        <span className="text-lg line-through text-muted-foreground font-light">${originalTotalPrice.toFixed(2)}</span>
                        <span className="text-xs bg-accent/15 text-accent font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">{look.discount}% OFF</span>
                      </div>
                    ) : (
                      <p className="text-3xl font-light text-foreground">${originalTotalPrice.toFixed(2)}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <label className="text-[10px] tracking-widest font-semibold text-muted-foreground mb-2 uppercase">Quantity</label>
                    <div className="flex items-center gap-2.5 bg-secondary/30 rounded-xl p-1 border border-border/40">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-sm font-semibold"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-sm font-semibold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || selectedProducts.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground rounded-xl font-medium hover:shadow-lg hover:shadow-accent/15 transition-all duration-300 disabled:opacity-40"
                  >
                    {isAddingToCart ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                    <span>{isAddingToCart ? 'Adding to cart...' : `Add Selected to Cart (${selectedProducts.length})`}</span>
                  </button>

                  <button
                    onClick={() => toggleFavorite(look.id)}
                    className="w-full flex items-center justify-center gap-2 px-8 py-3.5 border border-border/40 rounded-xl font-medium hover:bg-secondary/40 transition-all duration-300"
                  >
                    <Heart className={`w-5 h-5 transition-transform duration-300 ${isFavorited ? 'fill-accent text-accent scale-110' : ''}`} />
                    <span>{isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-border/20 my-16" />

          {/* Reviews & Submission Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Reviews summary analytics */}
            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-xl font-light tracking-widest text-foreground">CUSTOMER REVIEWS</h2>
              
              <div className="glass-sm p-6 rounded-2xl border border-border/20 flex flex-col items-center justify-center text-center">
                <span className="text-6xl font-light text-foreground">{avgRating.toFixed(1)}</span>
                <div className="flex gap-0.5 my-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(avgRating)
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground font-light">Average score from {reviewsCount} shoppers</span>
              </div>

              {/* Progress bars distribution */}
              <div className="glass-sm p-6 rounded-2xl border border-border/20 space-y-3">
                {ratingDistribution.map((dist) => (
                  <div key={dist.stars} className="flex items-center gap-3 text-xs">
                    <span className="w-10 text-muted-foreground font-light">{dist.stars} Stars</span>
                    <div className="flex-1 h-2 bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${dist.percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">{dist.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews listing & add form */}
            <div className="lg:col-span-8 space-y-8">
              {/* Form to submit review */}
              <div className="glass-sm p-6 rounded-2xl border border-border/20">
                <h3 className="text-sm font-semibold tracking-wider text-foreground mb-4 uppercase">Share your opinion</h3>
                {session ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {reviewSuccess && (
                      <p className="text-emerald-500 text-xs font-semibold">✓ Review submitted successfully!</p>
                    )}
                    {reviewError && (
                      <p className="text-red-500 text-xs font-semibold">✗ Error: {reviewError}</p>
                    )}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase">Your Rating</label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                (hoverRating !== null ? star <= hoverRating : star <= newRating)
                                  ? 'fill-accent text-accent'
                                  : 'text-muted-foreground/30'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase">Review text</label>
                      <textarea
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        placeholder="Write details about the comfort, quality, and fit of this outfit set..."
                        rows={4}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border/30 bg-transparent text-sm focus:ring-accent/30 focus:border-accent/40 text-foreground"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl font-medium text-xs hover:shadow-md transition-all duration-300 disabled:opacity-50"
                    >
                      {isSubmittingReview ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MessageSquare className="w-4 h-4" />
                      )}
                      <span>{isSubmittingReview ? 'Submitting...' : 'Post Review'}</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-secondary/20 rounded-xl border border-border/10 text-center">
                    <p className="text-xs text-muted-foreground mb-3 font-light">Only registered clients can submit reviews.</p>
                    <Link
                      href="/account/dashboard"
                      className="inline-block px-4 py-2 border border-accent/40 text-accent rounded-lg text-xs font-medium hover:bg-accent/5 transition-colors"
                    >
                      Go to Authentication
                    </Link>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wider text-foreground mb-4 uppercase">Reviews Feed</h3>
                {isReviewsLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="p-8 text-center glass-sm border border-border/20 rounded-2xl text-muted-foreground font-light text-sm">
                    No reviews have been posted for this outfit combination yet. Be the first to share your thoughts!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev) => {
                      const reviewerName = rev.users?.full_name || 'Anonymous Client'
                      const reviewDate = new Date(rev.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                      return (
                        <div key={rev.id} className="glass-sm p-5 rounded-2xl border border-border/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {rev.users?.profile_image_url && rev.users.profile_image_url !== '' ? (
                                <img
                                  src={rev.users.profile_image_url || undefined}
                                  alt={reviewerName}
                                  className="w-9 h-9 rounded-full object-cover border border-accent/20"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border border-border/40 text-xs font-semibold text-accent uppercase">
                                  {reviewerName.charAt(0)}
                                </div>
                              )}
                              <div>
                                <p className="text-xs font-semibold text-foreground">{reviewerName}</p>
                                <p className="text-[10px] text-muted-foreground font-light">{reviewDate}</p>
                              </div>
                            </div>

                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < rev.rating
                                      ? 'fill-accent text-accent'
                                      : 'text-muted-foreground/20'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <p className="text-xs md:text-sm text-muted-foreground font-light leading-relaxed whitespace-pre-wrap">
                            {rev.review_text}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="h-px bg-border/20 my-16" />

          {/* Related Outfits Slider / Grid */}
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-accent uppercase">Curators' Pick</span>
              <h2 className="text-2xl md:text-4xl font-light tracking-wide text-foreground mt-1">
                RELATED OUTFITS
              </h2>
            </div>

            {relatedOutfits.length === 0 ? (
              <p className="text-sm text-muted-foreground font-light">No similar outfits discovered at this time.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                {relatedOutfits.map((outfit) => (
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
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
