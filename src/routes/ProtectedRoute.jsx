import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const { loading, user, isSupabaseConfigured } = useAuth()

  if (!isSupabaseConfigured) {
    return children
  }

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.14),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_42%,#f8fafc_100%)] px-6 dark:bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_28%),linear-gradient(180deg,#040816_0%,#071120_50%,#020617_100%)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="loader-orb absolute left-[10%] top-[18%] h-40 w-40 rounded-full bg-brand-400/15 blur-3xl dark:bg-brand-500/20" />
          <div className="loader-orb absolute bottom-[14%] right-[12%] h-56 w-56 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-500/20" />
          <div className="loader-grid absolute inset-0 opacity-40 dark:opacity-20" />
        </div>

        <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-[0_40px_90px_-40px_rgba(15,23,42,0.35)] backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-[0_40px_90px_-40px_rgba(2,6,23,0.85)] sm:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent" />

          <div className="flex flex-col items-center text-center">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div className="loader-ring absolute inset-0 rounded-full border border-brand-200/80 dark:border-brand-400/20" />
              <div className="loader-ring loader-ring-delay absolute inset-3 rounded-full border border-violet-200/80 dark:border-violet-400/20" />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950">
                <span className="text-xl font-bold">C</span>
              </div>
            </div>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-brand-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200">
              <span className="h-2 w-2 rounded-full bg-brand-500 loader-pulse-dot" />
              Commandly AI
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-[2rem]">
              Loading your workspace
            </h1>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              Syncing your business profile, AI drafts, campaigns, and growth signals so everything is ready when you land.
            </p>

            <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800/80">
              <div className="loader-progress h-full w-1/2 rounded-full bg-gradient-to-r from-brand-500 via-blue-500 to-violet-500" />
            </div>

            <div className="mt-6 grid w-full gap-3 text-left sm:grid-cols-3">
              {[
                'Connecting workspace',
                'Restoring saved drafts',
                'Preparing live dashboard',
              ].map((item, index) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300"
                  style={{ animationDelay: `${index * 140}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 loader-pulse-dot" />
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth?mode=signin" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
