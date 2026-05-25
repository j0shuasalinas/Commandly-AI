import Card from '../../components/ui/Card'

const statusStyles = {
  Connected: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  'Not Connected': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'Coming Soon': 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
}

function Integrations({ integrations = [], onToggleIntegration }) {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Integrations
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
          Connect the tools your business already uses and keep Commandly AI
          informed with richer context.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-lg font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {integration.name
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)}
            </div>
            <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">
              {integration.name}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {integration.description}
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[integration.status]}`}
              >
                {integration.status}
              </span>
              <button
                type="button"
                onClick={() => onToggleIntegration?.(integration)}
                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
              >
                {integration.action_label}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Integrations
