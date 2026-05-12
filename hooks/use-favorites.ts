import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { useUser } from './use-user'
import { toast } from 'sonner'

export function useFavorites() {
  const supabase = createClient()
  const { session } = useUser()

  const fetcher = async () => {
    if (!session) return []
    const { data, error } = await supabase
      .from('favorites')
      .select('look_id')
      .eq('user_id', session.user.id)

    if (error) throw error
    return data.map((f: { look_id: any }) => f.look_id)
  }

  const { data: favoriteIds, error, isLoading, mutate } = useSWR(
    session ? `favorites-${session.user.id}` : null,
    fetcher
  )

  const toggleFavorite = async (lookId: string) => {
    if (!session) {
      toast.error("Please login to save favorites.")
      return
    }

    const currentFavorites = favoriteIds || []
    const isFavorited = currentFavorites.includes(lookId)

    // Optimistic UI update
    mutate(
      isFavorited ? currentFavorites.filter((id: string) => id !== lookId) : [...currentFavorites, lookId],
      false
    )

    if (isFavorited) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', session.user.id)
        .eq('look_id', lookId)
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: session.user.id, look_id: lookId })
    }

    mutate()
  }

  return {
    favoriteIds: favoriteIds || [],
    isLoading,
    error,
    toggleFavorite
  }
}
