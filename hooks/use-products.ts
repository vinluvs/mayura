import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

export interface ProductWithCategory extends Product {
  categories: Category | null
}

export function useProducts() {
  const supabase = createClient()

  const fetcher = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)

    if (error) throw error
    return data as ProductWithCategory[]
  }

  const { data, error, isLoading, mutate } = useSWR('products', fetcher)

  return {
    products: data || [],
    isLoading,
    error,
    mutate
  }
}

export function useProduct(id: string) {
  const supabase = createClient()

  const fetcher = async () => {
    if (!id) return null
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as ProductWithCategory
  }

  const { data, error, isLoading, mutate } = useSWR(id ? `product-${id}` : null, fetcher)

  return {
    product: data,
    isLoading,
    error,
    mutate
  }
}
