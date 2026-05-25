import { UserRoundPlus } from 'lucide-react'
import Card from '../../components/ui/Card'
import Dropdown from '../../components/ui/Dropdown'

const permissions = [
  { id: 'perm-1', label: 'Manage Billing', description: 'Update plans and payment details.' },
  { id: 'perm-2', label: 'Approve AI Replies', description: 'Review and publish customer-facing outputs.' },
  { id: 'perm-3', label: 'Create Campaigns', description: 'Launch marketing campaigns and automations.' },
  { id: 'perm-4', label: 'View Analytics', description: 'Access reports, trends, and workspace insights.' },
]

const roleOptions = ['Owner', 'Admin', 'Manager', 'Viewer']

function Team({ members = [], onInviteMember, onUpdateRole, ownerName }) {
  return (
    <div className="grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Team
            </h1>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
              Manage roles, approvals, and who can control sensitive parts of the
              workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onInviteMember?.()}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <UserRoundPlus className="h-4 w-4" />
            Invite Member
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col gap-4 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
                  {member.name?.slice(0, 2).toUpperCase() || ownerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {member.name}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {member.email}
                  </div>
                </div>
              </div>
              <Dropdown
                align="right"
                items={roleOptions.map((role) => ({ id: role, label: role }))}
                label={member.role}
                onSelect={(item) => onUpdateRole?.(member.id, item.label)}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
          Permissions
        </h3>
        <div className="mt-5 space-y-4">
          {permissions.map((permission) => (
            <div
              key={permission.id}
              className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="font-medium text-slate-900 dark:text-white">
                {permission.label}
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {permission.description}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Team
