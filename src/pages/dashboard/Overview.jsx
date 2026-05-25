import { useMemo, useState } from 'react'
import {
  BrainCircuit,
  CheckCircle2,
  LoaderCircle,
  Mail,
  MessageSquareText,
  PenSquare,
  Sparkles,
  TrendingUp,
  WandSparkles,
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Dropdown from '../../components/ui/Dropdown'

const quickActions = [
  {
    label: 'Generate Instagram Post',
    icon: PenSquare,
    prompt:
      'Write a high-converting Instagram caption promoting our limited-time offer to first-time customers.',
  },
  {
    label: 'Reply to Review',
    icon: MessageSquareText,
    prompt:
      'Draft a polished reply to a 4-star review that mentions great staff but a longer-than-expected wait.',
  },
  {
    label: 'Create Email Campaign',
    icon: Mail,
    prompt:
      'Create a 3-part email re-engagement campaign for recent leads who did not book within 7 days.',
  },
  {
    label: 'Summarize Business Data',
    icon: BrainCircuit,
    prompt:
      'Summarize our latest leads, reviews, and campaign performance into 3 clear next-step recommendations.',
  },
]

function MiniTrendChart({ values }) {
  const maxValue = Math.max(...values, 1)
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100
      const y = 100 - (value / maxValue) * 80 - 10
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox="0 0 100 100" className="h-48 w-full">
      <defs>
        <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(96,165,250,0.35)" />
          <stop offset="100%" stopColor="rgba(96,165,250,0)" />
        </linearGradient>
      </defs>
      <path d="M0 90 H100" fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="1.2" />
      <path d={`M${points} L100,100 L0,100 Z`} fill="url(#trend-fill)" />
      <polyline
        fill="none"
        points={points}
        stroke="rgb(96,165,250)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  )
}

function DonutChart({ segments, total }) {
  const circumference = 2 * Math.PI * 52
  let offset = 0

  return (
    <div className="relative flex h-48 items-center justify-center">
      <svg viewBox="0 0 140 140" className="h-48 w-48 -rotate-90">
        <circle cx="70" cy="70" r="52" fill="none" stroke="rgba(148,163,184,0.16)" strokeWidth="16" />
        {segments.map((segment) => {
          const length = total > 0 ? (segment.value / total) * circumference : 0
          const currentOffset = offset
          offset += length

          return (
            <circle
              key={segment.label}
              cx="70"
              cy="70"
              r="52"
              fill="none"
              stroke={segment.color}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
              strokeWidth="16"
            />
          )
        })}
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-semibold text-slate-950 dark:text-white">{total}</div>
        <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Total items
        </div>
      </div>
    </div>
  )
}

function Overview({
  loading,
  onGenerateInsight,
  recentActivity = [],
  stats = [],
  workspaceMetrics,
}) {
  const [prompt, setPrompt] = useState('')
  const [insight, setInsight] = useState('')
  const [loadingInsight, setLoadingInsight] = useState(false)
  const [error, setError] = useState('')

  const trendValues = useMemo(
    () => [
      Math.max(workspaceMetrics?.campaigns ?? 0, 0),
      Math.max(workspaceMetrics?.drafts ?? 0, 0),
      Math.max(workspaceMetrics?.automations ?? 0, 0),
      Math.max(workspaceMetrics?.leads ?? 0, 0),
      Math.max(workspaceMetrics?.reviews ?? 0, 0),
      Math.max((workspaceMetrics?.campaigns ?? 0) + (workspaceMetrics?.drafts ?? 0), 0),
    ],
    [workspaceMetrics],
  )

  const donutSegments = useMemo(
    () => [
      { label: 'Leads', value: workspaceMetrics?.leads ?? 0, color: '#60a5fa' },
      { label: 'Campaigns', value: workspaceMetrics?.campaigns ?? 0, color: '#818cf8' },
      { label: 'Drafts', value: workspaceMetrics?.drafts ?? 0, color: '#22c55e' },
      { label: 'Automations', value: workspaceMetrics?.automations ?? 0, color: '#f59e0b' },
    ],
    [workspaceMetrics],
  )

  const totalItems = donutSegments.reduce((sum, segment) => sum + segment.value, 0)

  const handleGenerateInsight = async () => {
    setLoadingInsight(true)
    setError('')

    try {
      const response = await onGenerateInsight?.({ prompt })
      setInsight(response?.text || '')
    } catch (nextError) {
      setError(nextError.message)
    } finally {
      setLoadingInsight(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Overview
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Monitor AI activity, workspace performance, and the next best moves for your business from one command center.
          </p>
        </div>
        <Dropdown
          items={[
            { id: 'refresh', label: 'Refresh widgets', description: 'Reload dashboard modules.' },
            { id: 'duplicate', label: 'Duplicate report', description: 'Create a saved snapshot.' },
            { id: 'archive', label: 'Archive overview', description: 'Hide this view from the sidebar.' },
            { id: 'delete', label: 'Delete', description: 'Remove all saved widgets.' },
          ]}
          label="More actions"
          onSelect={() => {}}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {stats.map((card) => (
          <Card key={card.label}>
            <div className="text-sm text-slate-500 dark:text-slate-400">{card.label}</div>
            <div className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">
              {card.value}
            </div>
            <div className="mt-3 text-sm text-brand-600 dark:text-brand-300">
              {card.detail}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
                <TrendingUp className="h-4 w-4" />
                Performance Trend
              </div>
              <h3 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
                Workspace momentum
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                A quick look at how your saved workspace activity is stacking up across the week.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              Live
            </div>
          </div>
          <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
            <MiniTrendChart values={trendValues} />
            <div className="mt-2 grid grid-cols-6 gap-2 text-center text-xs text-slate-500 dark:text-slate-400">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
                Workspace Mix
              </div>
              <h3 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
                Activity distribution
              </h3>
            </div>
            <Sparkles className="h-5 w-5 text-brand-500" />
          </div>
          <DonutChart segments={donutSegments} total={totalItems} />
          <div className="grid gap-3 sm:grid-cols-2">
            {donutSegments.map((segment) => (
              <div
                key={segment.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{segment.label}</span>
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{segment.value}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
              <WandSparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                AI Command Prompt
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ask for help with marketing, reviews, leads, or growth insights.
              </p>
            </div>
          </div>

          <textarea
            rows="5"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask Commandly AI to help with marketing, reviews, leads, or business insights..."
            className="mt-5 w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleGenerateInsight}
              disabled={loadingInsight || !prompt.trim()}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {loadingInsight && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {loadingInsight ? 'Generating...' : 'Run with Gemini'}
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => setPrompt(action.prompt)}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-brand-500/30 dark:hover:text-white"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <Icon className="h-4 w-4" />
                  </div>
                  {action.label}
                </button>
              )
            })}
          </div>

          {(insight || error) && (
            <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
                Gemini Response
              </div>
              <p className={`mt-3 whitespace-pre-line text-sm leading-7 ${error ? 'text-amber-600 dark:text-amber-300' : 'text-slate-600 dark:text-slate-300'}`}>
                {error || insight}
              </p>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                Weekly Performance
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your workspace health snapshot updates as you save more activity.
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-brand-500" />
          </div>

          <div className="mt-6 grid gap-3">
            {[
              { label: 'Engagement readiness', value: Math.min((workspaceMetrics?.drafts ?? 0) * 18, 100) },
              { label: 'Lead pipeline coverage', value: Math.min((workspaceMetrics?.leads ?? 0) * 20, 100) },
              { label: 'Automation adoption', value: Math.min((workspaceMetrics?.automations ?? 0) * 22, 100) },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-sky-500 via-brand-500 to-violet-500"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                Recent Activity
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your recent AI actions and workflow updates will appear here after the first run.
              </p>
            </div>
            <Dropdown
              items={[
                { id: 'details', label: 'View Details', description: 'Open the full activity log.' },
                { id: 'edit', label: 'Edit', description: 'Customize this widget.' },
                { id: 'duplicate', label: 'Duplicate', description: 'Add another copy to your dashboard.' },
                { id: 'archive', label: 'Archive', description: 'Hide this widget for now.' },
                { id: 'delete', label: 'Delete', description: 'Remove it from the overview.' },
              ]}
              label="Manage"
              onSelect={() => {}}
            />
          </div>

          {loading ? (
            <div className="mt-5 flex items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center dark:border-slate-800 dark:bg-slate-950">
              <LoaderCircle className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="mt-5 space-y-3">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {item.type}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center dark:border-slate-800 dark:bg-slate-950">
              <CheckCircle2 className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
              <div className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                No activity yet
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Your recent actions, generated content, and workflow updates will start populating after the first run.
              </p>
            </div>
          )}
        </Card>

        <div className="grid gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
              Content Ideas
            </h3>
            <div className="mt-4 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center dark:border-slate-800 dark:bg-slate-950">
              <div className="text-base font-semibold text-slate-900 dark:text-white">
                No content ideas yet
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Generated content recommendations will show up after your first prompts and campaigns.
              </p>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
              Customer Messages
            </h3>
            <div className="mt-4 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center dark:border-slate-800 dark:bg-slate-950">
              <div className="text-base font-semibold text-slate-900 dark:text-white">
                No customer messages yet
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Once connected channels start sending messages, they will appear here.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Overview
