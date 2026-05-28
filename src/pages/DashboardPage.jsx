import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useSearchParams } from 'react-router'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import SetupNotice from '../components/SetupNotice'
import { generateWorkspaceText } from '../lib/ai'
import {
  createAutomationForWorkspace,
  createCampaignForWorkspace,
  createDraftForWorkspace,
  createLeadForWorkspace,
  createTeamMemberForWorkspace,
  deleteDraftForWorkspace,
  fetchDashboardCollections,
  updateAutomationForWorkspace,
  updateBillingStateForWorkspace,
  updateIntegrationForWorkspace,
  updateLeadForWorkspace,
  updateTeamMemberForWorkspace,
} from '../lib/dashboardData'
import { useAuth } from '../context/AuthContext'
import AIWriter from './dashboard/AIWriter'
import Analytics from './dashboard/Analytics'
import Automations from './dashboard/Automations'
import Billing from './dashboard/Billing'
import Campaigns from './dashboard/Campaigns'
import Integrations from './dashboard/Integrations'
import Leads from './dashboard/Leads'
import Overview from './dashboard/Overview'
import Reviews from './dashboard/Reviews'
import Settings from './dashboard/Settings'
import Team from './dashboard/Team'

const AUTOMATION_TEMPLATES = [
  {
    title: 'Auto-reply to new reviews',
    description: 'Generate a branded reply whenever a new review arrives.',
    trigger_label: 'New review arrives',
    action_label: 'Draft AI reply',
    approval_label: 'Owner approval',
    output_label: 'Publish to source',
  },
  {
    title: 'Weekly social content plan',
    description: 'Build a weekly queue of social post ideas for your team.',
    trigger_label: 'Every Monday',
    action_label: 'Generate content plan',
    approval_label: 'Manager approval',
    output_label: 'Save to workspace queue',
  },
  {
    title: 'Lead follow-up reminder',
    description: 'Flag leads that have not been contacted quickly enough.',
    trigger_label: 'Lead sits idle for 24 hours',
    action_label: 'Generate follow-up reminder',
    approval_label: 'Auto-queue',
    output_label: 'Notify owner',
  },
]

