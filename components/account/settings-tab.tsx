'use client'

import { useState } from 'react'
import { AddressManager } from './address-manager'
import { ChangePasswordDialog } from './change-password-dialog'
import { createClient } from '@/lib/supabase/client'
import { KeyRound, ShieldAlert, Loader2 } from 'lucide-react'

interface SettingsTabProps {
  profile: any
  session: any
  onUpdate: () => void
}

export function SettingsTab({ profile, session, onUpdate }: SettingsTabProps) {
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        'Are you sure you want to delete your account? Your account status will be marked as inactive and you will be signed out.'
      )
    ) {
      return
    }

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: 'inactive' })
        .eq('id', session.user.id)

      if (error) throw error

      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (err) {
      console.error('Error deleting account:', err)
      alert('Failed to delete account. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Address Management Section */}
      <div className="glass-sm p-8 rounded-2xl">
        <h2 className="text-2xl font-light tracking-widest text-foreground mb-6 uppercase">
          Delivery Addresses
        </h2>
        <AddressManager profile={profile} session={session} onUpdate={onUpdate} />
      </div>

      {/* Security Settings Section */}
      <div className="glass-sm p-8 rounded-2xl space-y-6">
        <h2 className="text-2xl font-light tracking-widest text-foreground mb-4 uppercase">
          Security Settings
        </h2>
        <div className="flex items-center justify-between p-4 bg-secondary/15 rounded-xl border border-border/30">
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-accent" />
              Password
            </h4>
            <p className="text-xs text-muted-foreground">
              Update your account password to keep it secure.
            </p>
          </div>
          <button
            onClick={() => setIsPasswordOpen(true)}
            className="px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Danger Zone Section */}
      <div className="glass-sm p-8 rounded-2xl border border-red-500/25 space-y-6 bg-red-500/[0.02]">
        <h2 className="text-2xl font-light tracking-widest text-red-600 dark:text-red-400 mb-4 uppercase flex items-center gap-2">
          <ShieldAlert className="w-6 h-6" />
          Danger Zone
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-red-500/[0.04] rounded-xl border border-red-500/20">
          <div className="space-y-1 max-w-lg">
            <h4 className="font-semibold text-red-600 dark:text-red-400 text-sm">
              Deactivate Account
            </h4>
            <p className="text-xs text-muted-foreground">
              Once you deactivate your account, your profile will be set to
              inactive, and you will be signed out. You can contact support if
              you wish to reactivate in the future.
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Deactivating...
              </>
            ) : (
              'Deactivate Account'
            )}
          </button>
        </div>
      </div>

      <ChangePasswordDialog
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
      />
    </div>
  )
}
