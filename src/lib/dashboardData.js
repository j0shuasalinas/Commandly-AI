import { supabase } from './supabase'

const REQUEST_TIMEOUT_MS = 12000

const DEFAULT_INTEGRATIONS = [
  {
    action_label: 'Connect',
    description: 'Sync reviews, location insights, and profile activity.',
    integration_key: 'google-business-profile',
    name: 'Google Business Profile',
    status: 'Not Connected',
  },
  {
    action_label: 'Connect',
    description: 'Schedule posts and track engagement from one place.',
    integration_key: 'instagram',
    name: 'Instagram',
    status: 'Not Connected',
  },
  {
    action_label: 'Connect',
    description: 'Pull messages, comments, and local audience activity.',
    integration_key: 'facebook',
    name: 'Facebook',
    status: 'Not Connected',
  },
  {
    action_label: 'Connect',
    description: 'Reply to inbound leads and campaign responses faster.',
    integration_key: 'gmail',
    name: 'Gmail',
    status: 'Not Connected',
  },
  {
    action_label: 'Connect',
    description: 'Track customers, payments, and retention signals.',
    integration_key: 'stripe',
    name: 'Stripe',
    status: 'Not Connected',
  },
  {
    action_label: 'Connect',
    description: 'Measure lead flow and site conversion trends.',
    integration_key: 'google-analytics',
    name: 'Google Analytics',
    status: 'Not Connected',
  },
  {
    action_label: 'Connect',
    description: 'Send new website inquiries straight into leads.',
    integration_key: 'website-forms',
    name: 'Website Forms',
    status: 'Not Connected',
  },
  {
    action_label: 'Coming Soon',
    description: 'Extend Commandly AI into other workflows and tools.',
    integration_key: 'zapier',
    name: 'Zapier',
    status: 'Coming Soon',
  },
]

const withTimeout = async (promise, message) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error(message)), REQUEST_TIMEOUT_MS)
    }),
  ])

const isMissingTableError = (error, tableName) =>
  error?.message?.includes(`Could not find the table 'public.${tableName}'`) ||
  error?.message?.includes(`relation "public.${tableName}" does not exist`)

const isDuplicateKeyError = (error) =>
  error?.code === '23505' || error?.message?.toLowerCase().includes('duplicate key value')

const requireTable = (error, tableName) => {
  if (isMissingTableError(error, tableName)) {
    throw new Error(
      `Supabase table "${tableName}" is missing. Run the updated SQL in supabase/schema.sql and refresh the app.`,
    )
  }

  throw error
}

async function fetchTableRows({ orderBy = 'updated_at', tableName, workspaceId, message }) {
  const response = await withTimeout(
    supabase
      .from(tableName)
      .select('*')
      .eq('workspace_id', workspaceId)
      .order(orderBy, { ascending: false }),
    message,
  )

  if (response.error) {
    if (isMissingTableError(response.error, tableName)) {
      return []
    }

    throw response.error
  }

  return response.data ?? []
}

async function fetchSingleRow({ tableName, workspaceId, message }) {
  const response = await withTimeout(
    supabase.from(tableName).select('*').eq('workspace_id', workspaceId).maybeSingle(),
    message,
  )

  if (response.error) {
    if (isMissingTableError(response.error, tableName)) {
      return null
    }

    throw response.error
  }

  return response.data ?? null
}

async function ensureDefaultIntegrations(workspaceId) {
  const existing = await fetchTableRows({
    tableName: 'workspace_integrations',
    workspaceId,
    message: 'Loading integrations took too long. Please refresh and try again.',
  })

  if (existing.length > 0) {
    return existing
  }

  const response = await withTimeout(
    supabase
      .from('workspace_integrations')
      .insert(DEFAULT_INTEGRATIONS.map((item) => ({ workspace_id: workspaceId, ...item })))
      .select('*'),
    'Setting up default integrations took too long. Please refresh and try again.',
  )

  if (response.error) {
    if (isDuplicateKeyError(response.error)) {
      return fetchTableRows({
        tableName: 'workspace_integrations',
        workspaceId,
        message: 'Loading integrations took too long. Please refresh and try again.',
      })
    }

    requireTable(response.error, 'workspace_integrations')
  }

  return response.data ?? []
}