function DashboardPage({ theme, onToggleTheme }) {
  const navigate = useNavigate()
  const { isSupabaseConfigured, profile, signOut, updateWorkspace, user, workspace } = useAuth()
  const [searchParams] = useSearchParams()
  const [dashboardState, setDashboardState] = useState({
    automations: [],
    billingState: null,
    campaigns: [],
    drafts: [],
    error: '',
    integrations: [],
    leads: [],
    loading: false,
    reviews: [],
    teamMembers: [],
  })
  const verified = searchParams.get('verified') === '1'
  const checkoutState = searchParams.get('checkout')

  useEffect(() => {
    if (!isSupabaseConfigured || !workspace?.id) {
      setDashboardState({
        automations: [],
        billingState: null,
        campaigns: [],
        drafts: [],
        error: '',
        integrations: [],
        leads: [],
        loading: false,
        reviews: [],
        teamMembers: [],
      })
      return
    }

    let isMounted = true

    const owner = {
      email: profile?.email || user?.email || '',
      name:
        profile?.fullName ||
        profile?.full_name ||
        user?.user_metadata?.full_name ||
        user?.email?.split('@')[0] ||
        'Owner',
    }

    const loadDashboard = async () => {
      setDashboardState((current) => ({
        ...current,
        loading: true,
        error: '',
      }))

      try {
        const collections = await fetchDashboardCollections(workspace.id, owner)

        if (!isMounted) {
          return
        }

        setDashboardState({
          ...collections,
          error: '',
          loading: false,
        })
      } catch (error) {
        if (!isMounted) {
          return
        }

        setDashboardState((current) => ({
          ...current,
          error: error.message,
          loading: false,
        }))
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [isSupabaseConfigured, profile?.email, profile?.fullName, profile?.full_name, user?.email, user?.user_metadata?.full_name, workspace?.id])

  if (isSupabaseConfigured && user && !workspace) {
    return <Navigate to="/onboarding" replace />
  }

  const ownerName =
    profile?.fullName ||
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'there'

  const workspaceName = workspace?.business_name || 'Commandly AI'
  const workspaceType = workspace?.business_type || 'Business workspace'
  const workspaceLogo = workspace?.logo_url || ''

  const recentActivity = useMemo(() => {
    const leadActivity = dashboardState.leads.map((lead) => ({
      id: `lead-${lead.id}`,
      title: 'New lead added',
      detail: `${lead.name} entered the pipeline from ${lead.source}.`,
      time: lead.updated_at || lead.created_at,
      type: 'Lead',
    }))

    const campaignActivity = dashboardState.campaigns.map((campaign) => ({
      id: `campaign-${campaign.id}`,
      title: 'Campaign saved',
      detail: `${campaign.name} was created as a ${campaign.status.toLowerCase()} campaign.`,
      time: campaign.updated_at || campaign.created_at,
      type: 'Campaign',
    }))

    const automationActivity = dashboardState.automations.map((automation) => ({
      id: `automation-${automation.id}`,
      title: automation.enabled ? 'Automation enabled' : 'Automation saved',
      detail: `${automation.title} is ${automation.enabled ? 'active' : automation.status.toLowerCase()}.`,
      time: automation.updated_at || automation.created_at,
      type: 'Automation',
    }))

    const draftActivity = dashboardState.drafts.map((draft) => ({
      id: `draft-${draft.id}`,
      title: 'AI draft saved',
      detail: `${draft.title} was saved to your writing workspace.`,
      time: draft.updated_at || draft.created_at,
      type: 'Draft',
    }))

    return [...leadActivity, ...campaignActivity, ...automationActivity, ...draftActivity]
      .sort((left, right) => new Date(right.time).getTime() - new Date(left.time).getTime())
      .slice(0, 5)
  }, [dashboardState.automations, dashboardState.campaigns, dashboardState.drafts, dashboardState.leads])

  const searchItems = useMemo(
    () => [
      ...dashboardState.campaigns.map((item) => ({
        id: item.id,
        path: '/dashboard/campaigns',
        subtitle: `${item.channel} - ${item.status}`,
        title: item.name,
        type: 'Campaign',
      })),
      ...dashboardState.leads.map((item) => ({
        id: item.id,
        path: '/dashboard/leads',
        subtitle: `${item.source} - ${item.status}`,
        title: item.name,
        type: 'Lead',
      })),
      ...dashboardState.automations.map((item) => ({
        id: item.id,
        path: '/dashboard/automations',
        subtitle: item.status,
        title: item.title,
        type: 'Automation',
      })),
      ...dashboardState.reviews.map((item) => ({
        id: item.id,
        path: '/dashboard/reviews',
        subtitle: `${item.source} - ${item.status}`,
        title: item.customer,
        type: 'Review',
      })),
      ...dashboardState.drafts.map((item) => ({
        id: item.id,
        path: '/dashboard/ai-writer',
        subtitle: item.template || 'Draft',
        title: item.title,
        type: 'Draft',
      })),
    ],
    [
      dashboardState.automations,
      dashboardState.campaigns,
      dashboardState.drafts,
      dashboardState.leads,
      dashboardState.reviews,
    ],
  )

  const notifications = useMemo(
    () =>
      recentActivity.slice(0, 4).map((item, index) => ({
        id: `${item.id}-${index}`,
        title: item.title,
        detail: item.detail,
        time: new Date(item.time).toLocaleDateString(),
      })),
    [recentActivity],
  )

  const overviewStats = useMemo(
    () => [
      {
        label: 'AI Tasks Completed',
        value: dashboardState.automations.filter((item) => item.enabled).length,
        detail:
          dashboardState.automations.length > 0
            ? `${dashboardState.automations.filter((item) => item.enabled).length} active automations`
            : 'No automations have run yet',
      },
      {
        label: 'New Leads',
        value: dashboardState.leads.length,
        detail:
          dashboardState.leads.length > 0
            ? `${dashboardState.leads.filter((item) => item.status === 'New').length} waiting for first contact`
            : 'Your lead inbox is ready for first contacts',
      },
      {
        label: 'Reviews Replied',
        value: dashboardState.reviews.filter((item) => item.status === 'Published').length,
        detail:
          dashboardState.reviews.length > 0
            ? `${dashboardState.reviews.filter((item) => item.status === 'New').length} waiting for reply`
            : 'Connect reviews to start response drafts',
      },
      {
        label: 'Content Created',
        value: dashboardState.drafts.length,
        detail:
          dashboardState.drafts.length > 0
            ? `${dashboardState.drafts.length} saved drafts in your workspace`
            : 'Generate your first campaign from the prompt box',
      },
    ],
    [
      dashboardState.automations,
      dashboardState.drafts,
      dashboardState.leads,
      dashboardState.reviews,
    ],
  )

  const setError = (message) => {
    setDashboardState((current) => ({
      ...current,
      error: message,
    }))
  }

  const handleCreateLead = async (leadInput = {}) => {
    if (!workspace?.id) {
      return
    }

    try {
      const nextLead = await createLeadForWorkspace(workspace.id, {
        email: leadInput.email || 'hello@newlead.co',
        last_contact: leadInput.last_contact || 'Not contacted',
        name: leadInput.name || 'New Lead',
        next_step: leadInput.next_step || 'Generate follow-up',
        note: leadInput.note || 'Added from the lead modal for workspace testing.',
        phone: leadInput.phone || '(555) 111-2299',
        source: leadInput.source || 'Manual',
        status: leadInput.status || 'New',
      })

      setDashboardState((current) => ({
        ...current,
        error: '',
        leads: [nextLead, ...current.leads],
      }))
      return nextLead
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const handleUpdateLead = async (leadId, leadPayload = {}) => {
    if (!workspace?.id) {
      return
    }

    try {
      const nextLead = await updateLeadForWorkspace(workspace.id, leadId, {
        ...leadPayload,
      })

      setDashboardState((current) => ({
        ...current,
        error: '',
        leads: current.leads.map((lead) => (lead.id === leadId ? nextLead : lead)),
      }))
      return nextLead
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const handleMarkLeadContacted = async (leadId) =>
    handleUpdateLead(leadId, {
      last_contact: 'Just now',
      next_step: 'Send proposal',
      status: 'Contacted',
    })

  const handleCreateCampaign = async (campaignInput) => {
    if (!workspace?.id) {
      return
    }

    const channel = typeof campaignInput === 'string' ? campaignInput : campaignInput?.channel || 'Social Media'
    const name =
      typeof campaignInput === 'string'
        ? `${campaignInput} Launch Builder`
        : campaignInput?.name || `${channel} Launch Builder`
    const performance =
      typeof campaignInput === 'string'
        ? { clicks: '0', conversions: '0', reach: '0' }
        : campaignInput?.performance || { clicks: '0', conversions: '0', reach: '0' }
    const scheduledDate =
      typeof campaignInput === 'string'
        ? 'June 5, 2026'
        : campaignInput?.scheduled_date || 'June 5, 2026'
    const status = typeof campaignInput === 'string' ? 'Draft' : campaignInput?.status || 'Draft'

    try {
      const nextCampaign = await createCampaignForWorkspace(workspace.id, {
        channel,
        name,
        performance,
        scheduled_date: scheduledDate,
        status,
      })

      const nextBillingState =
        dashboardState.billingState &&
        (await updateBillingStateForWorkspace(workspace.id, {
          campaigns_created: dashboardState.campaigns.length + 1,
        }))

      setDashboardState((current) => ({
        ...current,
        billingState: nextBillingState || current.billingState,
        campaigns: [nextCampaign, ...current.campaigns],
        error: '',
      }))
    } catch (error) {
      setError(error.message)
    }
  }

  const handleCreateAutomation = async (templateIndex = 0) => {
    if (!workspace?.id) {
      return
    }

    const template = AUTOMATION_TEMPLATES[templateIndex] ?? AUTOMATION_TEMPLATES[0]

    try {
      const nextAutomation = await createAutomationForWorkspace(workspace.id, {
        action_label: template.action_label,
        approval_label: template.approval_label,
        description: template.description,
        enabled: false,
        output_label: template.output_label,
        status: 'Paused',
        title: template.title,
        trigger_label: template.trigger_label,
      })

      setDashboardState((current) => ({
        ...current,
        automations: [nextAutomation, ...current.automations],
        error: '',
      }))
    } catch (error) {
      setError(error.message)
    }
  }

  const handleToggleAutomation = async (automation) => {
    if (!workspace?.id) {
      return
    }

    try {
      const nextAutomation = await updateAutomationForWorkspace(workspace.id, automation.id, {
        enabled: !automation.enabled,
        status: automation.enabled ? 'Paused' : 'Active',
      })

      setDashboardState((current) => ({
        ...current,
        automations: current.automations.map((item) =>
          item.id === automation.id ? nextAutomation : item,
        ),
        error: '',
      }))
    } catch (error) {
      setError(error.message)
    }
  }

  const handleSaveDraft = async (payload) => {
    if (!workspace?.id) {
      return
    }

    try {
      const nextDraft = await createDraftForWorkspace(workspace.id, payload)
      const nextBillingState =
        dashboardState.billingState &&
        (await updateBillingStateForWorkspace(workspace.id, {
          prompts_used: dashboardState.drafts.length + 1,
        }))

      setDashboardState((current) => ({
        ...current,
        billingState: nextBillingState || current.billingState,
        drafts: [nextDraft, ...current.drafts],
        error: '',
      }))
    } catch (error) {
      setError(error.message)
    }
  }

  const handleDuplicateDraft = async (draft) => {
    if (!workspace?.id) {
      return
    }

    try {
      const nextDraft = await createDraftForWorkspace(workspace.id, {
        goal: draft.goal,
        output: draft.output,
        prompt: draft.prompt,
        template: draft.template,
        title: `${draft.title} Copy`,
        tone: draft.tone,
      })

      const nextBillingState =
        dashboardState.billingState &&
        (await updateBillingStateForWorkspace(workspace.id, {
          prompts_used: dashboardState.drafts.length + 1,
        }))

      setDashboardState((current) => ({
        ...current,
        billingState: nextBillingState || current.billingState,
        drafts: [nextDraft, ...current.drafts],
        error: '',
      }))
    } catch (error) {
      setError(error.message)
    }
  }

  const handleDeleteDraft = async (draftId) => {
    if (!workspace?.id) {
      return
    }

    try {
      await deleteDraftForWorkspace(workspace.id, draftId)
      const nextBillingState =
        dashboardState.billingState &&
        (await updateBillingStateForWorkspace(workspace.id, {
          prompts_used: Math.max(dashboardState.drafts.length - 1, 0),
        }))

      setDashboardState((current) => ({
        ...current,
        billingState: nextBillingState || current.billingState,
        drafts: current.drafts.filter((draft) => draft.id !== draftId),
        error: '',
      }))
    } catch (error) {
      setError(error.message)
    }
  }

  const handleToggleIntegration = async (integration) => {
    if (!workspace?.id || integration.status === 'Coming Soon') {
      return
    }

    try {
      const connected = integration.status === 'Connected'
      const nextIntegration = await updateIntegrationForWorkspace(workspace.id, integration.id, {
        action_label: connected ? 'Connect' : 'Manage',
        status: connected ? 'Not Connected' : 'Connected',
      })

      setDashboardState((current) => ({
        ...current,
        error: '',
        integrations: current.integrations.map((item) =>
          item.id === integration.id ? nextIntegration : item,
        ),
      }))
    } catch (error) {
      setError(error.message)
    }
  }

  const handleSendDraftToCampaigns = async ({ channel, name }) => {
    if (!workspace?.id) {
      return
    }

    try {
      const nextCampaign = await createCampaignForWorkspace(workspace.id, {
        channel,
        name,
        performance: { clicks: '0', conversions: '0', reach: '0' },
        scheduled_date: 'Draft campaign',
        status: 'Draft',
      })

      const nextBillingState =
        dashboardState.billingState &&
        (await updateBillingStateForWorkspace(workspace.id, {
          campaigns_created: dashboardState.campaigns.length + 1,
        }))

      setDashboardState((current) => ({
        ...current,
        billingState: nextBillingState || current.billingState,
        campaigns: [nextCampaign, ...current.campaigns],
        error: '',
      }))
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const handleInviteTeamMember = async () => {
    if (!workspace?.id) {
      return
    }

    try {
      const nextMember = await createTeamMemberForWorkspace(workspace.id, {
        email: `member${dashboardState.teamMembers.length + 1}@${workspaceName.toLowerCase().replace(/\s+/g, '')}.co`,
        name: `Team Member ${dashboardState.teamMembers.length}`,
        role: 'Viewer',
      })

      setDashboardState((current) => ({
        ...current,
        error: '',
        teamMembers: [...current.teamMembers, nextMember],
      }))
    } catch (error) {
      setError(error.message)
    }
  }

  const handleUpdateTeamRole = async (memberId, role) => {
    if (!workspace?.id) {
      return
    }

    try {
      const nextMember = await updateTeamMemberForWorkspace(workspace.id, memberId, { role })

      setDashboardState((current) => ({
        ...current,
        error: '',
        teamMembers: current.teamMembers.map((member) =>
          member.id === memberId ? nextMember : member,
        ),
      }))
    } catch (error) {
      setError(error.message)
    }
  }

  const handleSelectPlan = async (plan) => {
    if (!workspace?.id || !dashboardState.billingState) {
      return
    }

    try {
      const nextBillingState = await updateBillingStateForWorkspace(workspace.id, {
        current_plan: plan,
      })

      setDashboardState((current) => ({
        ...current,
        billingState: nextBillingState,
        error: '',
      }))
    } catch (error) {
      setError(error.message)
    }
  }

  const billingUsage = [
    { label: 'AI prompts used', value: `${dashboardState.billingState?.prompts_used ?? 0}` },
    { label: 'Review replies', value: `${dashboardState.billingState?.review_replies_used ?? 0}` },
    { label: 'Campaigns created', value: `${dashboardState.billingState?.campaigns_created ?? dashboardState.campaigns.length}` },
    { label: 'Leads tracked', value: `${dashboardState.billingState?.leads_tracked ?? dashboardState.leads.length}` },
  ]

  const workspaceMetrics = {
    automations: dashboardState.automations.length,
    campaigns: dashboardState.campaigns.length,
    drafts: dashboardState.drafts.length,
    leads: dashboardState.leads.length,
    reviews: dashboardState.reviews.length,
  }

  const handleGenerateText = async ({ goal, mode, prompt, template, tone }) =>
    generateWorkspaceText({
      businessType: workspace?.business_type,
      goal,
      mode,
      prompt,
      template,
      tone: tone || workspace?.brand_voice,
      workspaceName,
      workspaceStats: workspaceMetrics,
    })

  const handleSaveBusinessProfile = async (payload) => {
    await updateWorkspace({
      brandVoice: payload.brandVoice || workspace?.brand_voice || 'Professional',
      businessEmail: payload.businessEmail,
      businessName: payload.businessName,
      businessType: payload.businessType,
      logoUrl: payload.logoUrl,
      phone: payload.phone,
      websiteUrl: payload.websiteUrl,
    })
  }

  return (
    <main className="min-h-screen w-screen overflow-x-hidden bg-slate-100 dark:bg-slate-950">
      {!isSupabaseConfigured && <SetupNotice />}

      <div className="grid min-h-screen w-screen xl:grid-cols-[260px_minmax(0,1fr)]">
        <Sidebar workspaceLogo={workspaceLogo} workspaceName={workspaceName} workspaceType={workspaceType} />

        <section className="min-w-0 bg-slate-50 p-4 dark:bg-[#071120] lg:p-6">
          <Topbar
            notifications={notifications}
            ownerName={ownerName}
            onSignOut={signOut}
            onToggleTheme={onToggleTheme}
            searchItems={searchItems}
            theme={theme}
            workspaceLogo={workspaceLogo}
          />

          {(verified || checkoutState || dashboardState.error) && (
            <div className="mt-4 grid gap-3">
              {verified && (
                <div className="rounded-[1.4rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                  Your email is verified and your account is ready to use.
                </div>
              )}

              {checkoutState === 'success' && (
                <div className="rounded-[1.4rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                  Stripe checkout completed. Billing can now be connected to live subscription syncing whenever you are ready.
                </div>
              )}

              {checkoutState === 'canceled' && (
                <div className="rounded-[1.4rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                  Checkout was canceled before the subscription was completed.
                </div>
              )}

              {dashboardState.error && (
                <div className="rounded-[1.4rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                  {dashboardState.error}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 pb-8">
            <Routes>
              <Route
                index
                element={
                  <Overview
                    loading={dashboardState.loading}
                    onGenerateInsight={(payload) =>
                      handleGenerateText({
                        mode: 'overview',
                        prompt: payload.prompt,
                      })
                    }
                    recentActivity={recentActivity}
                    stats={overviewStats}
                    workspaceMetrics={workspaceMetrics}
                  />
                }
              />
              <Route path="overview" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="ai-writer"
                element={
                  <AIWriter
                    drafts={dashboardState.drafts}
                    onDeleteDraft={handleDeleteDraft}
                    onDuplicateDraft={handleDuplicateDraft}
                    onGenerate={handleGenerateText}
                    onSaveDraft={handleSaveDraft}
                    onSendToCampaigns={handleSendDraftToCampaigns}
                    workspace={workspace}
                  />
                }
              />
              <Route
                path="reviews"
                element={<Reviews reviews={dashboardState.reviews} />}
              />
              <Route
                path="campaigns"
                element={
                  <Campaigns
                    campaigns={dashboardState.campaigns}
                    loading={dashboardState.loading}
                    onCreateCampaign={handleCreateCampaign}
                  />
                }
              />
              <Route
                path="leads"
                element={
                  <Leads
                    leads={dashboardState.leads}
                    loading={dashboardState.loading}
                    onAddLead={handleCreateLead}
                    onMarkAsContacted={handleMarkLeadContacted}
                    onUpdateLead={handleUpdateLead}
                    workspace={workspace}
                  />
                }
              />
              <Route
                path="analytics"
                element={
                  <Analytics
                    automations={dashboardState.automations}
                    campaigns={dashboardState.campaigns}
                    leads={dashboardState.leads}
                  />
                }
              />
              <Route
                path="automations"
                element={
                  <Automations
                    automations={dashboardState.automations}
                    loading={dashboardState.loading}
                    onCreateAutomation={handleCreateAutomation}
                    onToggleAutomation={handleToggleAutomation}
                  />
                }
              />
              <Route
                path="integrations"
                element={
                  <Integrations
                    integrations={dashboardState.integrations}
                    onToggleIntegration={handleToggleIntegration}
                  />
                }
              />
              <Route
                path="team"
                element={
                  <Team
                    members={dashboardState.teamMembers}
                    onInviteMember={handleInviteTeamMember}
                    onUpdateRole={handleUpdateTeamRole}
                    ownerName={ownerName}
                  />
                }
              />
              <Route
                path="billing"
                element={
                  <Billing
                    billingUsage={billingUsage}
                    currentPlan={dashboardState.billingState?.current_plan || null}
                    onSelectPlan={handleSelectPlan}
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <Settings
                    onSaveBusinessProfile={handleSaveBusinessProfile}
                    onToggleTheme={onToggleTheme}
                    profile={profile}
                    theme={theme}
                    workspace={workspace}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>

          <div className="fixed bottom-5 right-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/onboarding')}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              Edit setup
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/billing')}
              className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Billing
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

export default DashboardPage
