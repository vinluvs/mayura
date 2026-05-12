import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { useUser } from './use-user'
import { Database } from '@/lib/types/database'

export type Order = Database['public']['Tables']['orders']['Row']

export function useOrders() {
  const supabase = createClient()
  const { session } = useUser()

  const fetcher = async () => {
    if (!session) return []
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Order[]
  }

  const { data, error, isLoading, mutate } = useSWR(
    session ? `orders-${session.user.id}` : null,
    fetcher
  )

  return {
    orders: data || [],
    isLoading,
    error,
    mutate
  }
}
