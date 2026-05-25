function FinalCta({ onGetStarted }) {
  return (
    <section className="px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-brand-200/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(238,244,255,0.98))] px-8 py-12 shadow-glow dark:border-brand-500/20 dark:bg-[linear-gradient(135deg,rgba(8,17,32,0.95),rgba(17,24,39,0.95))] lg:px-12">
          <div className="max-w-3xl">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
              Ready When You Are
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Ready to run your business with less busywork?
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Use Commandly AI to automate content, customer replies, leads, and
              daily insights from one dashboard.
            </p>
            <button
              type="button"
              onClick={onGetStarted}
              className="mt-8 inline-flex rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalCta
