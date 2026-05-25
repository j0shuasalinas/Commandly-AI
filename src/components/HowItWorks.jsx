import { Bot, Cable, LayoutDashboard, Workflow } from 'lucide-react'

const steps = [
  {
    title: 'Connect your business tools',
    description:
      'Bring in your website, inbox, reviews, and lead sources so Commandly AI has the right context.',
    icon: Cable,
  },
  {
    title: 'Choose what you want to automate',
    description:
      'Select the workflows that matter most, from content creation to review replies and follow-ups.',
    icon: Workflow,
  },
  {
    title: 'Let AI handle content, replies, leads, and insights',
    description:
      'Generate content, draft responses, organize leads, and surface next steps without juggling tools.',
    icon: Bot,
  },
  {
    title: 'Review everything from one dashboard',
    description:
      'Monitor performance, approve outputs, and keep your team aligned from a clean command center.',
    icon: LayoutDashboard,
  },
]

function HowItWorks() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
            How It Works
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            How Commandly AI works
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            A simple setup flow that turns scattered daily tasks into one focused AI
            workspace for growth.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <article
                key={step.title}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-200 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-darkcard dark:hover:border-brand-500/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                    0{index + 1}
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
                  {step.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
