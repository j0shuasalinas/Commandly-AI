import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Check,
  CircleHelp,
  Eye,
  Globe,
  LoaderCircle,
  Mail,
  MessageSquareText,
  PlugZap,
  Search,
  Send,
  Settings2,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Unplug,
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Dropdown from '../../components/ui/Dropdown'
import Modal from '../../components/ui/Modal'
import {
  connectMockIntegration,
  disconnectMockIntegration,
  getStoredMockIntegrations,
  removeStoredMockIntegration,
  saveStoredMockIntegration,
  sendMockEmail,
  sendMockSms,
} from '../../lib/integrationClient'

const categories = ['All', 'Communication', 'Social', 'Reviews', 'Payments', 'Analytics', 'Automation', 'Website']
const statusFilters = ['All', 'Connected', 'Not Connected', 'Coming Soon', 'Needs Setup']

const integrationBlueprints = [
  {
    actionLabel: 'Connect',
    category: 'Communication',
    description: 'Connect a sending provider and route branded outbound email through your AI workspace.',
    details:
      'Future-ready for Resend, SendGrid, SMTP, and a backend safe send-email function.',
    key: 'email-sending',
    name: 'Email Sending',
    status: 'Needs Setup',
  },
  {
    actionLabel: 'Connect',
    category: 'Communication',
    description: 'Set up SMS-ready messaging so follow-ups and reminders can move faster.',
    details:
      'Future-ready for Twilio messaging services, outbound reminders, and approval flows.',
    key: 'phone-sms',
    name: 'Phone / SMS',
    status: 'Needs Setup',
  },
  {
    actionLabel: 'Coming Soon',
    category: 'Communication',
    description: 'Bring inbound lead replies and campaign responses into one clean inbox.',
    details: 'OAuth-based Gmail sync can be layered in later through secure server-side flows.',
    key: 'gmail',
    name: 'Gmail',
    status: 'Coming Soon',
  },
  {
    actionLabel: 'Coming Soon',
    category: 'Reviews',
    description: 'Sync reviews, profile posts, and local business activity from Google.',
    details: 'Ideal for review workflows, GBP updates, and local reputation monitoring.',
    key: 'google-business-profile',
    name: 'Google Business Profile',
    status: 'Coming Soon',
  },
  {
    actionLabel: 'Coming Soon',
    category: 'Social',
    description: 'Push captions, track engagement, and organize social publishing in one place.',
    details: 'Instagram OAuth and media publishing can be added later through backend services.',
    key: 'instagram',
    name: 'Instagram',
    status: 'Coming Soon',
  },
  {
    actionLabel: 'Coming Soon',
    category: 'Social',
    description: 'Pull comments, audience activity, and page updates into Commandly AI.',
    details: 'Useful for cross-channel social planning and social response workflows.',
    key: 'facebook',
    name: 'Facebook',
    status: 'Coming Soon',
  },
  {
    actionLabel: 'Connect',
    category: 'Payments',
    description: 'Track customer purchase signals, retention, and revenue-side automation opportunities.',
    details: 'Ready for future Stripe billing and customer lifecycle syncing.',
    key: 'stripe',
    name: 'Stripe',
    status: 'Not Connected',
  },
  {
    actionLabel: 'Connect',
    category: 'Analytics',
    description: 'Measure traffic, campaign performance, and conversion trends across the site.',
    details: 'Useful for reporting, attribution, and smarter AI-generated insights.',
    key: 'google-analytics',
    name: 'Google Analytics',
    status: 'Not Connected',
  },
  {
    actionLabel: 'Connect',
    category: 'Website',
    description: 'Capture new inquiries from forms and route them into the lead pipeline.',
    details: 'Future-ready for webhook ingestion or form service integrations.',
    key: 'website-forms',
    name: 'Website Forms',
    status: 'Not Connected',
  },
  {
    actionLabel: 'Coming Soon',
    category: 'Automation',
    description: 'Bridge Commandly AI to external workflows and no-code automations.',
    details: 'Perfect for later multi-tool workflows and background automations.',
    key: 'zapier',
    name: 'Zapier',
    status: 'Coming Soon',
  },
]

