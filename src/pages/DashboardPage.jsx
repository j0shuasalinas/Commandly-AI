import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import Dashboard from '../components/Dashboard'
import SetupNotice from '../components/SetupNotice'
import { useAuth } from '../context/AuthContext'
import { openBillingPortal, startCheckout } from '../lib/billing'

function DashboardPage({ theme, onToggleTheme }) {
  const { isSupabaseConfigured, profile, signOut, user, workspace } = useAuth()
  const [searchParams] = useSearchParams()
  const [billingError, setBillingError] = useState('')
  const [billingLoading, setBillingLoading] = useState('')
  const verified = searchParams.get('verified') === '1'
  const checkoutState = searchParams.get('checkout')

  if (isSupabaseConfigured && user && !workspace) {
    return <Navigate to="/onboarding" replace />
  }

  const handleCheckout = async (plan) => {
    setBillingError('')
    setBillingLoading(plan)

    try {
      await startCheckout({
        plan,
        userId: user?.id,
        email: user?.email,
      })
    } catch (error) {
      setBillingError(error.message)
      setBillingLoading('')
    }
  }

  const handlePortal = async () => {
    setBillingError('')
    setBillingLoading('portal')

    try {
      await openBillingPortal({
        email: user?.email,
      })
    } catch (error) {
      setBillingError(error.message)
      setBillingLoading('')
    }
  }

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {!isSupabaseConfigured && <SetupNotice />}

        {verified && (
          <div className="mb-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            Your email is verified and your account is ready to use.
          </div>
        )}

        {checkoutState === 'success' && (
          <div className="mb-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            Stripe checkout completed. If you add webhooks next, we can sync the
            active subscription status back into Commandly AI automatically.
          </div>
        )}

        {checkoutState === 'canceled' && (
          <div className="mb-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            Checkout was canceled before the subscription was completed.
          </div>
        )}

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

        <div className="mb-6 rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-darkcard">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
                Billing
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Connect Stripe subscriptions
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Launch hosted subscription checkout for Starter, Pro, or Business,
                then let customers manage billing from the Stripe portal.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleCheckout('starter')}
                disabled={billingLoading !== ''}
                className="inline-flex rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
              >
                {billingLoading === 'starter' ? 'Opening...' : 'Starter'}
              </button>
              <button
                type="button"
                onClick={() => handleCheckout('pro')}
                disabled={billingLoading !== ''}
                className="inline-flex rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                {billingLoading === 'pro' ? 'Opening...' : 'Pro'}
              </button>
              <button
                type="button"
                onClick={() => handleCheckout('business')}
                disabled={billingLoading !== ''}
                className="inline-flex rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
              >
                {billingLoading === 'business' ? 'Opening...' : 'Business'}
              </button>
              <button
                type="button"
                onClick={handlePortal}
                disabled={billingLoading !== ''}
                className="inline-flex rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300"
              >
                {billingLoading === 'portal' ? 'Opening...' : 'Manage billing'}
              </button>
            </div>
          </div>

          {billingError && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
              {billingError}
            </div>
          )}
        </div>

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
