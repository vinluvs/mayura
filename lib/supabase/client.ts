import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[v0] Supabase environment variables not configured for browser client')
    // Return a mock client for development without Supabase
    return null as any
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
  )
}
