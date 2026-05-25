import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '$19/mo',
    cta: 'Start Free',
    description: 'For solo creators and small businesses',
    features: [
      'AI content generation credits',
      'Review reply drafts',
      'Basic lead tracking',
      'Weekly business summaries',
    ],
    featured: false,
  },
  {
    name: 'Pro',
    price: '$49/mo',
    cta: 'Get Pro',
    description: 'For growing businesses that want automation',
    features: [
      'Unlimited AI prompts',
      'Automated review and inbox workflows',
      'Campaign builder with reusable templates',
      'Advanced lead pipeline views',
      'Priority support',
    ],
    featured: true,
  },
  {
    name: 'Business',
    price: '$99/mo',
    cta: 'Contact Sales',
    description: 'For teams, agencies, and advanced workflows',
    features: [
      'Multi-user workspace',
      'Cross-location reporting',
      'Client-facing dashboards',
      'Custom analytics exports',
      'Dedicated onboarding',
    ],
    featured: false,
  },
]

function Pricing({ onChoosePlan }) {
  return (
    <section id="pricing" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
            Pricing
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Simple plans for every stage of growth.
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Start lean, automate fast, and scale into a more capable AI workspace as
            your business grows.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-[1.8rem] border p-8 transition duration-300 hover:-translate-y-1 ${
                plan.featured
                  ? 'border-brand-300 bg-slate-900 text-white shadow-glow dark:border-brand-400 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'
                  : 'border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-darkcard'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                {plan.featured && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-200">
                    Most Popular
                  </span>
                )}
              </div>
              <div className="mt-6 text-4xl font-semibold tracking-tight">{plan.price}</div>
              <p
                className={`mt-3 text-base ${
                  plan.featured ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {plan.description}
              </p>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <div
                      className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${
                        plan.featured
                          ? 'bg-white/10 text-brand-200'
                          : 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onChoosePlan?.(plan.name.toLowerCase())}
                className={`mt-8 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                  plan.featured
                    ? 'bg-white text-slate-950 hover:bg-slate-100'
                    : 'bg-slate-900 text-white hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
                }`}
              >
                {plan.cta}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
