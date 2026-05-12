'use client'

import { useState, useEffect, use } from 'react'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { Star, Heart, Plus, Share2, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useLook } from '@/hooks/use-looks'
import { useFavorites } from '@/hooks/use-favorites'
import { useCart } from '@/hooks/use-cart'

export default function OutfitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const id = unwrappedParams.id

  const { look, isLoading, error } = useLook(id)
  const { favoriteIds, toggleFavorite } = useFavorites()
  const { addToCart } = useCart()

  const [mainImage, setMainImage] = useState<string>('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const isFavorited = favoriteIds.includes(id)

  useEffect(() => {
    if (look) {
      setMainImage(look.model_image_url)
      // By default, select all products in the look
      setSelectedProducts(look.look_items?.map((item: any) => item.products?.id).filter(Boolean) || [])
    }
  }, [look])

  if (isLoading) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen pt-32 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
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
      alert('Added to cart successfully!')
    } catch (e) {
      console.error(e)
      alert('Failed to add to cart.')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const totalPrice = look.look_items?.reduce((sum: number, item: any) => {
    if (item.products && selectedProducts.includes(item.products.id)) {
      return sum + item.products.price
    }
    return sum
  }, 0) || 0

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-background pt-24">
        {/* Breadcrumb */}
        <div className="border-b border-border/50 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/outfits" className="hover:text-foreground transition-colors">Outfits</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{look.title || look.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Images */}
            <div>
              <div className="glass-sm rounded-2xl overflow-hidden mb-4">
                <img
                  src={mainImage || look.model_image_url}
                  alt={look.title || look.name}
                  className="w-full h-full aspect-3/4 object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <button
                  onClick={() => setMainImage(look.model_image_url)}
                  className={`glass-sm rounded-lg overflow-hidden border-2 transition-all ${
                    mainImage === look.model_image_url ? 'border-accent' : 'border-transparent hover:border-accent/50'
                  }`}
                >
                  <img src={look.model_image_url} alt="Main View" className="w-full aspect-square object-cover" />
                </button>
                {/* Normally we'd map over extra images from DB, assuming model_image_url is the only one for now */}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <p className="text-xs tracking-widest text-accent mb-3 uppercase">{look.categories?.name || 'Outfit'}</p>

              <h1 className="text-4xl md:text-5xl font-light tracking-widest text-foreground mb-4">
                {look.title || look.name}
              </h1>

              {/* Rating Placeholder */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-accent text-accent"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  5.0 based on 0 reviews
                </span>
              </div>

              {/* Description */}
              {look.description && (
                <p className="text-muted-foreground mb-6 leading-relaxed">{look.description}</p>
              )}

              {/* Products in Outfit */}
              {look.look_items && look.look_items.length > 0 && (
                <div className="glass-sm p-6 rounded-2xl mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">ITEMS IN THIS OUTFIT</h3>
                  <div className="space-y-3">
                    {look.look_items.map((item: any) => {
                      if (!item.products) return null
                      return (
                        <label
                          key={item.products.id}
                          className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(item.products.id)}
                            onChange={() => toggleProduct(item.products.id)}
                            className="w-5 h-5 cursor-pointer accent-accent"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-foreground">{item.products.name}</p>
                              <p className="text-accent font-semibold">${item.products.price}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {item.label && `${item.label} • `}
                              In Stock: {item.products.in_stock ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

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
                  disabled={isAddingToCart || selectedProducts.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300 mb-4 disabled:opacity-50"
                >
                  {isAddingToCart ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>

                <button
                  onClick={() => toggleFavorite(look.id)}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 border border-accent/30 rounded-lg font-semibold hover:bg-accent/5 transition-all duration-300"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-accent text-accent' : ''}`} />
                  {isFavorited ? 'Favorited' : 'Add to Favorites'}
                </button>
              </div>

              {/* Share */}
              <button className="flex items-center justify-center gap-2 px-6 py-3 border border-border/50 rounded-lg hover:bg-secondary/50 transition-colors w-fit">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}

