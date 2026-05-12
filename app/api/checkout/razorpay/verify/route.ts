import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    // Mock signature verification
    const isValid = true

    if (isValid) {
      return NextResponse.json({ verified: true })
    } else {
      return NextResponse.json({ verified: false, error: 'Invalid signature' }, { status: 400 })
    }
  } catch (error) {
    console.error('Razorpay Verify Error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
