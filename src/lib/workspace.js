import { supabase } from './supabase'

const REQUEST_TIMEOUT_MS = 12000
const PROFILES_TABLE_MISSING = "Could not find the table 'public.profiles' in the schema cache"

const withTimeout = async (promise, message) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error(message)), REQUEST_TIMEOUT_MS)
    }),
  ])

const attachGoalsToWorkspace = (workspace, goals = []) => {
  if (!workspace) {
    return null
  }

  return {
    ...workspace,
    goals,
  }
}

const isProfilesTableMissingError = (error) =>
  error?.message?.includes(PROFILES_TABLE_MISSING) ||
  error?.message?.includes("relation \"public.profiles\" does not exist")

export async function upsertProfileForUser({ id, email, fullName }) {
  const { error } = await supabase.from('profiles').upsert(
    {
      id,
      email,
      full_name: fullName,
    },
    { onConflict: 'id' },
  )

  if (error) {
    if (isProfilesTableMissingError(error)) {
      return
    }

    throw error
  }
}

export async function fetchWorkspaceForUser(userId) {
  const workspaceResponse = await withTimeout(
    supabase.from('workspaces').select('*').eq('owner_id', userId).maybeSingle(),
    'Loading your workspace took too long. Refresh the page and try again.',
  )

  if (workspaceResponse.error) {
    throw workspaceResponse.error
  }

  if (!workspaceResponse.data) {
    return null
  }

  const goalsResponse = await withTimeout(
    supabase
      .from('workspace_goals')
      .select('goal_key')
      .eq('workspace_id', workspaceResponse.data.id),
    'Loading your workspace goals took too long. Refresh the page and try again.',
  )

  if (goalsResponse.error) {
    throw goalsResponse.error
  }

  return attachGoalsToWorkspace(
    workspaceResponse.data,
    goalsResponse.data?.map((goal) => goal.goal_key) ?? [],
  )
}

export async function saveWorkspaceForUser(userId, payload) {
  const workspacePayload = {
    owner_id: userId,
    business_name: payload.businessName,
    business_type: payload.businessType,
    website_url: payload.websiteUrl,
    business_email: payload.businessEmail,
    phone: payload.phone ?? null,
    logo_url: payload.logoUrl ?? null,
    brand_voice: payload.brandVoice,
    setup_complete: true,
  }

  const existingWorkspaceResponse = await withTimeout(
    supabase.from('workspaces').select('id').eq('owner_id', userId).maybeSingle(),
    'Checking for an existing workspace took too long. Please try again.',
  )

  if (existingWorkspaceResponse.error) {
    throw existingWorkspaceResponse.error
  }

  let workspaceId = existingWorkspaceResponse.data?.id ?? null

  if (workspaceId) {
    const updateResponse = await withTimeout(
      supabase
        .from('workspaces')
        .update(workspacePayload)
        .eq('id', workspaceId)
        .select('id')
        .single(),
      'Updating your workspace took too long. Please try again.',
    )

    if (updateResponse.error) {
      throw updateResponse.error
    }

    workspaceId = updateResponse.data.id
  } else {
    const insertResponse = await withTimeout(
      supabase.from('workspaces').insert(workspacePayload).select('id').single(),
      'Creating your workspace took too long. Please try again.',
    )

    if (insertResponse.error) {
      throw insertResponse.error
    }

    workspaceId = insertResponse.data.id
  }

  const deleteGoalsResponse = await withTimeout(
    supabase.from('workspace_goals').delete().eq('workspace_id', workspaceId),
    'Clearing old workspace goals took too long. Please try again.',
  )

  if (deleteGoalsResponse.error) {
    throw deleteGoalsResponse.error
  }

  if (payload.goals.length > 0) {
    const insertGoalsResponse = await withTimeout(
      supabase.from('workspace_goals').insert(
        payload.goals.map((goal) => ({
          workspace_id: workspaceId,
          goal_key: goal,
        })),
      ),
      'Saving workspace goals took too long. Please try again.',
    )

    if (insertGoalsResponse.error) {
      throw insertGoalsResponse.error
    }
  }

  return fetchWorkspaceForUser(userId)
}

export async function updateWorkspaceForUser(userId, payload) {
  const updatePayload = {
    business_email: payload.businessEmail,
    business_name: payload.businessName,
    business_type: payload.businessType,
    brand_voice: payload.brandVoice,
    logo_url: payload.logoUrl ?? null,
    phone: payload.phone ?? null,
    website_url: payload.websiteUrl,
  }

  const response = await withTimeout(
    supabase
      .from('workspaces')
      .update(updatePayload)
      .eq('owner_id', userId)
      .select('*')
      .single(),
    'Updating your workspace profile took too long. Please try again.',
  )

  if (response.error) {
    throw response.error
  }

  const goalsResponse = await withTimeout(
    supabase.from('workspace_goals').select('goal_key').eq('workspace_id', response.data.id),
    'Loading your updated workspace goals took too long. Please try again.',
  )

  if (goalsResponse.error) {
    throw goalsResponse.error
  }

  return attachGoalsToWorkspace(
    response.data,
    goalsResponse.data?.map((goal) => goal.goal_key) ?? [],
  )
}
