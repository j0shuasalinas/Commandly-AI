import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const priceMap = {
  starter: process.env.STRIPE_PRICE_STARTER_MONTHLY,
  pro: process.env.STRIPE_PRICE_PRO_MONTHLY,
  business: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
}

export default async (request) => {
  if (request.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed.' }),
    }
  }

  try {
    const { plan, userId, email } = JSON.parse(request.body ?? '{}')
    const price = priceMap[plan]

    if (!process.env.STRIPE_SECRET_KEY || !price) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Stripe is not configured yet. Add your Stripe secret key and plan price IDs.',
        }),
      }
    }

    const appUrl = process.env.APP_URL || 'http://localhost:5173'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard?checkout=canceled`,
      metadata: {
        supabase_user_id: userId ?? '',
        plan,
      },
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
