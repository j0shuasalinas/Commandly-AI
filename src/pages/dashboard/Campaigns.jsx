import { useMemo, useState } from 'react'
import { CalendarDays, LoaderCircle, Plus, Sparkles } from 'lucide-react'
import Card from '../../components/ui/Card'
import Dropdown from '../../components/ui/Dropdown'
import Modal from '../../components/ui/Modal'

function Campaigns({ campaigns = [], loading, onCreateCampaign }) {
  const [campaignType, setCampaignType] = useState('Social Media')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredCampaigns = useMemo(
    () =>
      campaigns.filter(
        (campaign) => statusFilter === 'All' || campaign.status === statusFilter,
      ),
    [campaigns, statusFilter],
  )

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Campaigns
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Build, launch, and monitor multichannel campaigns from a cleaner AI
            planning workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Dropdown
            items={['Social Media', 'Email', 'SMS', 'Google Ads', 'Local Promo'].map(
              (item) => ({ id: item, label: item }),
            )}
            label={campaignType}
            onSelect={(item) => setCampaignType(item.label)}
          />
          <Dropdown
            items={['All', 'Draft', 'Scheduled', 'Active', 'Completed'].map((item) => ({
              id: item,
              label: item,
            }))}
            label={statusFilter}
            onSelect={(item) => setStatusFilter(item.label)}
          />
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <Plus className="h-4 w-4" />
            Create Campaign
          </button>
        </div>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.25fr_0.75fr]">
        <div className="grid gap-6 xl:grid-cols-2">
          {loading ? (
            <Card className="xl:col-span-2">
              <div className="flex items-center justify-center py-12">
                <LoaderCircle className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            </Card>
          ) : filteredCampaigns.length > 0 ? (
            filteredCampaigns.map((campaign) => (
              <Card key={campaign.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-950 dark:text-white">
                      {campaign.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {campaign.channel} - {campaign.scheduled_date || 'No date set'}
                    </div>
                  </div>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                    {campaign.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {Object.entries(campaign.performance || {}).map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <div className="text-xs uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                        {label}
                      </div>
                      <div className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          ) : (
            <Card className="xl:col-span-2 text-center">
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                No campaigns yet
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Create your first campaign and upcoming launches will start showing up here.
              </p>
            </Card>
          )}
        </div>

        <div className="grid gap-6">
          <Card>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-brand-500" />
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                Upcoming Campaigns
              </h3>
            </div>
            {campaigns.length > 0 ? (
              <div className="mt-5 space-y-4">
                {campaigns.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                      {item.status}
                    </div>
                    <div className="mt-2 font-medium text-slate-950 dark:text-white">
                      {item.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {item.scheduled_date || 'No date set'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[1.4rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center dark:border-slate-800 dark:bg-slate-950">
                <div className="text-base font-semibold text-slate-900 dark:text-white">
                  No upcoming campaigns
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Scheduled launches will appear here once you create your first campaign.
                </p>
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-brand-500" />
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                Campaign Planner
              </h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Use the builder to organize upcoming social, email, and local promo launches for your workspace.
            </p>
          </Card>
        </div>
      </div>

      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)} title="Create Campaign">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                Campaign Type
              </div>
              <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {campaignType}
              </div>
            </div>
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                Suggested Launch Date
              </div>
              <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                June 5, 2026
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await onCreateCampaign?.(campaignType)
              setShowCreateModal(false)
            }}
            className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Create Campaign Draft
          </button>
        </Modal>
      )}
    </div>
  )
}

export default Campaigns
