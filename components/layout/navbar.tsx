'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, ShoppingBag, User } from 'lucide-react'
import { useState } from 'react'
import { useUser } from '@/hooks/use-user'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()
  const supabase = createClient()
  
  const { session, profile } = useUser()
  const user = session?.user
  
  const isAdminUser = profile?.role === 'admin' || profile?.role === 'developer' || profile?.role === 'owner'

  const handleLogout = async () => {
    if (!supabase) return
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.warn('[v0] Error signing out:', error)
    }
    router.push('/')
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-none">
      {/* Golden Metallic Bottom Border with Glare */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent/20 overflow-hidden">
        {/* Metallic Base */}
        <div className="absolute inset-0 gold-metallic opacity-60" />
        {/* Animated Glare */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent w-[50%] -skew-x-12 animate-border-glare" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/only mayura logo.png" alt="Mayura" className="h-20 w-auto" />
            <span className="sm:inline text-xl font-light tracking-widest text-foreground">MAYURA</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/outfits" className="text-sm tracking-wide hover:text-accent transition-colors">
              OUTFITS
            </Link>
            <Link href="/about" className="text-sm tracking-wide hover:text-accent transition-colors">
              ABOUT
            </Link>
            <Link href="/contact" className="text-sm tracking-wide hover:text-accent transition-colors">
              CONTACT
            </Link>
            {isAdminUser && (
              <Link href="/admin/dashboard" className="text-sm tracking-wide text-accent font-medium hover:text-accent/80 transition-colors">
                ADMIN PANEL
              </Link>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 hover:bg-accent/10 rounded-lg transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link href="/account/dashboard" className="p-2 hover:bg-accent/10 rounded-lg transition-colors">
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:block text-sm px-4 py-2 rounded-lg border border-accent/30 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:block text-sm px-4 py-2 rounded-lg border border-accent/30 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border/50 space-y-3">
            <Link href="/outfits" className="block text-sm tracking-wide hover:text-accent transition-colors py-2">
              OUTFITS
            </Link>
            <Link href="/about" className="block text-sm tracking-wide hover:text-accent transition-colors py-2">
              ABOUT
            </Link>
            <Link href="/contact" className="block text-sm tracking-wide hover:text-accent transition-colors py-2">
              CONTACT
            </Link>
            {isAdminUser && (
              <Link href="/admin/dashboard" className="block text-sm tracking-wide text-accent font-medium hover:text-accent/80 transition-colors py-2">
                ADMIN PANEL
              </Link>
            )}
            {user ? (
              <>
                <Link href="/account/dashboard" className="block text-sm tracking-wide hover:text-accent transition-colors py-2">
                  PROFILE
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm tracking-wide hover:text-accent transition-colors py-2"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="block text-sm tracking-wide hover:text-accent transition-colors py-2">
                LOGIN
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