const badgeClasses = {
  Connected: 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  'Coming Soon': 'border border-amber-500/20 bg-amber-500/10 text-amber-300',
  'Needs Setup': 'border border-brand-500/20 bg-brand-500/10 text-brand-300',
  'Not Connected': 'border border-slate-500/20 bg-slate-500/10 text-slate-300',
}

const categoryIcons = {
  Analytics: Globe,
  Automation: PlugZap,
  Communication: Mail,
  Payments: ShieldAlert,
  Reviews: MessageSquareText,
  Social: Sparkles,
  Website: Globe,
}

const initialComposer = {
  channel: 'Email',
  message: '',
  recipientEmail: '',
  recipientName: '',
  recipientPhone: '',
  subject: '',
}

const initialEmailSetup = {
  apiKey: '',
  businessEmail: '',
  provider: 'Mock Email',
  replyToEmail: '',
  senderEmail: '',
  senderName: '',
}

const initialSmsSetup = {
  businessPhone: '',
  complianceConfirmed: false,
  fromNumber: '',
  provider: 'Mock SMS',
  senderName: '',
  twilioMessagingServiceSid: '',
}

const formatTimestamp = (value) => new Date(value).toLocaleString()

function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-24 right-6 z-[90] grid gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${badgeClasses[status] || badgeClasses['Not Connected']}`}>
      {status}
    </span>
  )
}

function IntegrationCard({ integration, onManage, onViewDetails }) {
  const Icon = categoryIcons[integration.category] || PlugZap
  const connected = integration.status === 'Connected'

  return (
    <Card
      className={`h-full transition duration-200 hover:-translate-y-1 ${
        connected
          ? 'border-emerald-500/20 shadow-[0_18px_40px_-26px_rgba(16,185,129,0.45)]'
          : 'hover:shadow-glow'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Icon className="h-5 w-5" />
        </div>
        <StatusBadge status={integration.status} />
      </div>

      <div className="mt-5">
        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{integration.name}</h3>
        <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
          {integration.category}
        </div>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{integration.description}</p>
      </div>

      <div className="mt-5 rounded-[1.3rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="text-sm text-slate-600 dark:text-slate-300">{integration.details}</div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onManage}
          disabled={integration.status === 'Coming Soon'}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
        >
          <Settings2 className="h-4 w-4" />
          {integration.actionLabel}
        </button>
        <button
          type="button"
          onClick={onViewDetails}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
        >
          <Eye className="h-4 w-4" />
          View Details
        </button>
      </div>
    </Card>
  )
}

function ActivityTable({ items, title }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
      {items.length > 0 ? (
        <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-[1.1fr_0.8fr_1.4fr_0.9fr] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            <span>Recipient</span>
            <span>Channel</span>
            <span>Preview</span>
            <span>Status</span>
          </div>
          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1.1fr_0.8fr_1.4fr_0.9fr] gap-4 border-b border-slate-200 px-4 py-4 text-sm text-slate-600 last:border-b-0 dark:border-slate-800 dark:text-slate-300"
            >
              <div>
                <div className="font-medium text-slate-950 dark:text-white">{item.recipient}</div>
                <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">{formatTimestamp(item.timestamp)}</div>
              </div>
              <div>{item.channel}</div>
              <div className="line-clamp-2">{item.preview}</div>
              <div>
                <StatusBadge status={item.status === 'Mock Sent' ? 'Connected' : 'Not Connected'} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-[1.4rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center dark:border-slate-800 dark:bg-slate-950">
          <div className="text-base font-semibold text-slate-900 dark:text-white">No activity yet</div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Test sends and outbound composer activity will show up here.
          </p>
        </div>
      )}
    </Card>
  )
}

