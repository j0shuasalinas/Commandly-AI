export async function generateWorkspaceText(payload) {
  const response = await fetch('/.netlify/functions/generate-gemini-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        'The Gemini function is not available in this dev session. Use Netlify dev or deploy the site to test server-side AI generation.',
      )
    }

    throw new Error(
      data?.error ||
        'AI generation is unavailable right now. Make sure the Gemini function is configured.',
    )
  }

  return data
}
