'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/use-user'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session, profile, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        router.push('/auth/login?redirect=/admin/dashboard')
        return
      }

      const role = profile?.role
      const isAdminUser = role === 'admin' || role === 'developer' || role === 'owner'
      
      if (!isAdminUser) {
        router.push('/account/dashboard')
      }
    }
  }, [isLoading, session, profile, router])

  if (isLoading) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <p className="text-muted-foreground animate-pulse">Verifying credentials...</p>
        </div>
      </LayoutWrapper>
    )
  }

  // Prevent flash of content if user is logged in but not admin
  const role = profile?.role
  const isAdminUser = role === 'admin' || role === 'developer' || role === 'owner'

  if (!session || !isAdminUser) {
    return null
  }

  return <>{children}</>
}
