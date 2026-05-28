// Future backend notes:
// - RESEND_API_KEY
// - SENDGRID_API_KEY
// - SMTP_HOST
// - SMTP_USER
// - SMTP_PASS
// - TWILIO_ACCOUNT_SID
// - TWILIO_AUTH_TOKEN
// - TWILIO_MESSAGING_SERVICE_SID
// - TWILIO_FROM_NUMBER
//
// These secrets must only be used in Supabase Edge Functions or Netlify Functions.
// Never expose secret keys in Vite frontend environment variables.
//
// Optional future table ideas:
// integrations:
// - id
// - user_id
// - workspace_id
// - provider
// - category
// - status
// - config jsonb
// - created_at
// - updated_at
//
// email_messages:
// - id
// - workspace_id
// - recipient_email
// - subject
// - body
// - status
// - created_at
//
// sms_messages:
// - id
// - workspace_id
// - recipient_phone
// - body
// - status
// - created_at

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))
const INTEGRATION_STORAGE_KEY = 'commandly:mock-integrations'

const readStorage = () => {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const raw = window.localStorage.getItem(INTEGRATION_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const writeStorage = (value) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(INTEGRATION_STORAGE_KEY, JSON.stringify(value))
}

export async function sendMockEmail({ recipientEmail, recipientName, subject, body }) {
  await wait(300)
  return {
    channel: 'Email',
    id: crypto.randomUUID(),
    preview: body,
    recipient: recipientName || recipientEmail || 'Unknown recipient',
    status: 'Mock Sent',
    subject: subject || 'Test email',
    timestamp: new Date().toISOString(),
  }
}

export async function sendMockSms({ recipientName, recipientPhone, message }) {
  await wait(250)
  return {
    channel: 'SMS',
    id: crypto.randomUUID(),
    preview: message,
    recipient: recipientName || recipientPhone || 'Unknown recipient',
    status: 'Mock Sent',
    timestamp: new Date().toISOString(),
  }
}

export async function connectMockIntegration({ config, provider }) {
  await wait(250)
  return {
    connectedAt: new Date().toISOString(),
    provider,
    status: 'Connected',
    summary: config,
  }
}

export async function disconnectMockIntegration() {
  await wait(150)
  return {
    connectedAt: null,
    provider: null,
    status: 'Not Connected',
    summary: null,
  }
}

export function getStoredMockIntegrations() {
  return readStorage()
}

export function getStoredMockIntegration(key) {
  return readStorage()[key] || null
}

export function saveStoredMockIntegration(key, value) {
  const current = readStorage()
  const next = {
    ...current,
    [key]: value,
  }
  writeStorage(next)
  return next[key]
}

export function removeStoredMockIntegration(key) {
  const current = readStorage()
  delete current[key]
  writeStorage(current)
}

export async function sendEmailViaBackend() {
  // TODO: Replace with POST /api/send-email or a Supabase Edge Function like send-email.
  // Body should include: to, subject, html, workspaceId
  throw new Error('Backend email sending is not connected yet.')
}

export async function sendSmsViaBackend() {
  // TODO: Replace with POST /api/send-sms or a Supabase Edge Function like send-sms.
  // Body should include: to, message, workspaceId
  throw new Error('Backend SMS sending is not connected yet.')
}
