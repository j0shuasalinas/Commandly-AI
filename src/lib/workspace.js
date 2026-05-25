import { supabase } from './supabase'

const normalizeWorkspace = (workspace) => {
  if (!workspace) {
    return null
  }

  return {
    ...workspace,
    goals: workspace.workspace_goals?.map((goal) => goal.goal_key) ?? [],
  }
}

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
    throw error
  }
}

export async function fetchWorkspaceForUser(userId) {
  const { data, error } = await supabase
    .from('workspaces')
    .select('*, workspace_goals(goal_key)')
    .eq('owner_id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return normalizeWorkspace(data)
}

export async function saveWorkspaceForUser(userId, payload) {
  const workspacePayload = {
    owner_id: userId,
    business_name: payload.businessName,
    business_type: payload.businessType,
    website_url: payload.websiteUrl,
    business_email: payload.businessEmail,
    brand_voice: payload.brandVoice,
    setup_complete: true,
  }

  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .upsert(workspacePayload, { onConflict: 'owner_id' })
    .select('id')
    .single()

  if (workspaceError) {
    throw workspaceError
  }

  const { error: deleteGoalsError } = await supabase
    .from('workspace_goals')
    .delete()
    .eq('workspace_id', workspace.id)

  if (deleteGoalsError) {
    throw deleteGoalsError
  }

  if (payload.goals.length > 0) {
    const { error: insertGoalsError } = await supabase.from('workspace_goals').insert(
      payload.goals.map((goal) => ({
        workspace_id: workspace.id,
        goal_key: goal,
      })),
    )

    if (insertGoalsError) {
      throw insertGoalsError
    }
  }

  return fetchWorkspaceForUser(userId)
}
