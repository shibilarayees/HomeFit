import { useEffect, useState, useCallback } from 'react'
import { supabase, isConfigured } from './supabase.js'

// Auth state + actions backed by Supabase Auth (email/password).
export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(isConfigured)
  const [recovery, setRecovery] = useState(false) // arrived via a password-reset link

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s)
      if (event === 'PASSWORD_RECOVERY') setRecovery(true)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const updatePassword = useCallback((newPassword) => supabase.auth.updateUser({ password: newPassword }), [])
  const clearRecovery = useCallback(() => setRecovery(false), [])

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
    recovery,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    clearRecovery,
  }
}
