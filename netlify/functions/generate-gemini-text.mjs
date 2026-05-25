const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite'

function buildSystemPrompt(payload) {
  const {
    businessType,
    goal,
    mode = 'writer',
    prompt,
    template,
    tone,
    workspaceName,
    workspaceStats,
  } = payload

  const context = [
    `You are Commandly AI, an AI business growth assistant for ${workspaceName || 'a small business workspace'}.`,
    `Business type: ${businessType || 'Small Business'}.`,
    tone ? `Preferred tone: ${tone}.` : null,
    goal ? `Business goal: ${goal}.` : null,
    template ? `Requested content type: ${template}.` : null,
    workspaceStats
      ? `Current workspace stats: leads=${workspaceStats.leads ?? 0}, campaigns=${workspaceStats.campaigns ?? 0}, drafts=${workspaceStats.drafts ?? 0}, automations=${workspaceStats.automations ?? 0}, reviews=${workspaceStats.reviews ?? 0}.`
      : null,
    mode === 'overview'
      ? 'Return concise, practical business insights in short bullet-style prose that a founder can act on immediately.'
      : 'Return polished, high-converting marketing copy with clean formatting and no markdown tables.',
    `User request: ${prompt}`,
  ]
    .filter(Boolean)
    .join('\n')

  return context
}

function extractText(data) {
  const parts = data?.candidates?.[0]?.content?.parts ?? []
  return parts
    .map((part) => part?.text || '')
    .join('\n')
    .trim()
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed.' }),
    }
  }

  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          'Gemini is not configured yet. Add GEMINI_API_KEY to your Netlify environment variables.',
      }),
    }
  }

  try {
    const payload = JSON.parse(event.body || '{}')

    if (!payload.prompt?.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'A prompt is required.' }),
      }
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: buildSystemPrompt(payload),
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: payload.mode === 'overview' ? 300 : 500,
            temperature: payload.mode === 'overview' ? 0.7 : 0.9,
          },
        }),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error:
            data?.error?.message ||
            'Gemini could not generate a response right now. Check your free-tier quota and API key.',
        }),
      }
    }

    const text = extractText(data)

    if (!text) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: 'Gemini returned an empty response. Please try again.',
        }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        text,
      }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Unexpected Gemini generation failure.',
      }),
    }
  }
}
