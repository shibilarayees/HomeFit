import { supabase } from './supabase.js'

// True only for accounts listed in the app_admins table.
export async function checkIsAdmin() {
  if (!supabase) return false
  const { data, error } = await supabase.rpc('is_admin')
  return !error && data === true
}

// Aggregate counts + who-joined list. Throws if the caller isn't an admin.
export async function fetchAdminOverview() {
  const { data, error } = await supabase.rpc('admin_overview')
  if (error) throw error
  return data
}
