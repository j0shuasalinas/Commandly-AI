import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  Mail,
  Sparkles,
  Store,
  WandSparkles,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import SetupNotice from './SetupNotice'

const progressSteps = ['Business Info', 'Goals', 'AI Style', 'Launch']

const businessTypes = [
  'Restaurant',
  'Barbershop',
  'Gym',
  'Auto Detailing',
  'Real Estate',
  'Agency',
  'Other',
]

const goals = [
  'Create social media content',
  'Reply to customer reviews',
  'Manage new leads',
  'Create email campaigns',
  'Get weekly business insights',
  'Automate customer messages',
]

const voices = ['Professional', 'Friendly', 'Luxury', 'Bold', 'Casual']

const previewModules = [
  { title: 'Content Assistant', description: 'Campaign ideas and brand-ready posts' },
  { title: 'Review Replies', description: 'Fast customer responses with your voice' },
  { title: 'Lead Tracker', description: 'Follow-ups, pipeline stages, and reminders' },
]

function OnboardingPage() {
  const navigate = useNavigate()
  const { isSupabaseConfigured, saveWorkspace, user, workspace } = useAuth()

  const [form, setForm] = useState({
    businessName: '',
    businessType: 'Agency',
    websiteUrl: '',
    businessEmail: user?.email ?? '',
  })
  const [selectedGoals, setSelectedGoals] = useState([
    'Create social media content',
    'Reply to customer reviews',
  ])
  const [selectedVoice, setSelectedVoice] = useState('Professional')
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!workspace) {
      return
    }

    setForm({
      businessName: workspace.business_name ?? '',
      businessType: workspace.business_type ?? 'Agency',
      websiteUrl: workspace.website_url ?? '',
      businessEmail: workspace.business_email ?? user?.email ?? '',
    })
    setSelectedGoals(workspace.goals?.length ? workspace.goals : [])
    setSelectedVoice(workspace.brand_voice ?? 'Professional')
  }, [user?.email, workspace])

  const completedSteps = useMemo(() => {
    let total = 1

    if (selectedGoals.length > 0) {
      total = 2
    }

    if (selectedVoice) {
      total = 3
    }

    if (form.businessName && form.businessEmail) {
      total = 4
    }

    return total
  }, [form.businessEmail, form.businessName, selectedGoals.length, selectedVoice])

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  const toggleGoal = (goal) => {
    setSelectedGoals((currentGoals) =>
      currentGoals.includes(goal)
        ? currentGoals.filter((item) => item !== goal)
        : [...currentGoals, goal],
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await saveWorkspace({
        businessName: form.businessName,
        businessType: form.businessType,
        websiteUrl: form.websiteUrl,
        businessEmail: form.businessEmail,
        brandVoice: selectedVoice,
        goals: selectedGoals,
      })
      setShowSuccess(true)
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to homepage
        </Link>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-card backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-darkcard sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">
              <Sparkles className="h-4 w-4" />
              Workspace Setup
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Set up your AI business workspace.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Tell Commandly AI about your business so it can help with content,
              reviews, leads, and insights.
            </p>

            {!isSupabaseConfigured && <div className="mt-8"><SetupNotice /></div>}

            <div className="mt-8 grid gap-3 sm:grid-cols-4">
              {progressSteps.map((step, index) => {
                const active = completedSteps >= index + 1

                return (
                  <div
                    key={step}
                    className={`rounded-2xl border px-4 py-4 transition ${
                      active
                        ? 'border-brand-200 bg-brand-50 dark:border-brand-500/20 dark:bg-brand-500/10'
                        : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'
                    }`}
                  >
                    <div
                      className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                        active
                          ? 'text-brand-600 dark:text-brand-300'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      Step {index + 1}
                    </div>
                    <div className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                      {step}
                    </div>
                  </div>
                )
              })}
            </div>

            <form className="mt-10 space-y-10" onSubmit={handleSubmit}>
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                      Business Info
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Basic details for your workspace profile.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Business Name
                    </span>
                    <input
                      required
                      type="text"
                      value={form.businessName}
                      onChange={(event) => updateField('businessName', event.target.value)}
                      placeholder="Commandly Creative"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Business Type
                    </span>
                    <select
                      value={form.businessType}
                      onChange={(event) => updateField('businessType', event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    >
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Website URL
                    </span>
                    <input
                      type="url"
                      value={form.websiteUrl}
                      onChange={(event) => updateField('websiteUrl', event.target.value)}
                      placeholder="https://yourbusiness.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Business Email
                    </span>
                    <input
                      required
                      type="email"
                      value={form.businessEmail}
                      onChange={(event) => updateField('businessEmail', event.target.value)}
                      placeholder="hello@yourbusiness.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </label>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                      Business Goals
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Choose what you want Commandly AI to automate first.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {goals.map((goal) => {
                    const selected = selectedGoals.includes(goal)

                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleGoal(goal)}
                        className={`rounded-[1.4rem] border p-5 text-left transition ${
                          selected
                            ? 'border-brand-200 bg-brand-50 shadow-sm dark:border-brand-500/20 dark:bg-brand-500/10'
                            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {goal}
                          </div>
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full ${
                              selected
                                ? 'bg-brand-600 text-white dark:bg-brand-400 dark:text-slate-950'
                                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-100 text-accent-500 dark:bg-accent-500/10 dark:text-accent-300">
                    <WandSparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                      AI Brand Voice
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Pick the tone your AI should use across content and replies.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {voices.map((voice) => {
                    const selected = selectedVoice === voice

                    return (
                      <button
                        key={voice}
                        type="button"
                        onClick={() => setSelectedVoice(voice)}
                        className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
                          selected
                            ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white'
                        }`}
                      >
                        {voice}
                      </button>
                    )
                  })}
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4 border-t border-slate-200 pt-8 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your workspace will be saved to Supabase and loaded every time you
                  sign back in.
                </p>
                <button
                  type="submit"
                  disabled={submitting || !isSupabaseConfigured}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  {submitting ? 'Saving...' : 'Create My AI Workspace'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </section>

          <aside className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-card backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-darkcard sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
                  Live Preview
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                  Your Commandly Workspace
                </h2>
              </div>
              <div className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                Almost ready
              </div>
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(238,244,255,0.94))] p-5 dark:border-slate-800 dark:bg-[linear-gradient(135deg,rgba(2,8,23,0.95),rgba(15,23,42,0.95))]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-950 dark:text-white">
                    {form.businessName || 'Your Business'}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {form.businessType || 'Small Business'}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/80">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    Selected Goals
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(selectedGoals.length > 0
                      ? selectedGoals
                      : ['Create social media content']
                    ).map((goal) => (
                      <span
                        key={goal}
                        className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/80">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    AI Voice
                  </div>
                  <div className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">
                    {selectedVoice || 'Professional'}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Mail className="h-4 w-4" />
                    {form.businessEmail || 'hello@yourbusiness.com'}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white/85 p-4 dark:border-slate-800 dark:bg-slate-950/85">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      Setup status
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Almost ready
                    </div>
                  </div>
                  <BadgeCheck className="h-5 w-5 text-brand-500" />
                </div>

                <div className="mt-4 grid gap-3">
                  {previewModules.map((module) => (
                    <div
                      key={module.title}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {module.title}
                      </div>
                      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {module.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
              <BadgeCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-slate-950 dark:text-white">
              Your Commandly AI workspace is ready.
            </h3>
            <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
              Next step: connect your tools and start automating your daily
              workflows.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                onClick={() => setShowSuccess(false)}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
              >
                Stay Here
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default OnboardingPage
