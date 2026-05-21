'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ChangePasswordDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ChangePasswordDialog({
  isOpen,
  onClose,
}: ChangePasswordDialogProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast.success('Password updated successfully!')
      setNewPassword('')
      setConfirmPassword('')
      onClose()
    } catch (err: any) {
      console.error('Error changing password:', err)
      toast.error(err.message || 'Failed to change password.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-light tracking-widest uppercase">
            Change Password
          </DialogTitle>
          <DialogDescription>
            Enter a new password for your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-3 border border-accent/30 rounded-lg font-semibold hover:bg-accent/5 transition-all text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
