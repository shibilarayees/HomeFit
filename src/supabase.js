import { createClient } from '@supabase/supabase-js'

// Read from Vite env (set VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY in .env
// and in the Vercel project settings). The anon key is safe to expose in the
// client — data is protected server-side by Row-Level Security.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = Boolean(url && anonKey)

export const supabase = isConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null
