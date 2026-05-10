'use client'

import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/50 px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-light tracking-widest text-foreground mb-6">
              CONTACT US
            </h1>
            <p className="text-xl text-muted-foreground">
              Have questions? We&apos;d love to hear from you. Get in touch with our team.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <h2 className="text-3xl font-light tracking-widest text-foreground mb-8">GET IN TOUCH</h2>

              {[
                {
                  icon: Mail,
                  label: 'Email',
                  value: 'hello@mayura.com',
                  href: 'mailto:hello@mayura.com',
                },
                {
                  icon: Phone,
                  label: 'Phone',
                  value: '+1 (234) 567-890',
                  href: 'tel:+12345678900',
                },
                {
                  icon: MapPin,
                  label: 'Address',
                  value: '123 Fashion Street, New York, NY 10001',
                  href: 'https://maps.google.com',
                },
              ].map((contact, i) => {
                const Icon = contact.icon
                return (
                  <div key={i} className="glass-sm p-6 rounded-2xl">
                    <div className="flex gap-4">
                      <Icon className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground tracking-wider uppercase mb-2">{contact.label}</p>
                        <a
                          href={contact.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-foreground hover:text-accent transition-colors"
                        >
                          {contact.value}
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="glass-sm p-8 rounded-2xl bg-accent/5">
                <h3 className="text-lg font-semibold text-foreground mb-4">BUSINESS HOURS</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                  <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-light tracking-widest text-foreground mb-8">SEND US A MESSAGE</h2>
              {submitted ? (
                <div className="glass-sm p-8 rounded-2xl text-center">
                  <div className="text-4xl mb-4">✓</div>
                  <p className="text-lg font-semibold text-foreground mb-2">Thank you for your message!</p>
                  <p className="text-muted-foreground">We&apos;ll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="glass-sm p-8 rounded-2xl space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">NAME</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">EMAIL</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">SUBJECT</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                      placeholder="What is this about?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">MESSAGE</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-border/50 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                      placeholder="Tell us more..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
