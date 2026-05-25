import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react'
import SetupNotice from '../components/SetupNotice'
import { useAuth } from '../context/AuthContext'

function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const mode = searchParams.get('mode') === 'signin' ? 'signin' : 'signup'
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signUp, user, workspace, isSupabaseConfigured } = useAuth()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const title = useMemo(
    () =>
      mode === 'signin'
        ? 'Sign in to your Commandly AI workspace.'
        : 'Create your Commandly AI account.',
    [mode],
  )

  useEffect(() => {
    if (user) {
      navigate(workspace ? '/dashboard' : '/onboarding', { replace: true })
    }
  }, [navigate, user, workspace])

  const setMode = (nextMode) => {
    setSearchParams({ mode: nextMode })
    setError('')
    setMessage('')
  }

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'signin') {
        await signIn({
          email: form.email,
          password: form.password,
        })
        const nextPath = location.state?.from?.pathname ?? '/dashboard'
        navigate(nextPath, { replace: true })
      } else {
        const result = await signUp({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
        })

        if (!result.session) {
          setMessage(
            'Your account was created. Check your email to confirm your address, then sign in.',
          )
          setMode('signin')
        } else {
          navigate('/onboarding', { replace: true })
        }
      }
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-card backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-darkcard sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">
            <Sparkles className="h-4 w-4" />
            Secure Access
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Use email and password auth powered by Supabase, then save your
            business workspace in Postgres.
          </p>

          {!isSupabaseConfigured && <div className="mt-8"><SetupNotice /></div>}

          <div className="mt-8 flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                mode === 'signup'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                  : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Create account
            </button>
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                mode === 'signin'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                  : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Sign in
            </button>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Full Name
                </span>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(event) => updateField('fullName', event.target.value)}
                    placeholder="Josh Salinas"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Email
              </span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="you@business.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Password
              </span>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  placeholder="Create a secure password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </label>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {loading
                ? 'Working...'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create My Account'}
            </button>
          </form>
        </section>

        <aside className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-card backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-darkcard sm:p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
            Backend Stack
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Your MVP now has a real auth and data architecture.
          </h2>
          <div className="mt-6 space-y-4">
            {[
              'Supabase Auth for email and password login',
              'Protected routes for onboarding and dashboard',
              'Profiles and workspaces stored in Postgres',
              'Onboarding data saved and reloaded per account',
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Need a Supabase project first? Follow the setup notes in the repo and
            drop your keys into `.env.local`.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
          >
            Back to homepage
          </Link>
        </aside>
      </div>
    </main>
  )
}

export default AuthPage
