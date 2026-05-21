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

interface ProfileDialogProps {
  isOpen: boolean
  onClose: () => void
  profile: any
  session: any
  onUpdate: () => void
}

export function ProfileDialog({
  isOpen,
  onClose,
  profile,
  session,
  onUpdate,
}: ProfileDialogProps) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) {
      toast.error('You must be logged in to update your profile.')
      return
    }

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: fullName,
          phone: phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id)

      if (error) throw error

      toast.success('Profile updated successfully!')
      onUpdate()
      onClose()
    } catch (err: any) {
      console.error('Error updating profile:', err)
      toast.error(err.message || 'Failed to update profile.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-light tracking-widest uppercase">
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update your personal details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 555 123 4567"
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
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
