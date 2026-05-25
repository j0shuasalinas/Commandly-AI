import { NavLink } from 'react-router'
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Cable,
  CreditCard,
  LayoutDashboard,
  Megaphone,
  MessageSquareQuote,
  Settings2,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react'

const sidebarItems = [
  { label: 'Overview', path: '/dashboard', key: 'overview' },
  { label: 'AI Writer', path: '/dashboard/ai-writer', key: 'ai-writer' },
  { label: 'Reviews', path: '/dashboard/reviews', key: 'reviews' },
  { label: 'Campaigns', path: '/dashboard/campaigns', key: 'campaigns' },
  { label: 'Leads', path: '/dashboard/leads', key: 'leads' },
  { label: 'Analytics', path: '/dashboard/analytics', key: 'analytics' },
  { label: 'Automations', path: '/dashboard/automations', key: 'automations' },
  { label: 'Integrations', path: '/dashboard/integrations', key: 'integrations' },
  { label: 'Team', path: '/dashboard/team', key: 'team' },
  { label: 'Billing', path: '/dashboard/billing', key: 'billing' },
  { label: 'Settings', path: '/dashboard/settings', key: 'settings' },
]

const iconMap = {
  overview: LayoutDashboard,
  'ai-writer': Bot,
  reviews: MessageSquareQuote,
  campaigns: Megaphone,
  leads: Users,
  analytics: BrainCircuit,
  automations: Workflow,
  integrations: Cable,
  team: Users,
  billing: CreditCard,
  settings: Settings2,
}

function Sidebar({ workspaceLogo, workspaceName, workspaceType }) {
  return (
    <aside className="border-r border-slate-200 bg-slate-900 p-5 text-white dark:border-slate-800 dark:bg-[#040916]">
      <NavLink
        to="/dashboard"
        className="flex items-center gap-3 rounded-2xl outline-none transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white/10 backdrop-blur">
          {workspaceLogo ? (
            <img src={workspaceLogo} alt={`${workspaceName} logo`} className="h-full w-full object-cover" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
        </div>
        <div className="min-w-0">
          <div className="truncate font-semibold">{workspaceName}</div>
          <div className="truncate text-sm text-slate-300">{workspaceType}</div>
        </div>
      </NavLink>

      <nav className="mt-8 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = iconMap[item.key] ?? LayoutDashboard

          return (
            <NavLink
              key={item.key}
              end={item.path === '/dashboard'}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-card'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
              <ArrowRight className="h-4 w-4 opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
