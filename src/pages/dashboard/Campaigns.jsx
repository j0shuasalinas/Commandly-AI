import { useMemo, useState } from 'react'
import {
  CalendarClock,
  CalendarDays,
  Check,
  Copy,
  Eye,
  LoaderCircle,
  Megaphone,
  Plus,
  Send,
  Sparkles,
  Target,
  WandSparkles,
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Dropdown from '../../components/ui/Dropdown'
import Modal from '../../components/ui/Modal'

const channelOptions = ['All', 'Instagram', 'Email', 'SMS', 'Google Business', 'Multichannel']
const statusOptions = ['All', 'Draft', 'Scheduled', 'Active', 'Completed', 'Archived']
const businessTypes = ['Auto Detailing', 'Barbershop', 'Gym', 'Restaurant', 'Real Estate', 'Agency', 'Other']
const goalOptions = [
  'Get More Leads',
  'Promote a Sale',
  'Increase Bookings',
  'Re-engage Customers',
  'Announce an Update',
  'Grow Reviews',
]
const builderChannels = ['Instagram', 'Email', 'SMS', 'Google Business', 'Multichannel']
const toneOptions = ['Professional', 'Friendly', 'Luxury', 'Bold', 'Casual']

const defaultBuilderState = {
  campaignName: '',
  businessType: 'Auto Detailing',
  campaignGoal: 'Promote a Sale',
  campaignChannel: 'Multichannel',
  offer: '',
  targetAudience: '',
  tone: 'Professional',
  launchDate: '2026-06-06',
  notes: '',
}

const demoCampaignState = {
  campaignName: 'Weekend Detail Promo',
  businessType: 'Auto Detailing',
  campaignGoal: 'Increase Bookings',
  campaignChannel: 'Multichannel',
  offer: '20% off premium interior and exterior detailing this weekend',
  targetAudience: 'Busy professionals and families within 10 miles',
  tone: 'Professional',
  launchDate: '2026-06-06',
  notes: 'Prioritize quick booking conversions before the weekend rush.',
}

const campaignPresets = {
  'Weekend Detail Promo': {
    goal: 'Increase Bookings',
    offer: '20% off premium interior and exterior detailing this weekend',
    summary: 'Lead with a limited-time weekend offer, push fast booking action, and keep the message tailored to time-strapped vehicle owners.',
    channel: 'Multichannel',
    launchDate: 'June 6, 2026',
    stats: { reach: '12.4k', clicks: '418', conversions: '31' },
  },
  'Summer Shine Campaign': {
    goal: 'Promote a Sale',
    offer: 'Summer ceramic shine package with bonus tire gloss',
    summary: 'Position the package as a premium summer refresh with social proof and a polished seasonal hook.',
    channel: 'Instagram',
    launchDate: 'June 12, 2026',
    stats: { reach: '16.8k', clicks: '506', conversions: '37' },
  },
  'First-Time Customer Offer': {
    goal: 'Get More Leads',
    offer: '15% off first service for new customers',
    summary: 'Reduce friction with a first-visit incentive and build a quick nurture loop for first-time prospects.',
    channel: 'Email',
    launchDate: 'June 14, 2026',
    stats: { reach: '8.9k', clicks: '244', conversions: '22' },
  },
  'Review Boost Campaign': {
    goal: 'Grow Reviews',
    offer: 'Simple review request after completed service',
    summary: 'Follow up after service completion with low-friction asks and trust-building prompts to increase public reviews.',
    channel: 'Google Business',
    launchDate: 'June 18, 2026',
    stats: { reach: '6.2k', clicks: '182', conversions: '48' },
  },
  'Dormant Lead Re-Engagement': {
    goal: 'Re-engage Customers',
    offer: 'Return-customer bonus upgrade for inactive contacts',
    summary: 'Wake up old leads with a sharp reminder, a compelling comeback offer, and one clear action to book.',
    channel: 'SMS',
    launchDate: 'June 20, 2026',
    stats: { reach: '4.3k', clicks: '164', conversions: '19' },
  },
}

const plannerTemplate = [
  { day: 'Monday', title: 'Social post', channel: 'Instagram', status: 'Planned' },
  { day: 'Wednesday', title: 'Email campaign', channel: 'Email', status: 'Draft' },
  { day: 'Friday', title: 'Promo reminder', channel: 'SMS', status: 'Scheduled' },
  { day: 'Sunday', title: 'Performance review', channel: 'Analytics', status: 'Completed' },
]

const statusClasses = {
  Active: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  Archived: 'bg-slate-500/10 text-slate-300 border border-slate-500/20',
  Completed: 'bg-violet-500/10 text-violet-300 border border-violet-500/20',
  Draft: 'bg-slate-500/10 text-slate-300 border border-slate-500/20',
  Planned: 'bg-slate-500/10 text-slate-300 border border-slate-500/20',
  Ready: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  Scheduled: 'bg-brand-500/10 text-brand-300 border border-brand-500/20',
}

const sectionOrder = [
  { key: 'strategy', title: 'Strategy' },
  { key: 'socialPost', title: 'Social Post' },
  { key: 'emailCampaign', title: 'Email Campaign' },
  { key: 'smsMessage', title: 'SMS Message' },
  { key: 'googleBusinessUpdate', title: 'Google Business Update' },
  { key: 'leadFollowUp', title: 'Lead Follow-Up' },
  { key: 'postingSchedule', title: 'Posting Schedule' },
]

const fallbackText = (value, fallback) => (value?.trim() ? value.trim() : fallback)

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

const formatDisplayDate = (value) =>
  value ? new Date(`${value}T12:00:00`).toLocaleDateString() : 'Date coming soon'

const countWords = (text) => text.split(/\s+/).filter(Boolean).length

const createBundle = (form) => {
  const name = fallbackText(form.campaignName, `${form.businessType} Campaign`)
  const offer = fallbackText(form.offer, 'A limited-time premium offer this week')
  const audience = fallbackText(form.targetAudience, 'Local customers ready to take action')
  const notes = fallbackText(form.notes, 'Keep the message clear, premium, and conversion-focused.')
  const toneTag =
    form.tone === 'Luxury'
      ? 'refined and premium'
      : form.tone === 'Bold'
        ? 'direct and high-energy'
        : form.tone === 'Friendly'
          ? 'warm and approachable'
          : form.tone === 'Casual'
            ? 'relaxed and conversational'
            : 'polished and trustworthy'

  const headline = `${name}: ${offer}`
  const strategySummary = `Build a ${form.campaignChannel.toLowerCase()} campaign for ${form.businessType.toLowerCase()} buyers using a ${toneTag} angle. Focus on ${form.campaignGoal.toLowerCase()}, spotlight "${offer}," and speak directly to ${audience.toLowerCase()}. ${notes}`
  const socialPost = `${headline}\n\n${audience} can finally stop putting this off. ${offer} is available for a limited time, with a message built to move people from interest to action fast. Book now, mention this offer, and let Commandly AI turn attention into appointments.\n\n#${form.businessType.replace(/\s+/g, '')} #LocalOffer #${form.campaignGoal.replace(/\s+/g, '')} #CommandlyAI`
  const emailSubject = `${offer} for ${form.businessType} customers`
  const emailPreview = `A smarter campaign for ${audience.toLowerCase()} with one clear next step.`
  const emailBody = `Hi there,\n\nWe put together a campaign around ${offer} to help ${form.businessType.toLowerCase()} teams ${form.campaignGoal.toLowerCase()}. This message is aimed at ${audience.toLowerCase()} and leads with the strongest benefit first, then follows with a clear reason to act now.\n\nOffer: ${offer}\nLaunch date: ${formatDisplayDate(form.launchDate)}\nRecommended tone: ${form.tone}\n\nReady to move? Tap below and let’s launch this bundle.\n\nBest,\nCommandly AI`
  const smsMessage = `${offer}. Perfect for ${audience.toLowerCase()}. Reply YES to claim it before ${formatDisplayDate(form.launchDate)}.`
  const googleBusinessUpdate = `${offer} is live now for ${form.businessType.toLowerCase()} customers. If you're in the area and want a faster path to ${form.campaignGoal.toLowerCase()}, now is the time to book.`
  const leadFollowUp = `Hey! Following up on our ${name} campaign. We built this offer around ${offer} for ${audience.toLowerCase()}. If you'd like details or want to book, I can send the next step right away.`
  const hashtags = ['#LocalGrowth', '#AIWorkflow', '#CommandlyAI', `#${form.businessType.replace(/\s+/g, '')}`, `#${form.campaignGoal.replace(/\s+/g, '')}`]
  const postingSchedule = `Monday: launch the main ${form.campaignChannel === 'Multichannel' ? 'Instagram' : form.campaignChannel} message.\nWednesday: push the email follow-up with social proof.\nFriday: send a reminder with urgency around ${offer}.\nSunday: review results and prep the next optimization.`

  const offerStrength = offer.match(/\d+%/) ? 18 : 12
  const audienceStrength = audience.toLowerCase().includes('miles') ? 10 : 6
  const channelMultiplier =
    form.campaignChannel === 'Multichannel'
      ? 1.45
      : form.campaignChannel === 'Instagram'
        ? 1.18
        : form.campaignChannel === 'Email'
          ? 1.12
          : 1.06

  const estimatedReach = Math.round((5200 + offerStrength * 110 + audienceStrength * 95) * channelMultiplier)
  const estimatedClicks = Math.round(estimatedReach * 0.041)
  const estimatedConversions = Math.max(8, Math.round(estimatedClicks * 0.13))
  const estimatedRevenue = estimatedConversions * 145
  const confidenceLevel = form.campaignChannel === 'Multichannel' ? 'High' : 'Medium'

  return {
    generatedAt: new Date(),
    headline,
    meta: {
      channel: form.campaignChannel,
      goal: form.campaignGoal,
      launchDate: formatDisplayDate(form.launchDate),
      name,
      offer,
      tone: form.tone,
    },
    performance: {
      confidenceLevel,
      estimatedClicks: estimatedClicks.toLocaleString(),
      estimatedConversions: estimatedConversions.toLocaleString(),
      estimatedReach: estimatedReach.toLocaleString(),
      estimatedRevenuePotential: `$${estimatedRevenue.toLocaleString()}`,
    },
    sections: {
      emailCampaign: `Subject: ${emailSubject}\nPreview Text: ${emailPreview}\n\n${emailBody}`,
      googleBusinessUpdate,
      leadFollowUp,
      postingSchedule,
      smsMessage,
      socialPost,
      strategy: strategySummary,
    },
    shortSummary: `A ${toneTag} ${form.campaignChannel.toLowerCase()} launch focused on ${offer.toLowerCase()} for ${audience.toLowerCase()}.`,
    hashtags,
  }
}

const buildCampaignCard = (campaign) => {
  const preset = campaignPresets[campaign.name] || {}
  return {
    channel: campaign.channel || preset.channel || 'Multichannel',
    goal: preset.goal || 'Get More Leads',
    id: campaign.id,
    launchDate: campaign.scheduled_date || preset.launchDate || 'Date coming soon',
    name: campaign.name,
    offer: preset.offer || 'A timely offer designed to drive quick action',
    stats: {
      clicks: campaign.performance?.clicks || preset.stats?.clicks || '0',
      conversions: campaign.performance?.conversions || preset.stats?.conversions || '0',
      reach:
        campaign.performance?.reach ||
        campaign.performance?.impressions ||
        campaign.performance?.openRate ||
        campaign.performance?.sends ||
        preset.stats?.reach ||
        '0',
    },
    status: campaign.status || 'Draft',
    summary:
      preset.summary ||
      'A polished multichannel campaign designed to move local customers from awareness to action.',
  }
}

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
    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusClasses[status] || statusClasses.Draft}`}>
      {status}
    </span>
  )
}

function CampaignCard({ campaign, onDuplicate, onSchedule, onViewBundle }) {
  return (
    <Card className="h-full transition duration-200 hover:-translate-y-1 hover:shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-slate-950 dark:text-white">{campaign.name}</div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{campaign.channel}</span>
            <span>•</span>
            <span>{campaign.goal}</span>
            <span>•</span>
            <span>{campaign.launchDate}</span>
          </div>
        </div>
        <StatusBadge status={campaign.status} />
      </div>

      <div className="mt-5 rounded-[1.3rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
          Offer
        </div>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{campaign.offer}</p>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{campaign.summary}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Reach', value: campaign.stats.reach },
          { label: 'Clicks', value: campaign.stats.clicks },
          { label: 'Conversions', value: campaign.stats.conversions },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              {item.label}
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onViewBundle}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
        >
          <Eye className="h-4 w-4" />
          View Bundle
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
        >
          <Copy className="h-4 w-4" />
          Duplicate
        </button>
        <button
          type="button"
          onClick={onSchedule}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <CalendarClock className="h-4 w-4" />
          Schedule
        </button>
      </div>
    </Card>
  )
}

function SectionCard({ title, value, onCopy }) {
  return (
    <div className="rounded-[1.4rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
            {title}
          </div>
          <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            {countWords(value)} words
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="Ready" />
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </button>
        </div>
      </div>
      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">{value}</p>
    </div>
  )
}

function Campaigns({ campaigns = [], loading, onCreateCampaign }) {
  const [selectedChannel, setSelectedChannel] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [builderForm, setBuilderForm] = useState(defaultBuilderState)
  const [bundle, setBundle] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [actionLoading, setActionLoading] = useState('')
  const [upcomingCampaigns, setUpcomingCampaigns] = useState([])
  const [toasts, setToasts] = useState([])
  const [scheduleForm, setScheduleForm] = useState({
    approvalRequired: true,
    campaignName: '',
    channel: 'All Channels',
    date: '2026-06-06',
    time: '09:00',
  })
  const [createDraftForm, setCreateDraftForm] = useState({
    campaignName: '',
    campaignType: 'Instagram',
    channel: 'Instagram',
    goal: 'Promote a Sale',
    launchDate: '2026-06-06',
    offer: '',
    tone: 'Professional',
  })

  const pushToast = (message) => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { id, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 2400)
  }

  const campaignCards = useMemo(() => campaigns.map(buildCampaignCard), [campaigns])

  const filteredCampaigns = useMemo(
    () =>
      campaignCards.filter((campaign) => {
        const channelMatch = selectedChannel === 'All' || campaign.channel === selectedChannel
        const statusMatch = statusFilter === 'All' || campaign.status === statusFilter
        return channelMatch && statusMatch
      }),
    [campaignCards, selectedChannel, statusFilter],
  )

  const plannerItems = useMemo(
    () =>
      plannerTemplate.map((item, index) => ({
        ...item,
        linkedCampaign: campaignCards[index]?.name || 'AI campaign block',
      })),
    [campaignCards],
  )

  const performancePreview = bundle?.performance || {
    confidenceLevel: 'Medium',
    estimatedClicks: '0',
    estimatedConversions: '0',
    estimatedReach: '0',
    estimatedRevenuePotential: '$0',
  }

  const generateBundle = async (formValues) => {
    setGenerating(true)
    await wait(1000)
    const nextBundle = createBundle(formValues)
    setBundle(nextBundle)
    setScheduleForm((current) => ({
      ...current,
      campaignName: formValues.campaignName || 'Campaign Bundle',
      channel: formValues.campaignChannel === 'Multichannel' ? 'All Channels' : formValues.campaignChannel,
      date: formValues.launchDate,
    }))
    setGenerating(false)
    pushToast('Campaign bundle generated.')
    return nextBundle
  }

  const handleCopySection = async (value) => {
    await navigator.clipboard.writeText(value)
    pushToast('Campaign copied.')
  }

  const handleCopyFullCampaign = async () => {
    if (!bundle) return
    const fullText = [
      `Campaign Headline: ${bundle.headline}`,
      ...sectionOrder.map(({ key, title }) => `${title}:\n${bundle.sections[key]}`),
      `Suggested Hashtags:\n${bundle.hashtags.join(' ')}`,
    ].join('\n\n')
    await navigator.clipboard.writeText(fullText)
    pushToast('Campaign copied.')
  }

  const handleSaveCampaign = async () => {
    if (!bundle) return
    setActionLoading('save')
    try {
      await onCreateCampaign?.({
        channel: bundle.meta.channel,
        name: bundle.meta.name,
        performance: {
          clicks: bundle.performance.estimatedClicks,
          conversions: bundle.performance.estimatedConversions,
          reach: bundle.performance.estimatedReach,
        },
        scheduled_date: bundle.meta.launchDate,
        status: 'Draft',
      })
      pushToast('Campaign saved.')
    } finally {
      setActionLoading('')
    }
  }

  const handleSendToCalendar = () => {
    pushToast('Campaign sent to calendar.')
  }

  const handleCreateFollowUpTasks = () => {
    pushToast('Follow-up tasks created.')
  }

  const handleDuplicateCampaign = async (campaign) => {
    await onCreateCampaign?.({
      channel: campaign.channel,
      name: `${campaign.name} Copy`,
      performance: campaign.stats,
      scheduled_date: campaign.launchDate,
      status: 'Draft',
    })
    pushToast('Campaign duplicated.')
  }

  const handleViewBundle = async (campaign) => {
    const presetForm = {
      campaignChannel: campaign.channel === 'Social Media' ? 'Instagram' : campaign.channel,
      campaignGoal: campaign.goal,
      campaignName: campaign.name,
      businessType: builderForm.businessType,
      launchDate: '2026-06-08',
      notes: campaign.summary,
      offer: campaign.offer,
      targetAudience: 'Local customers ready to book this week',
      tone: 'Professional',
    }
    setBuilderForm((current) => ({
      ...current,
      ...presetForm,
    }))
    await generateBundle(presetForm)
  }

  const openScheduleModal = (campaign) => {
    setScheduleForm({
      approvalRequired: true,
      campaignName: campaign?.name || bundle?.meta.name || builderForm.campaignName || 'Campaign Bundle',
      channel:
        campaign?.channel === 'Multichannel'
          ? 'All Channels'
          : campaign?.channel || (bundle?.meta.channel === 'Multichannel' ? 'All Channels' : bundle?.meta.channel) || 'All Channels',
      date: builderForm.launchDate || '2026-06-06',
      time: '09:00',
    })
    setShowScheduleModal(true)
  }

  const handleScheduleCampaign = () => {
    setUpcomingCampaigns((current) => [
      {
        id: crypto.randomUUID(),
        name: scheduleForm.campaignName,
        channel: scheduleForm.channel,
        scheduledAt: `${formatDisplayDate(scheduleForm.date)} at ${scheduleForm.time}`,
        status: 'Scheduled',
      },
      ...current,
    ])
    setShowScheduleModal(false)
    pushToast('Campaign scheduled successfully.')
  }

  const handleLoadDemoCampaign = async () => {
    setBuilderForm(demoCampaignState)
    await generateBundle(demoCampaignState)
  }

  const handleCreateDraft = async () => {
    await onCreateCampaign?.({
      channel: createDraftForm.channel,
      name: createDraftForm.campaignName || 'Campaign Draft',
      performance: { clicks: '0', conversions: '0', reach: '0' },
      scheduled_date: formatDisplayDate(createDraftForm.launchDate),
      status: 'Draft',
    })
    setShowCreateModal(false)
    pushToast('Campaign saved.')
  }

  const handleGenerateFromModal = async () => {
    setShowCreateModal(false)
    const nextForm = {
      campaignChannel: createDraftForm.channel === 'Social Media' ? 'Instagram' : createDraftForm.channel,
      campaignGoal: createDraftForm.goal,
      campaignName: createDraftForm.campaignName,
      businessType: builderForm.businessType,
      launchDate: createDraftForm.launchDate,
      notes: '',
      offer: createDraftForm.offer,
      targetAudience: builderForm.targetAudience || 'Local customers ready for a timely offer',
      tone: createDraftForm.tone,
    }
    setBuilderForm((current) => ({ ...current, ...nextForm }))
    await generateBundle(nextForm)
  }

  const upcomingItems = [...upcomingCampaigns]

  return (
    <>
      <ToastStack toasts={toasts} />

      <div className="grid gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Campaigns
              </h1>
              <span className="rounded-full border border-brand-300/60 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200">
                AI Campaign Builder
              </span>
            </div>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
              Create full marketing campaigns for social, email, SMS, and Google Business from one AI workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Dropdown
              items={channelOptions.map((item) => ({ id: item, label: item }))}
              label={selectedChannel}
              onSelect={(item) => setSelectedChannel(item.label)}
            />
            <Dropdown
              items={statusOptions.map((item) => ({ id: item, label: item }))}
              label={statusFilter}
              onSelect={(item) => setStatusFilter(item.label)}
            />
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <Plus className="h-4 w-4" />
              Create Campaign
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-6">
            <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(74,111,255,0.10),rgba(155,92,255,0.06),rgba(255,255,255,0.92))] dark:bg-[linear-gradient(135deg,rgba(74,111,255,0.12),rgba(155,92,255,0.10),rgba(15,23,42,0.92))]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                      <WandSparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                        AI Campaign Builder
                      </h2>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Build a complete campaign bundle from one offer, one audience, and one launch plan.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLoadDemoCampaign}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:text-white"
                >
                  <Sparkles className="h-4 w-4" />
                  Load Demo Campaign
                </button>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Campaign Name</span>
                  <input
                    type="text"
                    value={builderForm.campaignName}
                    onChange={(event) => setBuilderForm((current) => ({ ...current, campaignName: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Weekend Detail Promo"
                  />
                </label>

                <div className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Business Type</span>
                  <Dropdown
                    items={businessTypes.map((item) => ({ id: item, label: item }))}
                    label={builderForm.businessType}
                    onSelect={(item) => setBuilderForm((current) => ({ ...current, businessType: item.label }))}
                    triggerClassName="w-full justify-between"
                    className="w-full"
                  />
                </div>

                <div className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Campaign Goal</span>
                  <Dropdown
                    items={goalOptions.map((item) => ({ id: item, label: item }))}
                    label={builderForm.campaignGoal}
                    onSelect={(item) => setBuilderForm((current) => ({ ...current, campaignGoal: item.label }))}
                    triggerClassName="w-full justify-between"
                    className="w-full"
                  />
                </div>

                <div className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Campaign Channel</span>
                  <Dropdown
                    items={builderChannels.map((item) => ({ id: item, label: item }))}
                    label={builderForm.campaignChannel}
                    onSelect={(item) => setBuilderForm((current) => ({ ...current, campaignChannel: item.label }))}
                    triggerClassName="w-full justify-between"
                    className="w-full"
                  />
                </div>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Offer</span>
                  <input
                    type="text"
                    value={builderForm.offer}
                    onChange={(event) => setBuilderForm((current) => ({ ...current, offer: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="20% off premium detailing this weekend"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Target Audience</span>
                  <input
                    type="text"
                    value={builderForm.targetAudience}
                    onChange={(event) => setBuilderForm((current) => ({ ...current, targetAudience: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Busy professionals within 10 miles"
                  />
                </label>

                <div className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Tone</span>
                  <Dropdown
                    items={toneOptions.map((item) => ({ id: item, label: item }))}
                    label={builderForm.tone}
                    onSelect={(item) => setBuilderForm((current) => ({ ...current, tone: item.label }))}
                    triggerClassName="w-full justify-between"
                    className="w-full"
                  />
                </div>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Launch Date</span>
                  <input
                    type="date"
                    value={builderForm.launchDate}
                    onChange={(event) => setBuilderForm((current) => ({ ...current, launchDate: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  />
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Campaign Notes</span>
                  <textarea
                    rows="4"
                    value={builderForm.notes}
                    onChange={(event) => setBuilderForm((current) => ({ ...current, notes: event.target.value }))}
                    className="w-full rounded-[1.4rem] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition focus:border-brand-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Add any timing notes, positioning cues, or approval reminders."
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => generateBundle(builderForm)}
                disabled={generating}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                {generating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {generating ? 'Generating Bundle...' : 'Generate Campaign Bundle'}
              </button>
            </Card>

            <Card className="bg-slate-50 dark:bg-slate-950">
              {!bundle ? (
                <div className="rounded-[1.6rem] border border-dashed border-slate-200 bg-white/80 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900/80">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">
                    Generate your first campaign bundle
                  </h3>
                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Generate your first campaign bundle to create social posts, emails, SMS messages, Google updates, and follow-ups from one place.
                  </p>
                  <button
                    type="button"
                    onClick={handleLoadDemoCampaign}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:text-white"
                  >
                    <Sparkles className="h-4 w-4" />
                    Load Demo Campaign
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                          {bundle.headline}
                        </h3>
                        <StatusBadge status="Ready" />
                      </div>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {bundle.meta.channel} • {bundle.meta.goal} • Launch {bundle.meta.launchDate}
                      </p>
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      Generated {bundle.generatedAt.toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    {sectionOrder.map((section) => (
                      <SectionCard
                        key={section.key}
                        title={section.title}
                        value={bundle.sections[section.key]}
                        onCopy={() => handleCopySection(bundle.sections[section.key])}
                      />
                    ))}
                  </div>

                  <div className="mt-6 rounded-[1.4rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                      Suggested Hashtags
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                      {bundle.hashtags.join(' ')}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleCopyFullCampaign}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Full Campaign
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCampaign}
                      disabled={actionLoading === 'save'}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                    >
                      {actionLoading === 'save' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Save Campaign
                    </button>
                    <button
                      type="button"
                      onClick={() => openScheduleModal()}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                    >
                      <CalendarClock className="h-4 w-4" />
                      Schedule Campaign
                    </button>
                    <button
                      type="button"
                      onClick={handleSendToCalendar}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                    >
                      <Send className="h-4 w-4" />
                      Send to Calendar
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateFollowUpTasks}
                      className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                      <Megaphone className="h-4 w-4" />
                      Create Follow-Up Tasks
                    </button>
                  </div>
                </div>
              )}
            </Card>

            <div className="grid gap-6 xl:grid-cols-2">
              {loading ? (
                <Card className="xl:col-span-2">
                  <div className="flex items-center justify-center py-12">
                    <LoaderCircle className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
                </Card>
              ) : filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onDuplicate={() => handleDuplicateCampaign(campaign)}
                    onSchedule={() => openScheduleModal(campaign)}
                    onViewBundle={() => handleViewBundle(campaign)}
                  />
                ))
              ) : (
                <Card className="xl:col-span-2 text-center">
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">No campaigns yet</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Create your first campaign draft and saved launches will start showing up here.
                  </p>
                </Card>
              )}
            </div>
          </div>

          <div className="grid gap-6">
            <Card>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-brand-500" />
                <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Upcoming Campaigns</h3>
              </div>
              {upcomingItems.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {upcomingItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <StatusBadge status={item.status} />
                          <div className="mt-3 font-medium text-slate-950 dark:text-white">{item.name}</div>
                          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {item.channel} • {item.scheduledAt}
                          </div>
                        </div>
                        <Dropdown
                          items={[
                            { id: 'view', label: 'View' },
                            { id: 'edit', label: 'Edit' },
                            { id: 'reschedule', label: 'Reschedule' },
                            { id: 'cancel', label: 'Cancel' },
                          ]}
                          label="Actions"
                          onSelect={(action) => {
                            if (action.id === 'cancel') {
                              setUpcomingCampaigns((current) => current.filter((entry) => entry.id !== item.id))
                              pushToast('Campaign deleted.')
                            } else if (action.id === 'reschedule') {
                              openScheduleModal({ name: item.name, channel: item.channel })
                            } else {
                              pushToast(`Upcoming campaign: ${action.label.toLowerCase()}.`)
                            }
                          }}
                          showChevron={false}
                          triggerClassName="rounded-full px-3 py-2 text-xs font-semibold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-[1.4rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center dark:border-slate-800 dark:bg-slate-950">
                  <div className="text-base font-semibold text-slate-900 dark:text-white">No upcoming campaigns</div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Scheduled launches will appear here once you send a bundle into the planner.
                  </p>
                </div>
              )}
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-brand-500" />
                <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Campaign Planner</h3>
              </div>
              <div className="mt-5 space-y-3">
                {plannerItems.map((item) => (
                  <div
                    key={item.day}
                    className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                          {item.day}
                        </div>
                        <div className="mt-2 font-medium text-slate-950 dark:text-white">{item.title}</div>
                        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {item.channel} • {item.linkedCampaign}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={item.status} />
                        <button
                          type="button"
                          onClick={() => pushToast('Planner item opened.')}
                          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-brand-500" />
                <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Performance Preview</h3>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                These projections are mock AI estimates based on your campaign type, offer, and audience.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Estimated Reach', value: performancePreview.estimatedReach },
                  { label: 'Estimated Clicks', value: performancePreview.estimatedClicks },
                  { label: 'Estimated Conversions', value: performancePreview.estimatedConversions },
                  { label: 'Estimated Revenue Potential', value: performancePreview.estimatedRevenuePotential },
                  { label: 'Confidence Level', value: performancePreview.confidenceLevel },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.3rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                      {item.label}
                    </div>
                    <div className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)} title="Create Campaign Draft">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Campaign name</span>
              <input
                type="text"
                value={createDraftForm.campaignName}
                onChange={(event) => setCreateDraftForm((current) => ({ ...current, campaignName: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>

            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Campaign type</span>
              <Dropdown
                items={builderChannels.map((item) => ({ id: item, label: item }))}
                label={createDraftForm.campaignType}
                onSelect={(item) => setCreateDraftForm((current) => ({ ...current, campaignType: item.label, channel: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Goal</span>
              <Dropdown
                items={goalOptions.map((item) => ({ id: item, label: item }))}
                label={createDraftForm.goal}
                onSelect={(item) => setCreateDraftForm((current) => ({ ...current, goal: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>

            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Offer</span>
              <input
                type="text"
                value={createDraftForm.offer}
                onChange={(event) => setCreateDraftForm((current) => ({ ...current, offer: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Launch date</span>
              <input
                type="date"
                value={createDraftForm.launchDate}
                onChange={(event) => setCreateDraftForm((current) => ({ ...current, launchDate: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>

            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Tone</span>
              <Dropdown
                items={toneOptions.map((item) => ({ id: item, label: item }))}
                label={createDraftForm.tone}
                onSelect={(item) => setCreateDraftForm((current) => ({ ...current, tone: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="inline-flex rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateDraft}
              className="inline-flex rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              Create Draft
            </button>
            <button
              type="button"
              onClick={handleGenerateFromModal}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <Sparkles className="h-4 w-4" />
              Generate with AI
            </button>
          </div>
        </Modal>
      )}

      {showScheduleModal && (
        <Modal onClose={() => setShowScheduleModal(false)} title="Schedule Campaign">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Campaign name</span>
              <input
                type="text"
                value={scheduleForm.campaignName}
                onChange={(event) => setScheduleForm((current) => ({ ...current, campaignName: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>

            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Channel</span>
              <Dropdown
                items={['Instagram', 'Email', 'SMS', 'Google Business', 'All Channels'].map((item) => ({ id: item, label: item }))}
                label={scheduleForm.channel}
                onSelect={(item) => setScheduleForm((current) => ({ ...current, channel: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Date</span>
              <input
                type="date"
                value={scheduleForm.date}
                onChange={(event) => setScheduleForm((current) => ({ ...current, date: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Time</span>
              <input
                type="time"
                value={scheduleForm.time}
                onChange={(event) => setScheduleForm((current) => ({ ...current, time: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>

            <label className="sm:col-span-2 flex items-center justify-between rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">Require approval before publishing</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Keep this on if a manager should review the campaign first.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setScheduleForm((current) => ({ ...current, approvalRequired: !current.approvalRequired }))}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                  scheduleForm.approvalRequired ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                    scheduleForm.approvalRequired ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>

          <button
            type="button"
            onClick={handleScheduleCampaign}
            className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Schedule Campaign
          </button>
        </Modal>
      )}
    </>
  )
}

export default Campaigns
