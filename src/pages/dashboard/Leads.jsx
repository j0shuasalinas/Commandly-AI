import { useMemo, useState } from 'react'
import { LoaderCircle, MailPlus, Phone, UserRoundPlus, WandSparkles } from 'lucide-react'
import Card from '../../components/ui/Card'
import Dropdown from '../../components/ui/Dropdown'
import Modal from '../../components/ui/Modal'

function Leads({ leads = [], loading, onAddLead, onMarkAsContacted }) {
  const [statusFilter, setStatusFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [selectedLead, setSelectedLead] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredLeads = useMemo(
    () =>
      leads.filter((lead) => {
        const statusMatch = statusFilter === 'All' || lead.status === statusFilter
        const sourceMatch = sourceFilter === 'All' || lead.source === sourceFilter
        return statusMatch && sourceMatch
      }),
    [leads, sourceFilter, statusFilter],
  )

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Leads
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Track every opportunity, keep follow-ups moving, and turn more inbound
            interest into booked work.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Dropdown
            items={['All', 'New', 'Contacted', 'Hot', 'Won', 'Lost'].map((item) => ({
              id: item,
              label: item,
            }))}
            label={statusFilter}
            onSelect={(item) => setStatusFilter(item.label)}
          />
          <Dropdown
            items={['All', 'Website', 'Instagram', 'Google', 'Referral', 'Manual'].map(
              (item) => ({ id: item, label: item }),
            )}
            label={sourceFilter}
            onSelect={(item) => setSourceFilter(item.label)}
          />
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <UserRoundPlus className="h-4 w-4" />
            Add Lead
          </button>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-950">
              <tr>
                {['Name', 'Email', 'Phone', 'Source', 'Status', 'Last Contact', 'Next Step'].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-slate-400" />
                  </td>
                </tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="cursor-pointer border-t border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {lead.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {lead.source}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {lead.last_contact}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {lead.next_step}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    No leads yet. Add your first lead to start tracking your pipeline.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedLead && (
        <Modal onClose={() => setSelectedLead(null)} title={selectedLead.name}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                <MailPlus className="h-4 w-4 text-brand-500" />
                Contact
              </div>
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                {selectedLead.email}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Phone className="h-4 w-4 text-slate-400" />
                {selectedLead.phone}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                Pipeline Details
              </div>
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Status: {selectedLead.status}
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Source: {selectedLead.source}
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Next Step: {selectedLead.next_step}
              </div>
            </Card>
          </div>
          <Card className="mt-4 p-4">
            <div className="text-sm font-medium text-slate-900 dark:text-white">Lead Note</div>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {selectedLead.note || 'No notes added yet.'}
            </p>
          </Card>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              <WandSparkles className="h-4 w-4" />
              Generate Follow-up
            </button>
            <button
              type="button"
              onClick={async () => {
                await onMarkAsContacted?.(selectedLead.id)
                setSelectedLead(null)
              }}
              className="inline-flex rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Mark as Contacted
            </button>
          </div>
        </Modal>
      )}

      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)} title="Add Lead">
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
            Add a first lead to your workspace to start testing the CRM flow.
          </p>
          <button
            type="button"
            onClick={async () => {
              await onAddLead?.()
              setShowAddModal(false)
            }}
            className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Add Lead
          </button>
        </Modal>
      )}
    </div>
  )
}

export default Leads