async function ensureOwnerTeamMember(workspaceId, owner) {
  const existing = await fetchTableRows({
    orderBy: 'created_at',
    tableName: 'workspace_team_members',
    workspaceId,
    message: 'Loading team members took too long. Please refresh and try again.',
  })

  if (existing.length > 0) {
    return existing
  }

  const response = await withTimeout(
    supabase
      .from('workspace_team_members')
      .insert({
        email: owner.email,
        name: owner.name,
        role: 'Owner',
        workspace_id: workspaceId,
      })
      .select('*'),
    'Creating the owner team member took too long. Please refresh and try again.',
  )

  if (response.error) {
    if (isDuplicateKeyError(response.error)) {
      return fetchTableRows({
        orderBy: 'created_at',
        tableName: 'workspace_team_members',
        workspaceId,
        message: 'Loading team members took too long. Please refresh and try again.',
      })
    }

    requireTable(response.error, 'workspace_team_members')
  }

  return response.data ?? []
}

async function ensureBillingState(workspaceId, counts) {
  const existing = await fetchSingleRow({
    tableName: 'workspace_billing_state',
    workspaceId,
    message: 'Loading billing state took too long. Please refresh and try again.',
  })

  const payload = {
    campaigns_created: counts.campaigns,
    leads_tracked: counts.leads,
    prompts_used: counts.drafts,
    review_replies_used: counts.reviews,
    workspace_id: workspaceId,
  }

  if (existing) {
    const response = await withTimeout(
      supabase
        .from('workspace_billing_state')
        .update(payload)
        .eq('workspace_id', workspaceId)
        .select('*')
        .single(),
      'Updating billing state took too long. Please refresh and try again.',
    )

    if (response.error) {
      requireTable(response.error, 'workspace_billing_state')
    }

    return response.data
  }

  const response = await withTimeout(
    supabase.from('workspace_billing_state').insert(payload).select('*').single(),
    'Creating billing state took too long. Please refresh and try again.',
  )

  if (response.error) {
    if (isDuplicateKeyError(response.error)) {
      return fetchSingleRow({
        tableName: 'workspace_billing_state',
        workspaceId,
        message: 'Loading billing state took too long. Please refresh and try again.',
      })
    }

    requireTable(response.error, 'workspace_billing_state')
  }

  return response.data
}

export async function fetchDashboardCollections(workspaceId, owner) {
  const [leads, campaigns, automations, reviews, drafts] = await Promise.all([
    fetchTableRows({
      tableName: 'workspace_leads',
      workspaceId,
      message: 'Loading leads took too long. Please refresh and try again.',
    }),
    fetchTableRows({
      tableName: 'workspace_campaigns',
      workspaceId,
      message: 'Loading campaigns took too long. Please refresh and try again.',
    }),
    fetchTableRows({
      tableName: 'workspace_automations',
      workspaceId,
      message: 'Loading automations took too long. Please refresh and try again.',
    }),
    fetchTableRows({
      tableName: 'workspace_reviews',
      workspaceId,
      message: 'Loading reviews took too long. Please refresh and try again.',
    }),
    fetchTableRows({
      tableName: 'workspace_ai_drafts',
      workspaceId,
      message: 'Loading AI drafts took too long. Please refresh and try again.',
    }),
  ])

  const [integrations, teamMembers, billingState] = await Promise.all([
    ensureDefaultIntegrations(workspaceId),
    ensureOwnerTeamMember(workspaceId, owner),
    ensureBillingState(workspaceId, {
      campaigns: campaigns.length,
      drafts: drafts.length,
      leads: leads.length,
      reviews: reviews.filter((item) => item.status === 'Published').length,
    }),
  ])

  return { automations, billingState, campaigns, drafts, integrations, leads, reviews, teamMembers }
}

