import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'

type Review = Database['public']['Tables']['look_reviews']['Row']

export interface ReviewWithUser extends Review {
  users: {
    id: string
    full_name: string | null
    profile_image_url: string | null
  } | null
}

export function useReviews(lookId: string) {
  const supabase = createClient()

  const fetcher = async () => {
    if (!lookId) return []
    const { data, error } = await supabase
      .from('look_reviews')
      .select(`
        *,
        users (
          id,
          full_name,
          profile_image_url
        )
      `)
      .eq('look_id', lookId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as ReviewWithUser[]
  }

  const { data, error, isLoading, mutate } = useSWR(
    lookId ? `reviews-${lookId}` : null,
    fetcher
  )

  const addReview = async (rating: number, reviewText: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('You must be logged in to submit a review.')
    }

    const { data: newReview, error } = await supabase
      .from('look_reviews')
      .insert({
        look_id: lookId,
        user_id: session.user.id,
        rating,
        review_text: reviewText
      })
      .select(`
        *,
        users (
          id,
          full_name,
          profile_image_url
        )
      `)
      .single()

    if (error) throw error

    // Optimistically update the list
    if (data) {
      mutate([newReview as ReviewWithUser, ...data], { revalidate: false })
    } else {
      mutate([newReview as ReviewWithUser], { revalidate: false })
    }
    return newReview
  }

  return {
    reviews: data || [],
    isLoading,
    error,
    addReview,
    mutate
  }
}
