import {
  Bell,
  BrainCircuit,
  ChevronRight,
  LineChart,
  LogOut,
  MailPlus,
  MessageSquareReply,
  MoonStar,
  PenSquare,
  Search,
  Settings,
  Sparkles,
  SunMedium,
  UserCircle2,
  WandSparkles,
} from 'lucide-react'

const sidebarLinks = [
  'Overview',
  'AI Writer',
  'Reviews',
  'Campaigns',
  'Leads',
  'Analytics',
  'Settings',
]

const statCards = [
  { label: 'AI Tasks Completed', value: '128', detail: '+12% vs yesterday' },
  { label: 'New Leads', value: '24', detail: '7 hot prospects ready' },
  { label: 'Reviews Replied', value: '36', detail: '92% handled in under 1 hour' },
  { label: 'Content Created', value: '18', detail: 'Posts, emails, and ads generated' },
]

const quickActions = [
  {
    label: 'Generate Instagram Post',
    icon: PenSquare,
    prompt:
      'Write an Instagram post promoting our summer special for first-time customers with a warm, local-business tone.',
  },
  {
    label: 'Reply to Review',
    icon: MessageSquareReply,
    prompt:
      'Draft a thoughtful reply to a 4-star review that praises our staff but mentions a long wait time.',
  },
  {
    label: 'Create Email Campaign',
    icon: MailPlus,
    prompt:
      'Create a three-email re-engagement campaign for leads who booked a consultation but never purchased.',
  },
  {
    label: 'Summarize Business Data',
    icon: BrainCircuit,
    prompt:
      'Summarize our lead sources, review sentiment, and weekly sales trends into 3 next-step recommendations.',
  },
]

const activityRows = [
  ['AI Writer', 'Generated 5 ad variations for spring campaign', '2 min ago', 'Completed'],
  ['Reviews', 'Replied to new Google review from Amanda R.', '18 min ago', 'Approved'],
  ['Leads', 'Flagged 3 high-intent contacts for follow-up', '42 min ago', 'New'],
  ['Analytics', 'Weekly insight summary prepared for owner', '1 hr ago', 'Ready'],
]

const messages = [
  {
    name: 'Avery Brooks',
    channel: 'Website lead',
    text: 'Interested in pricing for a monthly package. Can someone follow up this afternoon?',
  },
  {
    name: 'Sofia Martinez',
    channel: 'Google review',
    text: 'Loved the service. Wish booking times were easier to see online.',
  },
]

const ideas = [
  'Behind-the-scenes reel featuring your team at work',
  'Customer spotlight post with before-and-after transformation',
  'Limited-time referral campaign for returning clients',
]