export async function createLeadForWorkspace(workspaceId, payload) {
  const response = await withTimeout(
    supabase
      .from('workspace_leads')
      .insert({
        workspace_id: workspaceId,
        ...payload,
      })
      .select('*')
      .single(),
    'Creating the lead took too long. Please try again.',
  )

  if (response.error) {
    requireTable(response.error, 'workspace_leads')
  }

  return response.data
}

export async function updateLeadForWorkspace(workspaceId, leadId, payload) {
  const response = await withTimeout(
    supabase
      .from('workspace_leads')
      .update(payload)
      .eq('workspace_id', workspaceId)
      .eq('id', leadId)
      .select('*')
      .single(),
    'Updating the lead took too long. Please try again.',
  )

  if (response.error) {
    requireTable(response.error, 'workspace_leads')
  }

  return response.data
}

export async function createCampaignForWorkspace(workspaceId, payload) {
  const response = await withTimeout(
    supabase
      .from('workspace_campaigns')
      .insert({
        workspace_id: workspaceId,
        ...payload,
      })
      .select('*')
      .single(),
    'Creating the campaign took too long. Please try again.',
  )

  if (response.error) {
    requireTable(response.error, 'workspace_campaigns')
  }

  return response.data
}

export async function createAutomationForWorkspace(workspaceId, payload) {
  const response = await withTimeout(
    supabase
      .from('workspace_automations')
      .insert({
        workspace_id: workspaceId,
        ...payload,
      })
      .select('*')
      .single(),
    'Creating the automation took too long. Please try again.',
  )

  if (response.error) {
    requireTable(response.error, 'workspace_automations')
  }

  return response.data
}

export async function updateAutomationForWorkspace(workspaceId, automationId, payload) {
  const response = await withTimeout(
    supabase
      .from('workspace_automations')
      .update(payload)
      .eq('workspace_id', workspaceId)
      .eq('id', automationId)
      .select('*')
      .single(),
    'Updating the automation took too long. Please try again.',
  )

  if (response.error) {
    requireTable(response.error, 'workspace_automations')
  }

  return response.data
}

export async function createDraftForWorkspace(workspaceId, payload) {
  const response = await withTimeout(
    supabase
      .from('workspace_ai_drafts')
      .insert({
        workspace_id: workspaceId,
        ...payload,
      })
      .select('*')
      .single(),
    'Saving the draft took too long. Please try again.',
  )

  if (response.error) {
    requireTable(response.error, 'workspace_ai_drafts')
  }

  return response.data
}

export async function updateIntegrationForWorkspace(workspaceId, integrationId, payload) {
  const response = await withTimeout(
    supabase
      .from('workspace_integrations')
      .update(payload)
      .eq('workspace_id', workspaceId)
      .eq('id', integrationId)
      .select('*')
      .single(),
    'Updating the integration took too long. Please try again.',
  )

  if (response.error) {
    requireTable(response.error, 'workspace_integrations')
  }

  return response.data
}

export async function createTeamMemberForWorkspace(workspaceId, payload) {
  const response = await withTimeout(
    supabase
      .from('workspace_team_members')
      .insert({
        workspace_id: workspaceId,
        ...payload,
      })
      .select('*')
      .single(),
    'Inviting the team member took too long. Please try again.',
  )

  if (response.error) {
    requireTable(response.error, 'workspace_team_members')
  }

  return response.data
}

export async function updateTeamMemberForWorkspace(workspaceId, teamMemberId, payload) {
  const response = await withTimeout(
    supabase
      .from('workspace_team_members')
      .update(payload)
      .eq('workspace_id', workspaceId)
      .eq('id', teamMemberId)
      .select('*')
      .single(),
    'Updating the team member took too long. Please try again.',
  )

  if (response.error) {
    requireTable(response.error, 'workspace_team_members')
  }

  return response.data
}

export async function updateBillingStateForWorkspace(workspaceId, payload) {
  const response = await withTimeout(
    supabase
      .from('workspace_billing_state')
      .update(payload)
      .eq('workspace_id', workspaceId)
      .select('*')
      .single(),
    'Updating billing state took too long. Please try again.',
  )

  if (response.error) {
    requireTable(response.error, 'workspace_billing_state')
  }

  return response.data
}
