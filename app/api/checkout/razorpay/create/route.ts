import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Or use regular client if RLS allows

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { amount, currency = 'INR', receipt } = body

    // Mock Razorpay Order Creation
    const mockOrder = {
      id: `order_${Math.random().toString(36).substring(2, 11)}`,
      amount: Math.round(amount * 100), // Amount in paise
      currency,
      receipt,
      status: 'created',
      created_at: Date.now(),
    }

    return NextResponse.json(mockOrder)
  } catch (error) {
    console.error('Razorpay Create Order Error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
