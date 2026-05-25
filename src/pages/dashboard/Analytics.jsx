import { useMemo, useState } from 'react'
import Card from '../../components/ui/Card'
import Dropdown from '../../components/ui/Dropdown'

function Analytics({ automations = [], campaigns = [], leads = [] }) {
  const [range, setRange] = useState('30 Days')

  const metrics = useMemo(
    () => [
      { label: 'AI Tasks', value: `${automations.filter((item) => item.enabled).length}`, detail: 'Active automations' },
      { label: 'Leads Captured', value: `${leads.length}`, detail: 'Saved to workspace' },
      { label: 'Reviews Replied', value: '0', detail: 'No review sources connected' },
      { label: 'Campaign Engagement', value: campaigns.length > 0 ? 'Tracking soon' : '0%', detail: 'Starts after first launch' },
      { label: 'Estimated Time Saved', value: `${automations.filter((item) => item.enabled).length * 2} hrs`, detail: 'Estimated this month' },
    ],
    [automations, campaigns.length, leads.length],
  )

  const hasData = leads.length > 0 || campaigns.length > 0 || automations.length > 0

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Analytics
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Understand AI usage, campaign lift, review sentiment, and lead growth in
            one reporting workspace.
          </p>
        </div>
        <Dropdown
          items={['Today', '7 Days', '30 Days', '90 Days'].map((item) => ({
            id: item,
            label: item,
          }))}
          label={range}
          onSelect={(item) => setRange(item.label)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-5">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <div className="text-sm text-slate-500 dark:text-slate-400">{metric.label}</div>
            <div className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">
              {metric.value}
            </div>
            <div className="mt-3 text-sm text-brand-600 dark:text-brand-300">
              {metric.detail}
            </div>
          </Card>
        ))}
      </div>

      {hasData ? (
        <div className="grid gap-6 2xl:grid-cols-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
              Lead growth over time
            </h3>
            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              {leads.length} leads captured in the current workspace.
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
              Campaign performance
            </h3>
            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              {campaigns.length} campaigns saved. Performance metrics will grow as live activity is connected.
            </div>
          </Card>
        </div>
      ) : (
        <Card>
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
            No analytics yet
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Add leads, save campaigns, or enable automations and this page will start showing real account-based reporting.
          </p>
        </Card>
      )}
    </div>
  )
}

export default Analytics
