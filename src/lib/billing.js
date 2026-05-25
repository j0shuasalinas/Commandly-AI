export async function startCheckout({ plan, userId, email }) {
  const response = await fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plan,
      userId,
      email,
    }),
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.error || 'Unable to start checkout session.')
  }

  window.location.assign(payload.url)
}

export async function openBillingPortal({ email }) {
  const response = await fetch('/.netlify/functions/create-billing-portal-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.error || 'Unable to open billing portal.')
  }

  window.location.assign(payload.url)
}
