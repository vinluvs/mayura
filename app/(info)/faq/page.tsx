'use client'

import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const FAQs = [
  {
    question: 'What is Mayura?',
    answer: 'Mayura is a premium fashion e-commerce platform that specializes in curated outfit collections. Instead of shopping individual items, you can purchase complete outfits designed by fashion experts, or mix and match individual pieces.'
  },
  {
    question: 'Can I buy individual items from an outfit?',
    answer: 'Yes! Each outfit is made up of individual products. You can choose to buy the complete outfit or select specific pieces you love. Some items may be marked as required, while others are optional.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy on all items. Items must be unworn, unwashed, and in original condition with all tags attached. Return shipping is free for orders over $100.'
  },
  {
    question: 'How long does shipping take?',
    answer: 'We offer three shipping options: Standard (5-7 business days), Express (2-3 business days), and Overnight. Processing time is typically 1-2 business days.'
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Currently, we ship within the United States. We are expanding internationally and will announce more regions soon.'
  },
  {
    question: 'How can I track my order?',
    answer: 'You can track your order in your account dashboard. You will receive a tracking number via email once your order ships.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, digital wallets, and UPI payments through our secure Razorpay checkout.'
  },
  {
    question: 'How do you choose items for your collections?',
    answer: 'Our fashion experts carefully curate each outfit to ensure perfect style harmony, versatility, and quality. We partner with premium brands and consider current trends and timeless classics.'
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/50 px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-light tracking-widest text-foreground mb-6">
              FREQUENTLY ASKED
            </h1>
            <p className="text-xl text-muted-foreground">Find answers to common questions about Mayura</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="space-y-4">
            {FAQs.map((faq, idx) => (
              <div key={idx} className="glass-sm rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 hover:bg-secondary/30 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-foreground text-left">{faq.question}</h3>
                  <ChevronDown
                    className={`w-6 h-6 text-accent flex-shrink-0 transition-transform ${
                      openIndex === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === idx && (
                  <div className="px-6 pb-6 border-t border-border/50 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
