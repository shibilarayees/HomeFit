import { useEffect, useState, useCallback } from 'react'
import { supabase, isConfigured } from './supabase.js'

// Auth state + actions backed by Supabase Auth (email/password).
export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(isConfigured)

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const signIn = useCallback(
    (email, password) => supabase.auth.signInWithPassword({ email: email.trim(), password }),
    [],
  )

  const signUp = useCallback(
    (email, password) =>
      supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: window.location.origin },
      }),
    [],
  )

  const signOut = useCallback(() => supabase.auth.signOut(), [])

  const resetPassword = useCallback(
    (email) => supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin }),
    [],
  )

  return {
    session,
    user: session?.user ?? null,
    loading,
    isConfigured,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }
}
