import { ArrowRight, LoaderCircle, PauseCircle, PlayCircle, Plus } from 'lucide-react'
import Card from '../../components/ui/Card'

const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  Paused: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  'Needs Setup': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
}

const templateCards = [
  {
    action_label: 'Draft AI reply',
    approval_label: 'Owner approval',
    description: 'Generate a branded reply whenever a new review arrives.',
    output_label: 'Publish to source',
    title: 'Auto-reply to new reviews',
    trigger_label: 'New review arrives',
  },
  {
    action_label: 'Generate content plan',
    approval_label: 'Manager approval',
    description: 'Build a weekly queue of social post ideas for your team.',
    output_label: 'Save to workspace queue',
    title: 'Weekly social content plan',
    trigger_label: 'Every Monday',
  },
  {
    action_label: 'Generate reminder',
    approval_label: 'Auto-queue',
    description: 'Flag leads that have not been contacted quickly enough.',
    output_label: 'Notify owner',
    title: 'Lead follow-up reminder',
    trigger_label: 'Lead sits idle for 24 hours',
  },
]

function Automations({ automations = [], loading, onCreateAutomation, onToggleAutomation }) {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Automations
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Turn repeatable business tasks into reliable AI workflows with approval
            steps and clear outputs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onCreateAutomation?.(0)}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" />
          Create Automation
        </button>
      </div>

      {loading ? (
        <Card>
          <div className="flex items-center justify-center py-12">
            <LoaderCircle className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        </Card>
      ) : automations.length > 0 ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {automations.map((automation) => (
            <Card key={automation.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-950 dark:text-white">
                    {automation.title}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {automation.description}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[automation.status]}`}
                >
                  {automation.status}
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                {[
                  automation.trigger_label,
                  automation.action_label,
                  automation.approval_label,
                  automation.output_label,
                ]
                  .filter(Boolean)
                  .map((step, index) => (
                    <div
                      key={`${automation.id}-${step}`}
                      className="flex items-center gap-3 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950"
                    >
                      {index % 2 === 0 ? (
                        <PlayCircle className="h-5 w-5 text-brand-500" />
                      ) : (
                        <PauseCircle className="h-5 w-5 text-accent-400" />
                      )}
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {step}
                      </span>
                      {index < 3 && <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />}
                    </div>
                  ))}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  {automation.enabled ? 'Automation active' : 'Automation paused'}
                </div>
                <button
                  type="button"
                  onClick={() => onToggleAutomation?.(automation)}
                  className={`relative inline-flex h-7 w-14 rounded-full transition ${
                    automation.enabled ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      automation.enabled ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          {templateCards.map((template, index) => (
            <Card key={template.title}>
              <div className="font-semibold text-slate-950 dark:text-white">{template.title}</div>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {template.description}
              </p>
              <div className="mt-5 grid gap-3">
                {[template.trigger_label, template.action_label, template.approval_label, template.output_label].map(
                  (step, stepIndex) => (
                    <div
                      key={`${template.title}-${step}`}
                      className="flex items-center gap-3 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950"
                    >
                      {stepIndex % 2 === 0 ? (
                        <PlayCircle className="h-5 w-5 text-brand-500" />
                      ) : (
                        <PauseCircle className="h-5 w-5 text-accent-400" />
                      )}
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {step}
                      </span>
                    </div>
                  ),
                )}
              </div>
              <button
                type="button"
                onClick={() => onCreateAutomation?.(index)}
                className="mt-5 inline-flex rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Add to Workspace
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Automations