function Integrations({ integrations = [] }) {
  const [searchValue, setSearchValue] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [localIntegrationState, setLocalIntegrationState] = useState({})
  const [toasts, setToasts] = useState([])
  const [emailActivity, setEmailActivity] = useState([])
  const [smsActivity, setSmsActivity] = useState([])
  const [selectedIntegration, setSelectedIntegration] = useState(null)
  const [showEmailSetup, setShowEmailSetup] = useState(false)
  const [showSmsSetup, setShowSmsSetup] = useState(false)
  const [showComposer, setShowComposer] = useState(false)
  const [showManage, setShowManage] = useState(false)
  const [emailSetup, setEmailSetup] = useState(initialEmailSetup)
  const [smsSetup, setSmsSetup] = useState(initialSmsSetup)
  const [composer, setComposer] = useState(initialComposer)
  const [loadingAction, setLoadingAction] = useState('')

  useEffect(() => {
    setLocalIntegrationState((current) => {
      const next = { ...getStoredMockIntegrations(), ...current }
      const knownKeys = new Set(integrationBlueprints.map((item) => item.key))

      integrations.forEach((integration) => {
        const mappedKey =
          integration.integration_key ||
          integration.name.toLowerCase().replace(/\s+\/\s+/g, '-').replace(/\s+/g, '-')

        if (!knownKeys.has(mappedKey)) {
          return
        }

        next[mappedKey] = {
          ...next[mappedKey],
          actionLabel: integration.action_label || next[mappedKey]?.actionLabel,
          connectedAt: next[mappedKey]?.connectedAt || null,
          status: integration.status || next[mappedKey]?.status,
        }
      })

      return next
    })
  }, [integrations])

  const pushToast = (message) => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { id, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 2400)
  }

  const computedIntegrations = useMemo(
    () =>
      integrationBlueprints.map((item) => {
        const local = localIntegrationState[item.key] || {}
        return {
          ...item,
          actionLabel:
            item.status === 'Coming Soon'
              ? 'Coming Soon'
              : local.status === 'Connected'
                ? 'Manage'
                : local.status === 'Needs Setup'
                  ? 'Configure'
                  : local.actionLabel || item.actionLabel,
          configSummary: local.configSummary || null,
          connectedAt: local.connectedAt || null,
          provider: local.provider || null,
          status: local.status || item.status,
        }
      }),
    [localIntegrationState],
  )

  const filteredIntegrations = useMemo(
    () =>
      computedIntegrations.filter((integration) => {
        const searchMatch =
          searchValue.trim().length === 0 ||
          `${integration.name} ${integration.description} ${integration.category}`
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        const categoryMatch = categoryFilter === 'All' || integration.category === categoryFilter
        const statusMatch = statusFilter === 'All' || integration.status === statusFilter
        return searchMatch && categoryMatch && statusMatch
      }),
    [categoryFilter, computedIntegrations, searchValue, statusFilter],
  )

  const emailIntegration = computedIntegrations.find((item) => item.key === 'email-sending')
  const smsIntegration = computedIntegrations.find((item) => item.key === 'phone-sms')
  const lastEmailSent = emailActivity[0]
  const lastSmsSent = smsActivity[0]

  const openIntegrationAction = (integration) => {
    setSelectedIntegration(integration)

    if (integration.key === 'email-sending') {
      if (integration.status === 'Connected') {
        setShowManage(true)
      } else {
        setShowEmailSetup(true)
      }
      return
    }

    if (integration.key === 'phone-sms') {
      if (integration.status === 'Connected') {
        setShowManage(true)
      } else {
        setShowSmsSetup(true)
      }
      return
    }

    if (integration.status === 'Coming Soon') {
      pushToast(`${integration.name} is marked coming soon.`)
      return
    }

    setLocalIntegrationState((current) => ({
      ...current,
      [integration.key]: {
        ...current[integration.key],
        actionLabel: 'Manage',
        connectedAt: new Date().toISOString(),
        status: integration.status === 'Connected' ? 'Not Connected' : 'Connected',
      },
    }))
    pushToast(
      integration.status === 'Connected'
        ? `${integration.name} disconnected.`
        : `${integration.name} connected.`,
    )
  }

  const handleViewDetails = (integration) => {
    setSelectedIntegration(integration)
    setShowManage(true)
  }

  const handleConnectEmail = async () => {
    setLoadingAction('email-connect')
    const connection = await connectMockIntegration({
      config: {
        businessEmail: emailSetup.businessEmail,
        replyToEmail: emailSetup.replyToEmail,
        senderEmail: emailSetup.senderEmail,
        senderName: emailSetup.senderName,
      },
      provider: emailSetup.provider,
    })

    setLocalIntegrationState((current) => ({
      ...current,
      'email-sending': saveStoredMockIntegration('email-sending', {
        actionLabel: 'Manage',
        configSummary: {
          businessEmail: emailSetup.businessEmail,
          replyToEmail: emailSetup.replyToEmail,
          senderEmail: emailSetup.senderEmail,
          senderName: emailSetup.senderName,
        },
        connectedAt: connection.connectedAt,
        provider: connection.provider,
        status: connection.status,
      }),
    }))
    setShowEmailSetup(false)
    setLoadingAction('')
    pushToast('Email integration connected.')
  }

  const handleConnectSms = async () => {
    setLoadingAction('sms-connect')
    const connection = await connectMockIntegration({
      config: {
        businessPhone: smsSetup.businessPhone,
        fromNumber: smsSetup.fromNumber,
        senderName: smsSetup.senderName,
      },
      provider: smsSetup.provider,
    })

    setLocalIntegrationState((current) => ({
      ...current,
      'phone-sms': saveStoredMockIntegration('phone-sms', {
        actionLabel: 'Manage',
        configSummary: {
          businessPhone: smsSetup.businessPhone,
          fromNumber: smsSetup.fromNumber,
          senderName: smsSetup.senderName,
        },
        connectedAt: connection.connectedAt,
        provider: connection.provider,
        status: connection.status,
      }),
    }))
    setShowSmsSetup(false)
    setLoadingAction('')
    pushToast('SMS integration connected.')
  }

  const handleSendTestEmail = async () => {
    if (emailIntegration?.status !== 'Connected') {
      pushToast('Connect Email Sending first.')
      return
    }

    const emailEntry = await sendMockEmail({
      body: `This is a mock test send from ${emailSetup.senderName || 'Commandly AI'}.`,
      recipientEmail: emailSetup.businessEmail || emailSetup.senderEmail || 'team@commandly.ai',
      recipientName: emailSetup.senderName || 'Workspace Team',
      subject: 'Commandly AI test email',
    })
    setEmailActivity((current) => [emailEntry, ...current])
    pushToast(emailSetup.provider === 'Mock Email' ? 'Mock email sent successfully.' : 'Test email queued.')
  }

  const handleSendTestSms = async () => {
    if (smsIntegration?.status !== 'Connected') {
      pushToast('Connect Phone / SMS first.')
      return
    }

    const smsEntry = await sendMockSms({
      message: `This is a mock SMS check from ${smsSetup.senderName || 'Commandly AI'}.`,
      recipientName: smsSetup.senderName || 'Workspace Team',
      recipientPhone: smsSetup.businessPhone || smsSetup.fromNumber || '(555) 000-0000',
    })
    setSmsActivity((current) => [smsEntry, ...current])
    pushToast(smsSetup.provider === 'Mock SMS' ? 'Mock SMS sent successfully.' : 'Test SMS queued.')
  }

  const handleAiAssist = () => {
    if (composer.channel === 'SMS') {
      setComposer((current) => ({
        ...current,
        message:
          'Hi Avery, thanks for reaching out! We’d love to help with your detailing package. Are you available this afternoon for a quick quote?',
      }))
      return
    }

    setComposer((current) => ({
      ...current,
      message:
        'Hi Avery,\n\nThanks for reaching out to us. We put together a quick overview of what your premium detailing package could look like, including the next best step to get a quote moving today.\n\nIf you’d like, reply here and we’ll send over a tailored recommendation this afternoon.\n\nBest,\nThe Commandly AI Team',
      subject: current.subject || 'Your premium detailing quote is ready',
    }))
  }

  const handleSendComposerMessage = async () => {
    if (composer.channel === 'Email') {
      if (emailIntegration?.status !== 'Connected') {
        pushToast('Connect Email Sending first.')
        return
      }

      const emailEntry = await sendMockEmail({
        body: composer.message,
        recipientEmail: composer.recipientEmail,
        recipientName: composer.recipientName,
        subject: composer.subject,
      })
      setEmailActivity((current) => [emailEntry, ...current])
      setShowComposer(false)
      setComposer(initialComposer)
      pushToast('Message sent.')
      return
    }

    if (smsIntegration?.status !== 'Connected') {
      pushToast('Connect Phone / SMS first.')
      return
    }

    const smsEntry = await sendMockSms({
      message: composer.message,
      recipientName: composer.recipientName,
      recipientPhone: composer.recipientPhone,
    })
    setSmsActivity((current) => [smsEntry, ...current])
    setShowComposer(false)
    setComposer(initialComposer)
    pushToast('Message sent.')
  }

  const handleDisconnectIntegration = async () => {
    if (!selectedIntegration) {
      return
    }

    const next = await disconnectMockIntegration()
    removeStoredMockIntegration(selectedIntegration.key)
    setLocalIntegrationState((current) => ({
      ...current,
      [selectedIntegration.key]: {
        actionLabel: selectedIntegration.key === 'email-sending' || selectedIntegration.key === 'phone-sms' ? 'Configure' : 'Connect',
        configSummary: null,
        connectedAt: next.connectedAt,
        provider: next.provider,
        status: selectedIntegration.key === 'email-sending' || selectedIntegration.key === 'phone-sms' ? 'Needs Setup' : next.status,
      },
    }))
    setShowManage(false)
    pushToast('Integration disconnected.')
  }

  return (
    <>
      <ToastStack toasts={toasts} />

      <div className="grid gap-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Integrations
            </h1>
            <p className="mt-2 max-w-3xl text-base text-slate-600 dark:text-slate-300">
              Connect email, SMS, reviews, social platforms, forms, payments, and analytics to power your AI workspace.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search integrations"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
            <Dropdown
              items={categories.map((item) => ({ id: item, label: item }))}
              label={categoryFilter}
              onSelect={(item) => setCategoryFilter(item.label)}
              className="w-full"
              triggerClassName="w-full justify-between"
            />
            <Dropdown
              items={statusFilters.map((item) => ({ id: item, label: item }))}
              label={statusFilter}
              onSelect={(item) => setStatusFilter(item.label)}
              className="w-full"
              triggerClassName="w-full justify-between"
            />
          </div>
        </div>

        <Card className="border-amber-500/20 bg-amber-50/80 dark:bg-amber-500/10">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-300" />
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-200">
                API Key Safety
              </h3>
              <p className="mt-2 text-sm leading-7 text-amber-700/90 dark:text-amber-100/90">
                API keys must be stored server-side only. Do not expose secrets in frontend code, localStorage, or Vite environment variables used by the browser.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
              {filteredIntegrations.map((integration) => (
                <IntegrationCard
                  key={integration.key}
                  integration={integration}
                  onManage={() => openIntegrationAction(integration)}
                  onViewDetails={() => handleViewDetails(integration)}
                />
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <ActivityTable items={emailActivity} title="Recent Email Activity" />
              <ActivityTable items={smsActivity} title="Recent SMS Activity" />
            </div>
          </div>

          <div className="grid gap-6">
            <Card className="bg-[linear-gradient(135deg,rgba(74,111,255,0.08),rgba(155,92,255,0.06),rgba(255,255,255,0.96))] dark:bg-[linear-gradient(135deg,rgba(74,111,255,0.10),rgba(155,92,255,0.10),rgba(15,23,42,0.96))]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                  <MessageSquareText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Communication Hub</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Send test messages, review communication health, and prepare the workspace for real-ready outbound flows.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Email status', value: emailIntegration?.status || 'Needs Setup' },
                  { label: 'SMS status', value: smsIntegration?.status || 'Needs Setup' },
                  { label: 'Last email sent', value: lastEmailSent ? formatTimestamp(lastEmailSent.timestamp) : 'No sends yet' },
                  { label: 'Last SMS sent', value: lastSmsSent ? formatTimestamp(lastSmsSent.timestamp) : 'No sends yet' },
                  { label: 'Total mock emails sent', value: `${emailActivity.length}` },
                  { label: 'Total mock SMS sent', value: `${smsActivity.length}` },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.3rem] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                      {item.label}
                    </div>
                    <div className="mt-2 text-sm font-medium text-slate-950 dark:text-white">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  Send Test Email
                </button>
                <button
                  type="button"
                  onClick={handleSendTestSms}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                >
                  <Smartphone className="h-4 w-4" />
                  Send Test SMS
                </button>
                <button
                  type="button"
                  onClick={() => setShowComposer(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  <Sparkles className="h-4 w-4" />
                  Open Message Composer
                </button>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3">
                <CircleHelp className="mt-0.5 h-5 w-5 text-brand-500" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Backend-ready notes</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    The Email Sending and Phone / SMS flows are intentionally mock-only here. When you wire real providers later, route secrets through Netlify Functions or Supabase Edge Functions instead of frontend code.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {showEmailSetup && (
        <Modal onClose={() => setShowEmailSetup(false)} title="Connect Email Sending">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Sender Name</span>
              <input
                type="text"
                value={emailSetup.senderName}
                onChange={(event) => setEmailSetup((current) => ({ ...current, senderName: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Sender Email</span>
              <input
                type="email"
                value={emailSetup.senderEmail}
                onChange={(event) => setEmailSetup((current) => ({ ...current, senderEmail: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Reply-To Email</span>
              <input
                type="email"
                value={emailSetup.replyToEmail}
                onChange={(event) => setEmailSetup((current) => ({ ...current, replyToEmail: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Business Email</span>
              <input
                type="email"
                value={emailSetup.businessEmail}
                onChange={(event) => setEmailSetup((current) => ({ ...current, businessEmail: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Provider</span>
              <Dropdown
                items={['Resend', 'SendGrid', 'SMTP', 'Mock Email'].map((item) => ({ id: item, label: item }))}
                label={emailSetup.provider}
                onSelect={(item) => setEmailSetup((current) => ({ ...current, provider: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">API Key</span>
              <input
                type="password"
                value={emailSetup.apiKey}
                onChange={(event) => setEmailSetup((current) => ({ ...current, apiKey: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
          </div>

          <div className="mt-5 rounded-[1.4rem] border border-amber-500/20 bg-amber-50/80 px-4 py-4 dark:bg-amber-500/10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-300" />
              <p className="text-sm leading-7 text-amber-700 dark:text-amber-100">
                API keys must be stored server-side only. Do not expose secrets in frontend code.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleConnectEmail}
              disabled={loadingAction === 'email-connect'}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {loadingAction === 'email-connect' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <PlugZap className="h-4 w-4" />}
              Connect Email Sending
            </button>
            <button
              type="button"
              onClick={handleSendTestEmail}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              <Send className="h-4 w-4" />
              Send Test Email
            </button>
          </div>
        </Modal>
      )}

      {showSmsSetup && (
        <Modal onClose={() => setShowSmsSetup(false)} title="Connect Phone / SMS">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Business Phone Number</span>
              <input
                type="text"
                value={smsSetup.businessPhone}
                onChange={(event) => setSmsSetup((current) => ({ ...current, businessPhone: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Default SMS Sender Name</span>
              <input
                type="text"
                value={smsSetup.senderName}
                onChange={(event) => setSmsSetup((current) => ({ ...current, senderName: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Provider</span>
              <Dropdown
                items={['Twilio', 'Mock SMS'].map((item) => ({ id: item, label: item }))}
                label={smsSetup.provider}
                onSelect={(item) => setSmsSetup((current) => ({ ...current, provider: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Twilio Messaging Service SID</span>
              <input
                type="text"
                value={smsSetup.twilioMessagingServiceSid}
                onChange={(event) => setSmsSetup((current) => ({ ...current, twilioMessagingServiceSid: event.target.value }))}
                placeholder="MGXXXXXXXXXXXXXXXX"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Twilio From Number</span>
              <input
                type="text"
                value={smsSetup.fromNumber}
                onChange={(event) => setSmsSetup((current) => ({ ...current, fromNumber: event.target.value }))}
                placeholder="+1 555 000 0000"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <label className="sm:col-span-2 flex items-start gap-3 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
              <input
                type="checkbox"
                checked={smsSetup.complianceConfirmed}
                onChange={(event) => setSmsSetup((current) => ({ ...current, complianceConfirmed: event.target.checked }))}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm leading-7 text-slate-700 dark:text-slate-300">
                I confirm I will only message customers who have opted in.
              </span>
            </label>
          </div>

          <div className="mt-5 rounded-[1.4rem] border border-amber-500/20 bg-amber-50/80 px-4 py-4 dark:bg-amber-500/10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-300" />
              <p className="text-sm leading-7 text-amber-700 dark:text-amber-100">
                Twilio secrets must be stored server-side only.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleConnectSms}
              disabled={loadingAction === 'sms-connect' || !smsSetup.complianceConfirmed}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {loadingAction === 'sms-connect' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <PlugZap className="h-4 w-4" />}
              Connect Phone / SMS
            </button>
            <button
              type="button"
              onClick={handleSendTestSms}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              <Send className="h-4 w-4" />
              Send Test SMS
            </button>
          </div>
        </Modal>
      )}

      {showComposer && (
        <Modal onClose={() => setShowComposer(false)} title="Message Composer">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Channel</span>
              <Dropdown
                items={['Email', 'SMS'].map((item) => ({ id: item, label: item }))}
                label={composer.channel}
                onSelect={(item) => setComposer((current) => ({ ...current, channel: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Recipient Name</span>
              <input
                type="text"
                value={composer.recipientName}
                onChange={(event) => setComposer((current) => ({ ...current, recipientName: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            {composer.channel === 'Email' ? (
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Recipient Email</span>
                <input
                  type="email"
                  value={composer.recipientEmail}
                  onChange={(event) => setComposer((current) => ({ ...current, recipientEmail: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>
            ) : (
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Recipient Phone</span>
                <input
                  type="text"
                  value={composer.recipientPhone}
                  onChange={(event) => setComposer((current) => ({ ...current, recipientPhone: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>
            )}
            {composer.channel === 'Email' && (
              <label className="grid gap-2 sm:col-span-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Subject</span>
                <input
                  type="text"
                  value={composer.subject}
                  onChange={(event) => setComposer((current) => ({ ...current, subject: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>
            )}
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Message</span>
              <textarea
                rows="6"
                value={composer.message}
                onChange={(event) => setComposer((current) => ({ ...current, message: event.target.value }))}
                className="w-full rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAiAssist}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              <Sparkles className="h-4 w-4" />
              AI Assist
            </button>
            <button
              type="button"
              onClick={handleSendComposerMessage}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </div>
        </Modal>
      )}

      {showManage && selectedIntegration && (
        <Modal onClose={() => setShowManage(false)} title={`Manage ${selectedIntegration.name}`}>
          <div className="grid gap-4">
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-sm font-medium text-slate-900 dark:text-white">Connection status</div>
              <div className="mt-3">
                <StatusBadge status={selectedIntegration.status} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="text-sm font-medium text-slate-900 dark:text-white">Provider</div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedIntegration.provider || 'Not configured yet'}</div>
              </div>
              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="text-sm font-medium text-slate-900 dark:text-white">Connected date</div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {selectedIntegration.connectedAt ? formatTimestamp(selectedIntegration.connectedAt) : 'No connection date yet'}
                </div>
              </div>
            </div>
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-sm font-medium text-slate-900 dark:text-white">Configuration summary</div>
              <pre className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">
                {selectedIntegration.configSummary
                  ? JSON.stringify(selectedIntegration.configSummary, null, 2)
                  : 'No stored summary yet.'}
              </pre>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={selectedIntegration.key === 'email-sending' ? handleSendTestEmail : selectedIntegration.key === 'phone-sms' ? handleSendTestSms : () => pushToast('Test action opened.')}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              <Send className="h-4 w-4" />
              Send Test
            </button>
            <button
              type="button"
              onClick={handleDisconnectIntegration}
              className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500/10"
            >
              <Unplug className="h-4 w-4" />
              Disconnect
            </button>
            <button
              type="button"
              onClick={() => {
                setShowManage(false)
                pushToast('Integration saved.')
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <Check className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}

export default Integrations
