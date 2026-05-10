'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/50 mt-20">
      <div className="max-w-7xl mx-auto p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <img src="/only mayura logo.png" alt="Mayura" className="h-25 w-auto mb-4" />
            <span className="sm:inline text-xl font-light tracking-widest text-foreground">MAYURA</span>
            <p className="text-sm text-muted-foreground tracking-wide">
              Elevate your style with curated fashion outfits. Wear your form.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 tracking-wide">SHOP</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/outfits" className="text-muted-foreground hover:text-accent transition-colors">Outfits</Link></li>
              <li><Link href="/outfits?occasion=casual" className="text-muted-foreground hover:text-accent transition-colors">Casual</Link></li>
              <li><Link href="/outfits?occasion=formal" className="text-muted-foreground hover:text-accent transition-colors">Formal</Link></li>
              <li><Link href="/outfits?occasion=party" className="text-muted-foreground hover:text-accent transition-colors">Party</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 tracking-wide">INFO</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/shipping" className="text-muted-foreground hover:text-accent transition-colors">Shipping</Link></li>
              <li><Link href="/returns" className="text-muted-foreground hover:text-accent transition-colors">Returns</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 tracking-wide">CONTACT</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@mayura.com" className="hover:text-accent transition-colors">hello@mayura.com</a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <a href="tel:+1234567890" className="hover:text-accent transition-colors">+1 (234) 567-890</a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>123 Fashion Street, NYC 10001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {currentYear} Mayura. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
