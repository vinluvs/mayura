import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'

type Look = Database['public']['Tables']['looks']['Row']
type Category = Database['public']['Tables']['categories']['Row']

export interface LookWithCategory extends Look {
  categories: Category | null
  price: number
  gender: string | null
}

function inferGender(look: any): string {
  const titleLower = (look?.title || look?.name || '').toLowerCase()
  if (titleLower.includes('sherwani') || titleLower.includes('groom') || titleLower.includes('men') || titleLower.includes('weekend vibe')) {
    return 'Male'
  } else if (titleLower.includes('gown') || titleLower.includes('saree') || titleLower.includes('lehenga') || titleLower.includes('bride') || titleLower.includes('women') || titleLower.includes('party glamour')) {
    return 'Female'
  }
  return 'Unisex'
}

export function useLooks() {
  const supabase = createClient()

  const fetcher = async () => {
    const { data, error } = await supabase
      .from('looks')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        ),
        look_items (
          products (
            price
          )
        )
      `)

    if (error) throw error

    return data.map((look: any) => ({
      ...look,
      gender: look.gender || inferGender(look),
      price: look.look_items?.reduce((total: number, item: any) => total + (item.products?.price || 0), 0) || 0
    })) as LookWithCategory[]
  }

  const { data, error, isLoading, mutate } = useSWR('looks', fetcher)

  return {
    looks: data || [],
    isLoading,
    error,
    mutate
  }
}

export function useLook(id: string) {
  const supabase = createClient()

  const fetcher = async () => {
    if (!id) return null
    const { data, error } = await supabase
      .from('looks')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        ),
        look_items (
          id,
          position,
          label,
          discount_label,
          products (*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return {
      ...data,
      gender: data.gender || inferGender(data)
    }
  }

  const { data, error, isLoading, mutate } = useSWR(id ? `look-${id}` : null, fetcher)

  return {
    look: data,
    isLoading,
    error,
    mutate
  }
}
