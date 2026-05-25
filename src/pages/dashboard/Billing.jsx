import { useState } from 'react'
import { Download, Sparkles } from 'lucide-react'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'

const pricingPlans = [
  { name: 'Starter', price: '$19/mo', description: 'For solo creators and small businesses' },
  { name: 'Pro', price: '$49/mo', description: 'For growing businesses that want automation' },
  { name: 'Business', price: '$99/mo', description: 'For teams, agencies, and advanced workflows' },
]

function Billing({ billingUsage = [], currentPlan, onSelectPlan }) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  return (
    <div className="grid gap-6">
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
              Current Plan
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {currentPlan || 'No active plan'}
            </h1>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
              Billing stays empty until you connect live subscription data. Pricing options remain here so the app is ready for checkout integration.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowUpgradeModal(true)}
              className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Upgrade Plan
            </button>
            <button
              type="button"
              className="inline-flex rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              Manage Payment Method
            </button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {billingUsage.map((item) => (
          <Card key={item.label}>
            <div className="text-sm text-slate-500 dark:text-slate-400">{item.label}</div>
            <div className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
              {item.value}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card key={plan.name} className={plan.name === currentPlan ? 'border-brand-300 shadow-glow' : ''}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
                {plan.name}
              </h3>
              {plan.name === currentPlan && (
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                  Current
                </span>
              )}
            </div>
            <div className="mt-6 text-4xl font-semibold text-slate-950 dark:text-white">
              {plan.price}
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {plan.description}
            </p>
            <button
              type="button"
              onClick={async () => {
                await onSelectPlan?.(plan.name)
                setShowUpgradeModal(false)
              }}
              className="mt-8 inline-flex w-full justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              Choose Plan
            </button>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
            Billing History
          </h3>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
          >
            <Download className="h-4 w-4" />
            Download Invoice
          </button>
        </div>
        <div className="mt-5 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center dark:border-slate-800 dark:bg-slate-950">
          <div className="text-base font-semibold text-slate-900 dark:text-white">
            No billing history yet
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Subscription invoices will appear here after live billing is connected.
          </p>
        </div>
      </Card>

      {showUpgradeModal && (
        <Modal onClose={() => setShowUpgradeModal(false)} title="Upgrade Plan">
          <div className="flex items-start gap-3 rounded-[1.5rem] border border-brand-200 bg-brand-50 p-4 dark:border-brand-500/20 dark:bg-brand-500/10">
            <Sparkles className="mt-1 h-5 w-5 text-brand-500" />
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              Select a plan and it will persist to your workspace billing state now. Stripe checkout can be layered in next to replace this with real subscription billing.
            </p>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Billing
