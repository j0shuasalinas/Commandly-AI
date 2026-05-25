import { Link, Navigate } from 'react-router'
import Dashboard from '../components/Dashboard'
import SetupNotice from '../components/SetupNotice'
import { useAuth } from '../context/AuthContext'

function DashboardPage({ theme, onToggleTheme }) {
  const { isSupabaseConfigured, profile, signOut, user, workspace } = useAuth()

  if (isSupabaseConfigured && user && !workspace) {
    return <Navigate to="/onboarding" replace />
  }

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {!isSupabaseConfigured && <SetupNotice />}

        {workspace && (
          <div className="mb-6 rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-darkcard">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
                  Live Workspace
                </div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  {workspace.business_name}
                </h1>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
                  {workspace.business_type} workspace connected to {workspace.business_email}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/onboarding"
                  className="inline-flex rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                >
                  Edit setup
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}

        <Dashboard
          ownerName={profile?.fullName || user?.email?.split('@')[0] || 'there'}
          onSignOut={signOut}
          onToggleTheme={onToggleTheme}
          theme={theme}
          workspaceName={workspace?.business_name || 'Commandly AI'}
          workspaceType={workspace?.business_type || 'Business workspace'}
        />
      </div>
    </main>
  )
}

export default DashboardPage