function Dashboard({
  ownerName,
  onSignOut,
  onToggleTheme,
  promptValue = '',
  setPromptValue,
  theme,
  workspaceName,
  workspaceType = 'Business workspace',
}) {
  const isInteractive = Boolean(setPromptValue)

  return (
    <section id="dashboard" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-3 shadow-[0_24px_90px_rgba(15,23,42,0.10)] transition duration-300 dark:border-slate-800 dark:bg-[#020817]/95 dark:shadow-[0_30px_100px_rgba(2,6,23,0.52)]">
          <div className="grid gap-3 xl:grid-cols-[260px_1fr]">
            <aside className="rounded-[1.6rem] bg-slate-900 p-6 text-white dark:bg-[#040916]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{workspaceName}</div>
                  <div className="text-sm text-slate-300">{workspaceType}</div>
                </div>
              </div>

              <nav className="mt-8 space-y-2">
                {sidebarLinks.map((link, index) => {
                  const active = index === 0

                  return (
                    <button
                      key={link}
                      type="button"
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                        active
                          ? 'bg-white text-slate-950 shadow-card'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{link}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )
                })}
              </nav>

              <div className="mt-10 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-medium text-white">Upgrade insights</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Unlock more campaign automations, deeper analytics, and multi-user
                  workspaces.
                </p>
                <a
                  href="/#pricing"
                  className="mt-4 inline-flex rounded-2xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400"
                >
                  View plans
                </a>
              </div>
            </aside>

            <div className="rounded-[1.6rem] bg-slate-50 p-4 dark:bg-[#071120]">
              <div className="flex flex-col gap-4 rounded-[1.4rem] border border-slate-200/80 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search workflows, campaigns, leads..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>

                <div className="flex items-center gap-3">
                  {onToggleTheme && (
                    <button
                      type="button"
                      onClick={onToggleTheme}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:text-white"
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? (
                        <SunMedium className="h-5 w-5" />
                      ) : (
                        <MoonStar className="h-5 w-5" />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:text-white"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                  </button>
                  {onSignOut && (
                    <button
                      type="button"
                      onClick={onSignOut}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:text-white"
                      aria-label="Sign out"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  )}
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
                    <UserCircle2 className="h-9 w-9 text-brand-500" />
                    <div className="hidden sm:block">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {ownerName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Owner
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-6">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Welcome back, {ownerName}
                  </h2>
                  <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
                    Here&apos;s what Commandly AI handled for your business today.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {statCards.map((card) => (
                    <div
                      key={card.label}
                      className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-card dark:border-slate-800 dark:bg-slate-900/90"
                    >
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {card.label}
                      </div>
                      <div className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
                        {card.value}
                      </div>
                      <div className="mt-2 text-sm text-brand-600 dark:text-brand-300">
                        {card.detail}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                  <div className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                        <WandSparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                          AI Command Prompt
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Ask for help with marketing, reviews, leads, and reporting.
                        </p>
                      </div>
                    </div>

                    <textarea
                      rows="5"
                      value={promptValue}
                      onChange={(event) => setPromptValue?.(event.target.value)}
                      readOnly={!isInteractive}
                      placeholder="Ask Commandly AI to help with marketing, reviews, leads, or business insights..."
                      className="mt-5 w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    />

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {quickActions.map((action) => {
                        const Icon = action.icon
                        return (
                          <button
                            key={action.label}
                            type="button"
                            onClick={() => setPromptValue?.(action.prompt)}
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
                  </div>

                  <div className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                          Weekly Performance
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Clean snapshot of activity across AI workflows.
                        </p>
                      </div>
                      <LineChart className="h-5 w-5 text-brand-500" />
                    </div>

                    <div className="mt-6 h-52 rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(to_top,rgba(74,111,255,0.08),transparent),linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:auto,48px_48px,48px_48px] p-4 dark:border-slate-800 dark:bg-[linear-gradient(to_top,rgba(74,111,255,0.12),transparent),linear-gradient(to_right,rgba(51,65,85,0.38)_1px,transparent_1px),linear-gradient(to_bottom,rgba(51,65,85,0.38)_1px,transparent_1px)]">
                      <div className="flex h-full items-end gap-4">
                        {[45, 70, 58, 88, 64, 94, 82].map((height, index) => (
                          <div key={index} className="flex-1">
                            <div
                              className="rounded-t-2xl bg-gradient-to-t from-brand-600 to-accent-400"
                              style={{ height: `${height}%` }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <span>7-day AI activity</span>
                      <span className="font-medium text-brand-600 dark:text-brand-300">
                        +18.4%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                          Recent Activity
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          A live feed of what your workspace completed today.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
                      >
                        <Settings className="h-4 w-4" />
                        Manage
                      </button>
                    </div>

                    <div className="mt-5 overflow-x-auto">
                      <table className="min-w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800">
                            {['Module', 'Activity', 'Time', 'Status'].map((heading) => (
                              <th
                                key={heading}
                                className="pb-4 pr-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400"
                              >
                                {heading}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {activityRows.map((row) => (
                            <tr
                              key={row[1]}
                              className="border-b border-slate-100 last:border-0 dark:border-slate-800/70"
                            >
                              <td className="py-4 pr-4 text-sm font-medium text-slate-900 dark:text-white">
                                {row[0]}
                              </td>
                              <td className="py-4 pr-4 text-sm text-slate-600 dark:text-slate-300">
                                {row[1]}
                              </td>
                              <td className="py-4 pr-4 text-sm text-slate-500 dark:text-slate-400">
                                {row[2]}
                              </td>
                              <td className="py-4">
                                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                                  {row[3]}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
                      <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                        Content Ideas
                      </h3>
                      <div className="mt-4 space-y-3">
                        {ideas.map((idea) => (
                          <div
                            key={idea}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                          >
                            {idea}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
                      <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                        Customer Messages
                      </h3>
                      <div className="mt-4 space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.name}
                            className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="font-medium text-slate-900 dark:text-white">
                                {message.name}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {message.channel}
                              </div>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                              {message.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
