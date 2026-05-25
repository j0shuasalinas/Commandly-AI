import {
  BarChart3,
  FileText,
  MessageCircleMore,
  UsersRound,
} from 'lucide-react'

const features = [
  {
    title: 'AI Content Generator',
    description: 'Create social posts, captions, ads, and website copy in seconds.',
    icon: FileText,
  },
  {
    title: 'Customer Reply Assistant',
    description: 'Draft polished replies to reviews, emails, and customer messages.',
    icon: MessageCircleMore,
  },
  {
    title: 'Lead Management',
    description: 'Track new leads, follow-ups, and customer conversations in one place.',
    icon: UsersRound,
  },
  {
    title: 'Business Insights',
    description: 'Turn activity, reviews, and customer data into clear next steps.',
    icon: BarChart3,
  },
]

function Features() {
  return (
    <section id="features" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
            Features
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Everything your team needs to market, respond, and grow from one place.
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Commandly AI combines polished automation with a dashboard built for
            daily business operations.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                className="group rounded-[1.75rem] border border-slate-200/80 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-glow dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-darkcard dark:hover:border-brand-500/30"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white transition group-hover:bg-brand-600 dark:bg-slate-800 dark:group-hover:bg-brand-500">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
