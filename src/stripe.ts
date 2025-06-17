import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
})

export const stripeService = {
  async createPaymentIntent(amount: number, currency: string = 'eur') {
    try {
      return await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      })
    } catch (error) {
      console.error('Stripe Payment Intent Error:', error)
      throw error
    }
  },

  async createCheckoutSession(items: Array<{ price: string; quantity: number }>) {
    try {
      return await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      })
    } catch (error) {
      console.error('Stripe Checkout Session Error:', error)
      throw error
    }
  },

  async constructEventFromPayload(payload: string, signature: string) {
    try {
      return stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || '',
      )
    } catch (error) {
      console.error('Stripe Webhook Error:', error)
      throw error
    }
  },
}

export default stripe
