import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Bell, CircleHelp, MoonStar, Search, SunMedium, UserCircle2 } from 'lucide-react'
import Dropdown from '../ui/Dropdown'

function Topbar({
  notifications = [],
  ownerName,
  onSignOut,
  onToggleTheme,
  searchItems = [],
  theme,
  workspaceLogo,
}) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return []
    }

    const normalizedQuery = query.toLowerCase()

    return searchItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.subtitle.toLowerCase().includes(normalizedQuery),
      )
      .slice(0, 5)
  }, [query, searchItems])

  const notificationItems = notifications.map((item) => ({
    id: item.id,
    label: item.title,
    description: `${item.detail} - ${item.time}`,
  }))

  const profileItems = [
    {
      id: 'profile',
      label: 'Profile',
      description: 'View your owner profile details.',
    },
    {
      id: 'workspace-settings',
      label: 'Workspace Settings',
      description: 'Open business profile and AI preferences.',
    },
    {
      id: 'billing',
      label: 'Billing',
      description: 'Review plan, invoices, and usage.',
    },
    {
      id: 'help-center',
      label: 'Help Center',
      description: 'Browse guides and onboarding support.',
    },
    {
      id: 'sign-out',
      label: 'Sign Out',
      description: 'Securely end your current session.',
    },
  ]

  const handleProfileSelect = (item) => {
    if (item.id === 'profile' || item.id === 'workspace-settings') {
      navigate('/dashboard/settings')
      return
    }

    if (item.id === 'billing') {
      navigate('/dashboard/billing')
      return
    }

    if (item.id === 'help-center') {
      navigate('/dashboard')
      return
    }

    if (item.id === 'sign-out') {
      onSignOut?.()
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search workflows, campaigns, leads..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          />

          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_48px_rgba(15,23,42,0.16)] dark:border-slate-800 dark:bg-slate-900">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => {
                    setQuery('')
                    navigate(result.path)
                  }}
                  className="flex w-full items-start rounded-xl px-3 py-3 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {result.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {result.type} - {result.subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
          </button>

          <Dropdown
            align="right"
            emptyStateText="No notifications yet."
            items={notificationItems}
            onSelect={() => {}}
            renderLabel={() => <Bell className="h-5 w-5" />}
            showChevron={false}
            triggerClassName="h-11 w-11 justify-center px-0"
          />

          <Dropdown
            align="right"
            items={profileItems}
            onSelect={handleProfileSelect}
            renderLabel={() => (
              <>
                {workspaceLogo ? (
                  <div className="h-9 w-9 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700">
                    <img src={workspaceLogo} alt="Workspace logo" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <UserCircle2 className="h-9 w-9 text-brand-500" />
                )}
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                    {ownerName}
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Owner
                  </span>
                </span>
              </>
            )}
            triggerClassName="gap-3 px-3 py-2"
          />

          <button
            type="button"
            onClick={() => navigate('/dashboard/settings')}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:text-white"
            aria-label="Help"
          >
            <CircleHelp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Topbar
