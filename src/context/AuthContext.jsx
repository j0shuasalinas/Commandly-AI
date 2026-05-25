import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import {
  fetchWorkspaceForUser,
  saveWorkspaceForUser,
  updateWorkspaceForUser,
  upsertProfileForUser,
} from '../lib/workspace'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [workspace, setWorkspace] = useState(null)
  const [workspaceGoals, setWorkspaceGoals] = useState([])
  const [loading, setLoading] = useState(true)

  const loadWorkspace = async (currentUser) => {
    if (!currentUser || !isSupabaseConfigured) {
      setProfile(null)
      setWorkspace(null)
      setWorkspaceGoals([])
      return
    }

    setProfile({
      id: currentUser.id,
      email: currentUser.email ?? '',
      fullName: currentUser.user_metadata?.full_name ?? '',
    })

    const workspaceData = await fetchWorkspaceForUser(currentUser.id)
    setWorkspace(workspaceData)
    setWorkspaceGoals(workspaceData?.goals ?? [])
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return undefined
    }

    let isMounted = true

    const initializeAuth = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession()

      if (!isMounted) {
        return
      }

      setSession(initialSession)
      setUser(initialSession?.user ?? null)
      await loadWorkspace(initialSession?.user ?? null)
      if (isMounted) {
        setLoading(false)
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      await loadWorkspace(nextSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async ({ email, password }) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet.')
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return data
  }

  const signInWithProvider = async (provider) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet.')
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      throw error
    }

    return data
  }

  const signUp = async ({ email, password, fullName }) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet.')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      throw error
    }

    if (data.user) {
      await upsertProfileForUser({
        id: data.user.id,
        email: data.user.email ?? email,
        fullName,
      })
    }

    return data
  }

  const resendConfirmation = async (email) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet.')
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      throw error
    }
  }

  const sendPasswordReset = async (email) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet.')
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      throw error
    }
  }

  const updatePassword = async (password) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet.')
    }

    const { data, error } = await supabase.auth.updateUser({ password })

    if (error) {
      throw error
    }

    return data
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      return
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }
  }

  const saveWorkspace = async (payload) => {
    if (!user) {
      throw new Error('You must be signed in to save a workspace.')
    }

    await upsertProfileForUser({
      id: user.id,
      email: user.email ?? payload.businessEmail,
      fullName: user.user_metadata?.full_name ?? '',
    })

    const nextWorkspace = await saveWorkspaceForUser(user.id, payload)
    setWorkspace(nextWorkspace)
    setWorkspaceGoals(nextWorkspace?.goals ?? [])

    return nextWorkspace
  }

  const updateWorkspace = async (payload) => {
    if (!user) {
      throw new Error('You must be signed in to update a workspace.')
    }

    const nextWorkspace = await updateWorkspaceForUser(user.id, payload)
    setWorkspace(nextWorkspace)
    setWorkspaceGoals(nextWorkspace?.goals ?? [])

    return nextWorkspace
  }

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      workspace,
      workspaceGoals,
      loading,
      isSupabaseConfigured,
      signIn,
      signInWithProvider,
      signUp,
      resendConfirmation,
      sendPasswordReset,
      signOut,
      updatePassword,
      saveWorkspace,
      updateWorkspace,
      refreshWorkspace: () => loadWorkspace(user),
    }),
    [loading, profile, session, user, workspace, workspaceGoals],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}
