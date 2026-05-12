import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'

type UserProfile = Database['public']['Tables']['users']['Row']

export function useUser() {
  const supabase = createClient()

  const fetcher = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { session: null, profile: null }

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle()

    if (error) {
      // If profile doesn't exist yet, we still return the session
      console.warn('[v0] User profile fetch error:', error)
      return { session, profile: null }
    }
    
    return { session, profile: profile as UserProfile }
  }

  const { data, error, mutate, isLoading } = useSWR('user_session', fetcher)

  return {
    session: data?.session,
    profile: data?.profile,
    isLoading,
    error,
    mutate,
  }
}
