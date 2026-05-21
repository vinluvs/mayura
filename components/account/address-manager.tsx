'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Plus, Trash2, Edit2, Check, Loader2 } from 'lucide-react'

interface Address {
  id: string
  name: string // e.g. Home, Work
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

interface AddressManagerProps {
  profile: any
  session: any
  onUpdate: () => void
}

export function AddressManager({
  profile,
  session,
  onUpdate,
}: AddressManagerProps) {
  const supabase = createClient()
  const addresses: Address[] = Array.isArray(profile?.addresses)
    ? profile.addresses
    : []

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form states
  const [name, setName] = useState('Home')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('India')
  const [isDefault, setIsDefault] = useState(false)

  const resetForm = () => {
    setName('Home')
    setFirstName('')
    setLastName('')
    setEmail(session?.user?.email || '')
    setPhone(profile?.phone || '')
    setStreet('')
    setCity('')
    setState('')
    setZip('')
    setCountry('India')
    setIsDefault(false)
    setEditingId(null)
    setIsFormOpen(false)
  }

  const handleEditClick = (address: Address) => {
    setName(address.name || 'Home')
    setFirstName(address.firstName || '')
    setLastName(address.lastName || '')
    setEmail(address.email || '')
    setPhone(address.phone || '')
    setStreet(address.street || '')
    setCity(address.city || '')
    setState(address.state || '')
    setZip(address.zip || '')
    setCountry(address.country || 'India')
    setIsDefault(address.isDefault || false)
    setEditingId(address.id)
    setIsFormOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) return

    setIsSaving(true)
    try {
      let updatedAddresses: Address[] = []

      const targetAddress: Address = {
        id: editingId || Math.random().toString(36).substring(2, 9),
        name,
        firstName,
        lastName,
        email,
        phone,
        street,
        city,
        state,
        zip,
        country,
        isDefault: isDefault || addresses.length === 0, // Force default if it's the first address
      }

      if (targetAddress.isDefault) {
        // Unmark previous default addresses
        addresses.forEach((addr) => {
          addr.isDefault = false
        })
      }

      if (editingId) {
        // Edit existing
        updatedAddresses = addresses.map((addr) =>
          addr.id === editingId ? targetAddress : addr
        )
      } else {
        // Add new
        updatedAddresses = [...addresses, targetAddress]
      }

      // If one of the addresses is set to default, ensure it is unique
      if (targetAddress.isDefault) {
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === targetAddress.id,
        }))
      }

      const { error } = await supabase
        .from('users')
        .update({
          addresses: updatedAddresses,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id)

      if (error) throw error

      toast.success(
        editingId ? 'Address updated!' : 'Address added successfully!'
      )
      resetForm()
      onUpdate()
    } catch (err: any) {
      console.error('Error saving address:', err)
      toast.error(err.message || 'Failed to save address.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!session?.user) return

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this address?'
    )
    if (!confirmDelete) return

    try {
      const filteredAddresses = addresses.filter((addr) => addr.id !== id)

      // If we deleted the default address, make the first remaining address default
      if (
        addresses.find((addr) => addr.id === id)?.isDefault &&
        filteredAddresses.length > 0
      ) {
        filteredAddresses[0].isDefault = true
      }

      const { error } = await supabase
        .from('users')
        .update({
          addresses: filteredAddresses,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id)

      if (error) throw error

      toast.success('Address deleted successfully!')
      onUpdate()
    } catch (err: any) {
      console.error('Error deleting address:', err)
      toast.error('Failed to delete address.')
    }
  }

  const handleSetDefault = async (id: string) => {
    if (!session?.user) return

    try {
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))

      const { error } = await supabase
        .from('users')
        .update({
          addresses: updatedAddresses,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id)

      if (error) throw error

      toast.success('Default address updated!')
      onUpdate()
    } catch (err: any) {
      console.error('Error setting default address:', err)
      toast.error('Failed to set default address.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <h3 className="text-lg font-semibold text-foreground">
          DELIVERY ADDRESSES
        </h3>
        {!isFormOpen && (
          <button
            onClick={() => {
              resetForm()
              setIsFormOpen(true)
            }}
            className="flex items-center gap-2 px-4 py-2 border border-accent/30 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-semibold text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSave}
          className="border border-border/50 p-6 rounded-xl bg-secondary/20 space-y-4 transition-all"
        >
          <h4 className="font-semibold text-foreground">
            {editingId ? 'EDIT ADDRESS' : 'ADD NEW ADDRESS'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground font-semibold">
                LABEL (e.g. Home, Work)
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold">
                FIRST NAME
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold">
                LAST NAME
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground font-semibold">
                EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold">
                PHONE
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-semibold">
              STREET ADDRESS
            </label>
            <input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="House/Flat number, Street name, Land Mark"
              className="w-full px-3 py-2 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground mt-1"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-muted-foreground font-semibold">
                CITY
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold">
                STATE
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold">
                ZIP CODE
              </label>
              <input
                type="text"
                required
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-full px-3 py-2 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold">
                COUNTRY
              </label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground mt-1"
              />
            </div>
          </div>

          {addresses.length > 0 && (
            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-muted-foreground">
                Set as default delivery address
              </span>
            </label>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={resetForm}
              disabled={isSaving}
              className="px-4 py-2 border border-accent/30 rounded-lg font-semibold text-xs disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold text-xs disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Address'
              )}
            </button>
          </div>
        </form>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <p className="text-muted-foreground text-sm">No delivery addresses saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 rounded-2xl border transition-all ${
                addr.isDefault
                  ? 'border-accent bg-accent/5'
                  : 'border-border/50 bg-secondary/10'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-xs px-2.5 py-1 rounded-full uppercase bg-secondary/80 text-foreground border border-border/30">
                  {addr.name}
                </span>
                {addr.isDefault && (
                  <span className="text-xs text-accent font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Default Address
                  </span>
                )}
              </div>
              <p className="font-semibold text-foreground text-sm">
                {addr.firstName} {addr.lastName}
              </p>
              <p className="text-muted-foreground text-xs mt-1">{addr.street}</p>
              <p className="text-muted-foreground text-xs">
                {addr.city}, {addr.state} - {addr.zip}
              </p>
              <p className="text-muted-foreground text-xs">{addr.country}</p>
              <p className="text-muted-foreground text-xs mt-2">
                Phone: {addr.phone}
              </p>

              <div className="flex items-center justify-between border-t border-border/50 pt-3 mt-4">
                {!addr.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs text-accent hover:underline font-semibold"
                  >
                    Set as default
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground font-semibold">
                    Primary Address
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEditClick(addr)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
