import { Quote, Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Maya Brooks',
    role: 'Owner, Glow Auto Detail',
    quote:
      'Commandly AI gave us one place to manage promos, reply to reviews, and keep up with leads without the usual chaos.',
    result: 'Saved 9+ hours a week',
  },
  {
    name: 'Andre Lewis',
    role: 'Founder, Studio North Agency',
    quote:
      'It feels like having an operations assistant and marketing strategist built into one polished dashboard.',
    result: '2.1x faster content turnaround',
  },
  {
    name: 'Sofia Ramirez',
    role: 'Manager, Elevate Fitness',
    quote:
      'The review replies and campaign workflows made the product instantly easy to explain to our team and our clients.',
    result: '38% more lead follow-up consistency',
  },
]

const trustStats = [
  { label: 'Average rating', value: '4.9/5' },
  { label: 'Teams supported', value: '250+' },
  { label: 'Weekly tasks automated', value: '12k+' },
]

function Testimonials() {
  return (
    <section className="px-4 pb-10 pt-4 sm:px-6 lg:px-8 lg:pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-card backdrop-blur dark:border-slate-800 dark:bg-slate-900/65 dark:shadow-darkcard lg:p-8">
          <div className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
                Testimonials
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Trusted by service businesses that want cleaner growth systems.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Founders, operators, and small teams use Commandly AI to move faster without
                losing brand quality.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                {trustStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="text-2xl font-semibold text-slate-950 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3 xl:grid-cols-1">
              {testimonials.map((testimonial) => (
                <article
                  key={testimonial.name}
                  className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-glow dark:border-slate-800 dark:bg-slate-950 dark:hover:border-brand-500/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <Quote className="h-5 w-5 text-brand-500" />
                  </div>

                  <p className="mt-5 text-base leading-7 text-slate-700 dark:text-slate-300">
                    "{testimonial.quote}"
                  </p>

                  <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
                    <div className="font-semibold text-slate-950 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {testimonial.role}
                    </div>
                    <div className="mt-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                      {testimonial.result}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
