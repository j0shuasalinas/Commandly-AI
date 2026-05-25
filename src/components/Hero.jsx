import {
  ArrowRight,
  Bot,
  ChartNoAxesCombined,
  CircleDot,
  MessageSquareText,
  Sparkles,
} from 'lucide-react'

const heroMetrics = [
  { label: 'Tasks automated', value: '12.4k' },
  { label: 'Average reply time', value: '8 min' },
  { label: 'More leads captured', value: '+38%' },
]

const previewCards = [
  {
    title: 'Content Queue',
    value: '18 ready',
    description: 'Instagram, Google ads, and weekly email drafts generated.',
    icon: Sparkles,
  },
  {
    title: 'Review Replies',
    value: '36 sent',
    description: 'Brand-safe customer responses approved and published.',
    icon: MessageSquareText,
  },
  {
    title: 'Growth Signals',
    value: '3 priorities',
    description: 'Retention dip, local search gains, and top lead sources.',
    icon: ChartNoAxesCombined,
  },
]

function Hero({ navLinks, theme, onGetStarted, onPromptSelect }) {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur dark:border-brand-500/20 dark:bg-slate-900/70 dark:text-slate-200">
            <CircleDot className="h-4 w-4 text-brand-500" />
            Premium AI automation for ambitious small businesses
          </div>

          <h1 className="mt-6 max-w-2xl text-5xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
            Run your business smarter with Commandly AI.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Create content, reply to customers, manage leads, and uncover business
            insights from one intelligent AI dashboard.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#dashboard"
              onClick={() =>
                onPromptSelect(
                  'Build a 7-day marketing plan using our recent customer reviews, top-selling services, and local audience trends.',
                )
              }
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              Try the Dashboard
            </a>
            <a
              href={navLinks[0].href}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              View Features
            </a>
          </div>

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Built for local businesses, creators, agencies, and growing teams.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {heroMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-card backdrop-blur transition duration-300 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-darkcard"
              >
                <div className="text-2xl font-semibold text-slate-950 dark:text-white">
                  {metric.value}
                </div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:pl-4">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-accent-300/30 blur-3xl dark:bg-accent-500/20" />
          <div className="absolute -left-12 bottom-12 h-44 w-44 rounded-full bg-brand-300/30 blur-3xl dark:bg-brand-500/20" />
          <div className="absolute inset-8 rounded-[2.4rem] bg-[radial-gradient(circle_at_top_right,rgba(74,111,255,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(155,92,255,0.22),transparent_28%)] blur-2xl dark:bg-[radial-gradient(circle_at_top_right,rgba(74,111,255,0.24),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(155,92,255,0.20),transparent_26%)]" />

          <div className="relative rotate-[-1.2deg] rounded-[2.2rem] border border-white/70 bg-white/75 p-5 shadow-[0_35px_120px_rgba(15,23,42,0.18)] backdrop-blur-2xl transition duration-300 dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-[0_36px_120px_rgba(2,6,23,0.6)]">
            <div className="rounded-[1.9rem] border border-slate-200/80 bg-slate-50/95 p-5 dark:border-slate-800 dark:bg-slate-950/90">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Command Center
                  </div>
                  <div className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
                    AI-powered growth workspace
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-brand-500">
                  {theme === 'dark' ? (
                    <Bot className="h-5 w-5" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {previewCards.map((card) => {
                  const Icon = card.icon
                  return (
                    <div
                      key={card.title}
                      className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-card dark:border-slate-800 dark:bg-slate-900/90 dark:hover:shadow-darkcard"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {card.title}
                            </div>
                            <div className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                              {card.description}
                            </div>
                          </div>
                        </div>
                        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          {card.value}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-dashed border-brand-200 bg-brand-50/70 p-4 dark:border-brand-500/20 dark:bg-brand-500/10">
                <div className="text-sm font-medium text-brand-700 dark:text-brand-300">
                  Today's AI focus
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Respond to 12 new reviews, launch one local promo campaign, and
                  re-engage dormant leads from the last 30 days.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
