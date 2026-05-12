import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { useUser } from './use-user'
import { useEffect, useState } from 'react'

export type CartItem = {
  id?: string
  product_id?: string | null
  look_id?: string | null
  item_type: 'product' | 'look'
  quantity: number
  size?: string | null
  color?: string | null
  product?: any
  look?: any
}

export function useCart() {
  const supabase = createClient()
  const { session } = useUser()
  
  const [localCart, setLocalCart] = useState<CartItem[]>([])
  const [isLocalLoaded, setIsLocalLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('mayura_guest_cart')
    if (saved) {
      try {
        setLocalCart(JSON.parse(saved))
      } catch (e) {}
    }
    setIsLocalLoaded(true)
  }, [])

  useEffect(() => {
    if (isLocalLoaded && !session) {
      localStorage.setItem('mayura_guest_cart', JSON.stringify(localCart))
    }
  }, [localCart, isLocalLoaded, session])

  const fetcher = async () => {
    if (!session) return null
    
    let { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', session.user.id)
      .single()
      
    if (!cart) {
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: session.user.id })
        .select()
        .single()
      if (createError) throw createError
      cart = newCart
    }

    const { data: items, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products (*),
        look:looks (*, look_items(products(price)))
      `)
      .eq('cart_id', cart.id)

    if (itemsError) throw itemsError
    return { cartId: cart.id, items: items as CartItem[] }
  }

  const { data, error, isLoading, mutate } = useSWR(
    session ? `cart-${session.user.id}` : null,
    fetcher
  )

  useEffect(() => {
    const mergeCarts = async () => {
      if (session && data?.cartId && localCart.length > 0) {
        const itemsToInsert = localCart.map(item => ({
          cart_id: data.cartId,
          product_id: item.product_id,
          look_id: item.look_id,
          item_type: item.item_type,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        }))
        
        await supabase.from('cart_items').insert(itemsToInsert)
        
        setLocalCart([])
        localStorage.removeItem('mayura_guest_cart')
        mutate()
      }
    }
    
    mergeCarts()
  }, [session, data?.cartId, localCart.length, mutate, supabase])

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    if (session && data?.cartId) {
      const existing = data.items.find(i => 
        i.item_type === item.item_type && 
        i.product_id === item.product_id && 
        i.look_id === item.look_id &&
        i.size === item.size && 
        i.color === item.color
      )

      if (existing) {
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + item.quantity })
          .eq('id', existing.id)
      } else {
        const { product, look, ...dbItem } = item
        await supabase
          .from('cart_items')
          .insert({
            ...dbItem,
            cart_id: data.cartId
          })
      }
      mutate()
    } else {
      setLocalCart(prev => {
        const existing = prev.find(i => 
          i.item_type === item.item_type && 
          i.product_id === item.product_id && 
          i.look_id === item.look_id &&
          i.size === item.size && 
          i.color === item.color
        )
        if (existing) {
          return prev.map(i => i === existing ? { ...i, quantity: i.quantity + item.quantity } : i)
        }
        return [...prev, { ...item, id: Math.random().toString(36).substring(2, 9) }]
      })
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id)
    
    if (session) {
      await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id)
      mutate()
    } else {
      setLocalCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
    }
  }

  const removeFromCart = async (id: string) => {
    if (session) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)
      mutate()
    } else {
      setLocalCart(prev => prev.filter(item => item.id !== id))
    }
  }

  const clearCart = async () => {
    if (session && data?.cartId) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', data.cartId)
      mutate()
    } else {
      setLocalCart([])
    }
  }

  return {
    items: session ? (data?.items || []) : localCart,
    isLoading: session ? isLoading : !isLocalLoaded,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  }
}
