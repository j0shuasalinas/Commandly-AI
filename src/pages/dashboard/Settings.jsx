import { useEffect, useMemo, useState } from 'react'
import { ImagePlus, LoaderCircle, Upload } from 'lucide-react'
import Card from '../../components/ui/Card'
import Dropdown from '../../components/ui/Dropdown'

const settingsTabs = [
  'Business Profile',
  'AI Preferences',
  'Notifications',
  'Security',
  'Appearance',
]

function ToggleRow({ checked, label, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="text-sm font-medium text-slate-900 dark:text-white">{label}</div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-14 rounded-full transition ${
          checked ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked ? 'left-8' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}

function Settings({ onSaveBusinessProfile, onToggleTheme, profile, theme, workspace }) {
  const [activeTab, setActiveTab] = useState('Business Profile')
  const [compactMode, setCompactMode] = useState(false)
  const [approvalMode, setApprovalMode] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [reviewAlerts, setReviewAlerts] = useState(true)
  const [leadAlerts, setLeadAlerts] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [accent, setAccent] = useState('Blue')
  const [defaultTone, setDefaultTone] = useState(workspace?.brand_voice || 'Professional')
  const [businessForm, setBusinessForm] = useState({
    businessEmail: workspace?.business_email || profile?.email || '',
    businessName: workspace?.business_name || 'Commandly AI',
    businessType: workspace?.business_type || 'Agency',
    logoUrl: workspace?.logo_url || '',
    phone: workspace?.phone || '',
    websiteUrl: workspace?.website_url || '',
  })
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    setBusinessForm({
      businessEmail: workspace?.business_email || profile?.email || '',
      businessName: workspace?.business_name || 'Commandly AI',
      businessType: workspace?.business_type || 'Agency',
      logoUrl: workspace?.logo_url || '',
      phone: workspace?.phone || '',
      websiteUrl: workspace?.website_url || '',
    })
    setDefaultTone(workspace?.brand_voice || 'Professional')
  }, [profile?.email, workspace])

  const businessFields = useMemo(
    () => [
      { key: 'businessName', label: 'Business Name' },
      { key: 'businessType', label: 'Business Type' },
      { key: 'websiteUrl', label: 'Website' },
      { key: 'businessEmail', label: 'Email' },
      { key: 'phone', label: 'Phone' },
    ],
    [],
  )

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const nextLogo = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Could not read the uploaded image.'))
      reader.readAsDataURL(file)
    })

    setBusinessForm((current) => ({
      ...current,
      logoUrl: nextLogo,
    }))
    setSaveMessage('')
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    setSaveMessage('')

    try {
      await onSaveBusinessProfile?.({
        ...businessForm,
        brandVoice: defaultTone,
      })
      setSaveMessage('Business profile updated.')
    } catch (error) {
      setSaveMessage(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6 2xl:grid-cols-[0.26fr_0.74fr]">
      <Card className="p-4">
        <div className="space-y-2">
          {settingsTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
          Configure your workspace, AI behavior, team notifications, and account security from one place.
        </p>

        {activeTab === 'Business Profile' && (
          <div className="mt-8 grid gap-6">
            <div className="flex flex-col gap-4 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-slate-200 dark:bg-slate-800">
                  {businessForm.logoUrl ? (
                    <img src={businessForm.logoUrl} alt="Workspace logo" className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlus className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                  )}
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-950 dark:text-white">Company logo</div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Upload a logo to use in the sidebar and top-right workspace profile.
                  </p>
                </div>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white">
                <Upload className="h-4 w-4" />
                Upload Logo
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {businessFields.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    {field.label}
                  </span>
                  <input
                    type="text"
                    value={businessForm[field.key]}
                    onChange={(event) =>
                      setBusinessForm((current) => ({
                        ...current,
                        [field.key]: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  />
                </label>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {saving ? 'Saving...' : 'Save Business Profile'}
              </button>
              {saveMessage && (
                <span className="text-sm text-slate-500 dark:text-slate-400">{saveMessage}</span>
              )}
            </div>
          </div>
        )}

        {activeTab === 'AI Preferences' && (
          <div className="mt-8 grid gap-4">
            <Dropdown
              items={['Professional', 'Friendly', 'Luxury', 'Bold', 'Casual'].map((item) => ({
                id: item,
                label: item,
              }))}
              label={defaultTone}
              onSelect={(item) => setDefaultTone(item.label)}
            />
            <ToggleRow checked={approvalMode} label="Approval mode" onChange={setApprovalMode} />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Brand words
              </span>
              <input
                type="text"
                defaultValue="smart, premium, trustworthy, local growth"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Words to avoid
              </span>
              <input
                type="text"
                defaultValue="cheap, generic, fake urgency"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
          </div>
        )}

        {activeTab === 'Notifications' && (
          <div className="mt-8 grid gap-4">
            <ToggleRow checked={emailNotifications} label="Email notifications" onChange={setEmailNotifications} />
            <ToggleRow checked={reviewAlerts} label="Review alerts" onChange={setReviewAlerts} />
            <ToggleRow checked={leadAlerts} label="Lead alerts" onChange={setLeadAlerts} />
            <ToggleRow checked={weeklyReports} label="Weekly report" onChange={setWeeklyReports} />
          </div>
        )}

        {activeTab === 'Security' && (
          <div className="mt-8 grid gap-4">
            <button
              type="button"
              className="inline-flex w-fit rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              Change password
            </button>
            <ToggleRow checked={twoFactorEnabled} label="Two-factor authentication" onChange={setTwoFactorEnabled} />
            <Card className="p-4">
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                Active sessions
              </div>
              <div className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div>Current browser session - Active now</div>
                <div>Previous device session - Last active 2 hours ago</div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'Appearance' && (
          <div className="mt-8 grid gap-4">
            <ToggleRow
              checked={theme === 'dark'}
              label="Dark mode"
              onChange={() => onToggleTheme?.()}
            />
            <ToggleRow checked={compactMode} label="Compact mode" onChange={setCompactMode} />
            <Dropdown
              items={['Blue', 'Emerald', 'Amber', 'Rose'].map((item) => ({
                id: item,
                label: item,
              }))}
              label={accent}
              onSelect={(item) => setAccent(item.label)}
            />
          </div>
        )}
      </Card>
    </div>
  )
}

export default Settings
