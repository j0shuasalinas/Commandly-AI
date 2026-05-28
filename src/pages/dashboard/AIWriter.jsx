import { useMemo, useState } from 'react'
import {
  CalendarClock,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  FileText,
  LoaderCircle,
  Mail,
  Megaphone,
  Save,
  Sparkles,
  Trash2,
  WandSparkles,
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Dropdown from '../../components/ui/Dropdown'
import Modal from '../../components/ui/Modal'

const templateOptions = [
  'Instagram Caption',
  'Google Ad',
  'Email Campaign',
  'Website Copy',
  'Blog Idea',
  'Promotional Text',
]

const toneOptions = ['Professional', 'Friendly', 'Luxury', 'Bold', 'Casual']

const goalOptions = [
  'Get More Leads',
  'Promote a Sale',
  'Announce an Update',
  'Improve Retention',
  'Increase Bookings',
]

const workflowActions = [
  { id: 'regenerate', label: 'Regenerate' },
  { id: 'shorter', label: 'Make Shorter' },
  { id: 'luxury', label: 'Make More Luxury' },
  { id: 'sales', label: 'Make More Sales-Focused' },
  { id: 'email', label: 'Turn Into Email' },
]

const templateToChannel = {
  'Email Campaign': 'Email',
  'Google Ad': 'Google Ads',
  'Instagram Caption': 'Social Media',
  'Promotional Text': 'SMS',
  'Website Copy': 'Local Promo',
  'Blog Idea': 'Social Media',
}

const normalizeSectionTitle = (title) => {
  if (title.toLowerCase() === 'cta') {
    return 'Call To Action'
  }

  return title
}

const parseOutputSections = (text) => {
  if (!text) {
    return []
  }

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const sections = []
  let currentSection = null

  lines.forEach((line) => {
    const match = line.match(/^([A-Za-z0-9 ]+):\s*(.*)$/)

    if (match) {
      currentSection = {
        title: normalizeSectionTitle(match[1].trim()),
        body: match[2].trim(),
      }
      sections.push(currentSection)
      return
    }

    if (currentSection) {
      currentSection.body = `${currentSection.body}\n${line}`.trim()
      return
    }

    sections.push({
      title: 'Output',
      body: line,
    })
  })

  return sections
}

const buildTextFromSections = (sections) =>
  sections.map((section) => `${section.title}: ${section.body}`).join('\n\n')

const getSectionBody = (sections, title) =>
  sections.find((section) => section.title === title)?.body || ''

const shortenText = (text, limit) => {
  if (!text) {
    return text
  }

  if (text.length <= limit) {
    return text
  }

  return `${text.slice(0, limit).trim()}...`
}

const transformSections = (sections, action) => {
  const nextSections = sections.map((section) => ({ ...section }))

  if (action === 'shorter') {
    return nextSections.map((section) => ({
      ...section,
      body:
        section.title === 'Primary Copy'
          ? shortenText(section.body, 150)
          : section.title.includes('Alt Copy')
            ? shortenText(section.body, 85)
            : section.title === 'Hashtags'
              ? section.body
              : shortenText(section.body, 60),
    }))
  }

  if (action === 'luxury') {
    return nextSections.map((section) => ({
      ...section,
      body:
        section.title === 'Headline'
          ? `Elevated ${section.body}`
          : section.title === 'Call To Action'
            ? `Reserve your premium experience today.`
            : section.title === 'Hashtags'
              ? '#LuxuryService #PremiumExperience #RefinedBrand #WhiteGloveCare'
              : `${section.body} Designed for discerning customers who value a premium, refined experience.`,
    }))
  }

  if (action === 'sales') {
    return nextSections.map((section) => ({
      ...section,
      body:
        section.title === 'Call To Action'
          ? 'Book now and lock in your offer before spots fill up.'
          : section.title === 'Hashtags'
            ? '#BookNow #LimitedOffer #GetMoreLeads #HighConvertingCopy'
            : `${section.body} Make the next step feel obvious and easy to take today.`,
    }))
  }

  if (action === 'email') {
    return [
      {
        title: 'Headline',
        body: getSectionBody(nextSections, 'Headline') || 'Premium offer for busy customers',
      },
      {
        title: 'Subject Line',
        body: `A better way to ${getSectionBody(nextSections, 'Headline').toLowerCase() || 'reach your goals'}`,
      },
      {
        title: 'Preview Text',
        body: shortenText(getSectionBody(nextSections, 'Primary Copy'), 90),
      },
      {
        title: 'Primary Copy',
        body: `${getSectionBody(nextSections, 'Primary Copy')}\n\n${getSectionBody(nextSections, 'Alt Copy 1')}`,
      },
      {
        title: 'Call To Action',
        body: getSectionBody(nextSections, 'Call To Action') || 'Reply today to get started.',
      },
    ]
  }

  if (action === 'regenerate') {
    return [
      {
        title: 'Headline',
        body: `${getSectionBody(nextSections, 'Headline') || 'Fresh campaign angle'} - Variation 2`,
      },
      {
        title: 'Primary Copy',
        body: `${getSectionBody(nextSections, 'Alt Copy 1') || getSectionBody(nextSections, 'Primary Copy')} This version leads with a cleaner hook and a sharper benefit for action-oriented readers.`,
      },
      {
        title: 'Alt Copy 1',
        body: getSectionBody(nextSections, 'Alt Copy 2') || getSectionBody(nextSections, 'Primary Copy'),
      },
      {
        title: 'Alt Copy 2',
        body: 'Built for speed, clarity, and stronger conversion intent without losing brand polish.',
      },
      {
        title: 'Call To Action',
        body: getSectionBody(nextSections, 'Call To Action') || 'Take the next step today.',
      },
      {
        title: 'Hashtags',
        body: getSectionBody(nextSections, 'Hashtags'),
      },
    ].filter((section) => section.body)
  }

  return nextSections
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

function OutputSectionCard({ section }) {
  const characterCount = section.body.length
  const hashtagCount =
    section.title === 'Hashtags'
      ? (section.body.match(/#[A-Za-z0-9_]+/g) || []).length
      : null

  return (
    <div className="rounded-[1.3rem] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
          {section.title}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {hashtagCount !== null ? `${hashtagCount} hashtags` : `${characterCount} chars`}
        </span>
      </div>
      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">
        {section.body}
      </p>
    </div>
  )
}

function PlatformPreview({ sections, template, workspaceName }) {
  const headline = getSectionBody(sections, 'Headline')
  const primaryCopy = getSectionBody(sections, 'Primary Copy')
  const altCopy1 = getSectionBody(sections, 'Alt Copy 1')
  const callToAction = getSectionBody(sections, 'Call To Action')
  const hashtags = getSectionBody(sections, 'Hashtags')
  const subjectLine = getSectionBody(sections, 'Subject Line') || headline
  const previewText = getSectionBody(sections, 'Preview Text') || shortenText(primaryCopy, 90)

  return (
    <Card className="bg-slate-50 dark:bg-slate-950">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-brand-500" />
        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Platform Preview</h3>
      </div>

      {template === 'Instagram Caption' && (
        <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-violet-500" />
            <div>
              <div className="font-medium text-slate-900 dark:text-white">{workspaceName}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Sponsored</div>
            </div>
          </div>
          <div className="mt-4 h-44 rounded-[1.3rem] bg-[linear-gradient(135deg,rgba(74,111,255,0.18),rgba(155,92,255,0.18))] dark:bg-[linear-gradient(135deg,rgba(74,111,255,0.22),rgba(155,92,255,0.22))]" />
          <div className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">{headline}</div>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{primaryCopy || altCopy1}</p>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">1,248 likes · 42 comments</div>
          <div className="mt-2 text-sm text-brand-600 dark:text-brand-300">{hashtags}</div>
        </div>
      )}

      {template === 'Google Ad' && (
        <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-emerald-600 dark:text-emerald-400">www.commandly-demo.com</div>
          <div className="mt-2 text-xl font-medium text-brand-600 dark:text-brand-300">{headline}</div>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{shortenText(primaryCopy || altCopy1, 160)}</p>
          <div className="mt-3 text-sm font-medium text-slate-900 dark:text-white">{callToAction}</div>
        </div>
      )}

      {template === 'Email Campaign' && (
        <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Subject</div>
          <div className="mt-1 font-semibold text-slate-900 dark:text-white">{subjectLine}</div>
          <div className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Preview text</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{previewText}</div>
          <div className="mt-4 rounded-[1.2rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-lg font-semibold text-slate-900 dark:text-white">{headline}</div>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{primaryCopy}</p>
            <button className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
              {callToAction || 'Learn More'}
            </button>
          </div>
        </div>
      )}

      {template === 'Website Copy' && (
        <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="bg-[linear-gradient(135deg,rgba(74,111,255,0.16),rgba(155,92,255,0.16))] px-6 py-10">
            <div className="max-w-lg text-3xl font-semibold text-slate-950 dark:text-white">{headline}</div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-700 dark:text-slate-300">{primaryCopy}</p>
            <button className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
              {callToAction || 'Get Started'}
            </button>
          </div>
        </div>
      )}

      {template === 'Blog Idea' && (
        <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xl font-semibold text-slate-900 dark:text-white">{headline || 'Blog outline preview'}</div>
          <div className="mt-4 grid gap-3">
            {[primaryCopy, altCopy1, getSectionBody(sections, 'Alt Copy 2')].filter(Boolean).map((item, index) => (
              <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                Section {index + 1}: {shortenText(item, 120)}
              </div>
            ))}
          </div>
        </div>
      )}

      {template === 'Promotional Text' && (
        <div className="mt-5 rounded-[1.6rem] border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-5 dark:border-slate-800 dark:from-brand-500/10 dark:to-slate-900">
          <div className="text-xs uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Limited promotion</div>
          <div className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{headline}</div>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{primaryCopy}</p>
          <div className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
            {callToAction || 'Claim Offer'}
          </div>
        </div>
      )}
    </Card>
  )
}

function DraftCard({ draft, isActive, onDelete, onDuplicate, onLoad }) {
  const [open, setOpen] = useState(false)
  const sections = useMemo(() => parseOutputSections(draft.output), [draft.output])

  return (
    <div
      className={`rounded-[1.4rem] border p-4 transition ${
        isActive
          ? 'border-brand-300 bg-brand-50/40 shadow-glow dark:border-brand-500/30 dark:bg-brand-500/10'
          : 'border-slate-200 bg-slate-50 hover:-translate-y-0.5 hover:border-brand-200 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-brand-500/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <button type="button" onClick={onLoad} className="flex flex-1 items-start gap-3 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-slate-900 dark:text-white">{draft.title}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {draft.template || 'Draft'} - {draft.tone || 'Tone'}
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {sections[0]?.body || draft.output}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
          >
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="group rounded-xl p-2 text-slate-400 transition duration-200 hover:-translate-y-0.5 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
            aria-label="Delete draft"
          >
            <Trash2 className="h-4 w-4 transition group-hover:scale-110" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onLoad}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
        >
          Load
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
        >
          Duplicate
        </button>
      </div>

      {open && (
        <div className="mt-4 grid gap-3">
          {sections.map((section, index) => (
            <div
              key={`${draft.id}-${section.title}-${index}`}
              className="rounded-[1.2rem] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                {section.title}
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AIWriter({
  drafts = [],
  onDeleteDraft,
  onDuplicateDraft,
  onGenerate,
  onSaveDraft,
  onSendToCampaigns,
  workspace,
}) {
  const [template, setTemplate] = useState(templateOptions[0])
  const [tone, setTone] = useState(workspace?.brand_voice || toneOptions[0])
  const [goal, setGoal] = useState(goalOptions[0])
  const [prompt, setPrompt] = useState('')
  const [generated, setGenerated] = useState('')
  const [generatedAt, setGeneratedAt] = useState(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')
  const [error, setError] = useState('')
  const [activeDraftId, setActiveDraftId] = useState(null)
  const [toasts, setToasts] = useState([])
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleForm, setScheduleForm] = useState({
    campaignName: '',
    channel: 'Email',
    date: '2026-06-05',
    time: '09:00',
  })

  const pushToast = (message) => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { id, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 2400)
  }

  const output = useMemo(() => {
    if (!generated) {
      return ''
    }

    return `${template} - ${tone} tone - ${goal}\n\n${generated}`
  }, [generated, goal, template, tone])

  const outputSections = useMemo(() => parseOutputSections(generated), [generated])

  const outputMetadata = useMemo(
    () => ({
      altCopy: getSectionBody(outputSections, 'Alt Copy 1').length + getSectionBody(outputSections, 'Alt Copy 2').length,
      callToAction: getSectionBody(outputSections, 'Call To Action').length,
      hashtags: (getSectionBody(outputSections, 'Hashtags').match(/#[A-Za-z0-9_]+/g) || []).length,
      headline: getSectionBody(outputSections, 'Headline').length,
      primaryCopy: getSectionBody(outputSections, 'Primary Copy').length,
    }),
    [outputSections],
  )

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setCopied(false)
    setActiveDraftId(null)

    try {
      const response = await onGenerate?.({
        goal,
        mode: 'writer',
        prompt,
        template,
        tone,
      })

      setGenerated(response?.text || '')
      setGeneratedAt(new Date())
      setScheduleForm((current) => ({
        ...current,
        campaignName: `${template} Launch`,
        channel: templateToChannel[template] || 'Social Media',
      }))
    } catch (nextError) {
      setError(nextError.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTransform = async (actionId) => {
    if (!generated) {
      return
    }

    setActionLoading(actionId)
    setError('')

    try {
      if (actionId === 'regenerate') {
        try {
          const response = await onGenerate?.({
            goal,
            mode: 'writer',
            prompt: `${prompt}\nCreate a distinctly different variation from the last response.`,
            template,
            tone,
          })

          if (response?.text) {
            setGenerated(response.text)
            setGeneratedAt(new Date())
            pushToast('New variation generated.')
            return
          }
        } catch {
          // Fall back to mock transformation below.
        }
      }

      const nextSections = transformSections(outputSections, actionId)
      setGenerated(buildTextFromSections(nextSections))
      setGeneratedAt(new Date())
      pushToast(
        actionId === 'shorter'
          ? 'Output shortened.'
          : actionId === 'luxury'
            ? 'Output rewritten with a more premium tone.'
            : actionId === 'sales'
              ? 'Output made more conversion-focused.'
              : actionId === 'email'
                ? 'Output converted into email format.'
                : 'New variation generated.',
      )
    } finally {
      setActionLoading('')
    }
  }

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    pushToast('Copied all generated output.')
  }

  const handleSaveDraftClick = async () => {
    if (!generated) {
      return
    }

    await onSaveDraft?.({
      goal,
      output: generated,
      prompt,
      template,
      title: `${template} Draft`,
      tone,
    })
    pushToast('Draft saved to your workspace.')
  }

  const handleLoadDraft = (draft) => {
    setTemplate(draft.template || templateOptions[0])
    setTone(draft.tone || toneOptions[0])
    setGoal(draft.goal || goalOptions[0])
    setPrompt(draft.prompt || '')
    setGenerated(draft.output || '')
    setGeneratedAt(draft.updated_at ? new Date(draft.updated_at) : new Date())
    setActiveDraftId(draft.id)
    setCopied(false)
    pushToast('Draft loaded into the writer.')
  }

  const handleDuplicateDraftClick = async (draft) => {
    await onDuplicateDraft?.(draft)
    pushToast('Draft duplicated.')
  }

  const handleDeleteDraftClick = async (draftId) => {
    await onDeleteDraft?.(draftId)
    if (activeDraftId === draftId) {
      setActiveDraftId(null)
    }
    pushToast('Draft deleted.')
  }

  const handleScheduleCampaign = () => {
    setScheduleForm((current) => ({
      ...current,
      campaignName: current.campaignName || `${template} Launch`,
      channel: templateToChannel[template] || current.channel,
    }))
    setShowScheduleModal(true)
  }

  const handleSendToCampaigns = async () => {
    if (!generated) {
      return
    }

    await onSendToCampaigns?.({
      channel: templateToChannel[template] || 'Social Media',
      name: `${template} Campaign Draft`,
    })
    pushToast('Sent to Campaigns.')
  }

  return (
    <>
      <ToastStack toasts={toasts} />

      <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  AI Writer
                </h1>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
                  Generate polished marketing copy with AI and save drafts back to your workspace.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Dropdown
                className="w-full"
                items={templateOptions.map((item) => ({ id: item, label: item }))}
                label={template}
                onSelect={(item) => setTemplate(item.label)}
                triggerClassName="w-full justify-between"
              />
              <Dropdown
                className="w-full"
                items={toneOptions.map((item) => ({ id: item, label: item }))}
                label={tone}
                onSelect={(item) => setTone(item.label)}
                triggerClassName="w-full justify-between"
              />
              <Dropdown
                className="w-full"
                items={goalOptions.map((item) => ({ id: item, label: item }))}
                label={goal}
                onSelect={(item) => setGoal(item.label)}
                triggerClassName="w-full justify-between"
              />
            </div>

            <textarea
              rows="6"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Describe what you want AI to write. For example: promote a premium summer detailing package for busy professionals, announce a limited-time offer, or create a high-converting follow-up email."
              className="mt-6 w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {loading ? 'Generating...' : 'Generate'}
              </button>
              <button
                type="button"
                onClick={handleCopyAll}
                disabled={!output}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy All'}
              </button>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                {error}
              </div>
            )}
          </Card>

          <Card className="bg-slate-50 dark:bg-slate-950">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Generated output</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {template} - {tone} tone - {goal}
                </p>
              </div>
              {generatedAt && (
                <div className="text-xs text-slate-400 dark:text-slate-500">
                  Generated {generatedAt.toLocaleString()}
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {workflowActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleTransform(action.id)}
                  disabled={!generated || !!actionLoading}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand-200 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-500/30 dark:hover:text-white"
                >
                  {actionLoading === action.id && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
                  {action.label}
                </button>
              ))}
            </div>

            {outputSections.length > 0 ? (
              <div className="mt-5 grid gap-4">
                {outputSections.map((section, index) => (
                  <OutputSectionCard key={`${section.title}-${index}`} section={section} />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Choose a template, update the prompt, and generate a draft.
              </p>
            )}

            <div className="mt-6 grid gap-3 rounded-[1.4rem] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2 xl:grid-cols-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <div className="font-medium text-slate-900 dark:text-white">Headline</div>
                {outputMetadata.headline} chars
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <div className="font-medium text-slate-900 dark:text-white">Primary copy</div>
                {outputMetadata.primaryCopy} chars
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <div className="font-medium text-slate-900 dark:text-white">Alt copy</div>
                {outputMetadata.altCopy} chars
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <div className="font-medium text-slate-900 dark:text-white">Call To Action</div>
                {outputMetadata.callToAction} chars
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <div className="font-medium text-slate-900 dark:text-white">Hashtags</div>
                {outputMetadata.hashtags} tags
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <div className="font-medium text-slate-900 dark:text-white">Template</div>
                {template}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <div className="font-medium text-slate-900 dark:text-white">Tone</div>
                {tone}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <div className="font-medium text-slate-900 dark:text-white">Goal</div>
                {goal}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCopyAll}
                disabled={!output}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
              >
                <Copy className="h-4 w-4" />
                Copy All
              </button>
              <button
                type="button"
                onClick={handleSaveDraftClick}
                disabled={!generated}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </button>
              <button
                type="button"
                onClick={handleScheduleCampaign}
                disabled={!generated}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
              >
                <CalendarClock className="h-4 w-4" />
                Schedule Campaign
              </button>
              <button
                type="button"
                onClick={handleSendToCampaigns}
                disabled={!generated}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                <Megaphone className="h-4 w-4" />
                Send to Campaigns
              </button>
            </div>
          </Card>

          <PlatformPreview sections={outputSections} template={template} workspaceName={workspace?.business_name || 'Commandly AI'} />
        </div>

        <Card>
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Saved drafts</h3>
          <div className="mt-5 space-y-4">
            {drafts.length > 0 ? (
              drafts.map((draft) => (
                <DraftCard
                  key={draft.id}
                  draft={draft}
                  isActive={activeDraftId === draft.id}
                  onDelete={() => handleDeleteDraftClick(draft.id)}
                  onDuplicate={() => handleDuplicateDraftClick(draft)}
                  onLoad={() => handleLoadDraft(draft)}
                />
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center dark:border-slate-800 dark:bg-slate-950">
                <div className="text-base font-semibold text-slate-900 dark:text-white">No saved drafts yet</div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Save generated copy and it will persist here for your account.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {showScheduleModal && (
        <Modal onClose={() => setShowScheduleModal(false)} title="Schedule Campaign">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Campaign name</span>
              <input
                type="text"
                value={scheduleForm.campaignName}
                onChange={(event) => setScheduleForm((current) => ({ ...current, campaignName: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Channel</span>
              <Dropdown
                items={['Social Media', 'Email', 'SMS', 'Google Ads', 'Local Promo'].map((item) => ({ id: item, label: item }))}
                label={scheduleForm.channel}
                onSelect={(item) => setScheduleForm((current) => ({ ...current, channel: item.label }))}
                triggerClassName="w-full justify-between"
                className="w-full"
              />
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Date</span>
              <input
                type="date"
                value={scheduleForm.date}
                onChange={(event) => setScheduleForm((current) => ({ ...current, date: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Time</span>
              <input
                type="time"
                value={scheduleForm.time}
                onChange={(event) => setScheduleForm((current) => ({ ...current, time: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowScheduleModal(false)
              pushToast(`Scheduled ${scheduleForm.campaignName} for ${scheduleForm.date} at ${scheduleForm.time}.`)
            }}
            className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Confirm Schedule
          </button>
        </Modal>
      )}
    </>
  )
}

export default AIWriter
