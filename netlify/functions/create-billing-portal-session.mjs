import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async (request) => {
  if (request.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed.' }),
    }
  }

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Stripe is not configured yet.' }),
      }
    }

    const { email } = JSON.parse(request.body ?? '{}')

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Customer email is required.' }),
      }
    }

    const customers = await stripe.customers.list({
      email,
      limit: 1,
    })

    const customer = customers.data[0]

    if (!customer) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'No Stripe customer found for this email yet. Complete checkout first.',
        }),
      }
    }

    const appUrl = process.env.APP_URL || 'http://localhost:5173'

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${appUrl}/dashboard`,
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
