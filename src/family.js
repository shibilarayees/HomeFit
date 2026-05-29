import { useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase.js'

// A single-row RPC can come back as an array, an object, or (when there's no
// row) an all-null object — only treat it as a family if it has a real id.
const one = (data) => {
  const row = Array.isArray(data) ? data[0] : data
  return row && row.id ? row : null
}

export async function createFamily(name, initialData) {
  const { data, error } = await supabase.rpc('create_family', { p_name: name, p_data: initialData })
  if (error) throw error
  return one(data)
}

export async function joinFamily(code) {
  const { data, error } = await supabase.rpc('join_family', { p_code: code })
  if (error) throw error
  return one(data)
}

export async function fetchFamilyMembers(familyId) {
  const { data, error } = await supabase
    .from('family_members')
    .select('email, role, joined_at')
    .eq('family_id', familyId)
    .order('joined_at')
  if (error) return []
  return data || []
}

// Resolve the logged-in user's family (null if they haven't joined/created one).
export function useFamily(userId) {
  const [family, setFamily] = useState(null)
  const [loading, setLoading] = useState(Boolean(userId))

  const refresh = useCallback(async () => {
    if (!userId || !supabase) {
      setFamily(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const { data } = await supabase.rpc('my_family')
    setFamily(one(data))
    setLoading(false)
  }, [userId])

  useEffect(() => { refresh() }, [refresh])

  return { family, loading, refresh, setFamily }
}
