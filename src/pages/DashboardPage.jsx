import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router'
import Dashboard from '../components/Dashboard'
import SetupNotice from '../components/SetupNotice'
import { useAuth } from '../context/AuthContext'
import { openBillingPortal, startCheckout } from '../lib/billing'

function DashboardPage({ theme, onToggleTheme }) {
  const navigate = useNavigate()
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
    <main className="min-h-screen w-screen overflow-x-hidden">
      <div className="w-screen overflow-x-hidden">
        {!isSupabaseConfigured && <SetupNotice />}

        {verified && (
          <div className="mx-4 mt-4 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 lg:mx-6">
            Your email is verified and your account is ready to use.
          </div>
        )}

        {checkoutState === 'success' && (
          <div className="mx-4 mt-4 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 lg:mx-6">
            Stripe checkout completed. If you add webhooks next, we can sync the
            active subscription status back into Commandly AI automatically.
          </div>
        )}

        {checkoutState === 'canceled' && (
          <div className="mx-4 mt-4 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 lg:mx-6">
            Checkout was canceled before the subscription was completed.
          </div>
        )}

        <Dashboard
          billingLoading={billingLoading}
          mode="live"
          onEditSetup={() => navigate('/onboarding')}
          onManageBilling={handlePortal}
          ownerName={profile?.fullName || user?.email?.split('@')[0] || 'there'}
          onSignOut={signOut}
          onToggleTheme={onToggleTheme}
          theme={theme}
          workspaceName={workspace?.business_name || 'Commandly AI'}
          workspaceType={workspace?.business_type || 'Business workspace'}
        />

        {billingError && (
          <div className="mx-4 mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 lg:mx-6">
            {billingError}
          </div>
        )}
      </div>
    </main>
  )
}

export default DashboardPage
