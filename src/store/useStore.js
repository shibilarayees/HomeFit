import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../supabase.js'

// Shape:
// { members: [ {id, name, sex, age, heightCm, weightKg, activity, goal, goalWeightKg} ],
//   logs: { [memberId]: { [yyyy-mm-dd]: { food: [{name,kcal}], waterMl, weightKg } } } }

const EMPTY = { members: [], logs: {} }
// Cache key is namespaced per family so multiple families on one browser stay separate.
const cacheKey = (familyId) => `homefit:v1:fam:${familyId || 'local'}`

function load(familyId) {
  try {
    const raw = localStorage.getItem(cacheKey(familyId))
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('Could not read HomeFit data', e)
  }
  return { ...EMPTY }
}

function save(familyId, state) {
  try {
    localStorage.setItem(cacheKey(familyId), JSON.stringify(state))
  } catch (e) {
    console.warn('Could not save HomeFit data', e)
  }
}

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

let _id = 0
function newId() {
  _id += 1
  return `m${Date.now().toString(36)}${_id}`
}

// `familyId` (from the user's family) keys the shared cloud dataset. The
// localStorage cache makes the app work offline. Without a familyId the store
// is local-only.
export function useStore(familyId) {
  const [state, setState] = useState(() => load(familyId))
  const [syncStatus, setSyncStatus] = useState('idle') // idle | loading | synced | offline
  const lastWritten = useRef(null) // ignore realtime echoes of our own writes

  // Switch cache when the family changes.
  useEffect(() => {
    setState(load(familyId))
  }, [familyId])

  // Pull the family's shared row from Supabase.
  useEffect(() => {
    if (!familyId || !supabase) return
    let active = true
    setSyncStatus('loading')
    ;(async () => {
      const { data, error } = await supabase
        .from('family_state')
        .select('data')
        .eq('family_id', familyId)
        .maybeSingle()
      if (!active) return
      if (error) {
        setSyncStatus('offline')
        return
      }
      if (data?.data) {
        lastWritten.current = JSON.stringify(data.data)
        setState(data.data)
        save(familyId, data.data)
      }
      setSyncStatus('synced')
    })()
    return () => { active = false }
  }, [familyId])

  // Live updates: when another family member changes the shared data, adopt it.
  useEffect(() => {
    if (!familyId || !supabase) return
    const channel = supabase
      .channel(`family_state:${familyId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'family_state', filter: `family_id=eq.${familyId}` },
        (payload) => {
          const incoming = payload.new?.data
          if (!incoming) return
          const str = JSON.stringify(incoming)
          if (str === lastWritten.current) return // our own echo
          lastWritten.current = str
          setState(incoming)
          save(familyId, incoming)
        },
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [familyId])

  // Persist on every change: cache immediately, push to cloud (debounced).
  useEffect(() => {
    save(familyId, state)
    if (!familyId || !supabase) return
    const t = setTimeout(async () => {
      lastWritten.current = JSON.stringify(state)
      const { error } = await supabase
        .from('family_state')
        .upsert({ family_id: familyId, data: state, updated_at: new Date().toISOString() })
      setSyncStatus(error ? 'offline' : 'synced')
    }, 700)
    return () => clearTimeout(t)
  }, [state, familyId])

  const addMember = useCallback((m) => {
    const member = { id: newId(), ...m }
    setState((s) => ({ ...s, members: [...s.members, member] }))
    return member.id
  }, [])

  const updateMember = useCallback((id, patch) => {
    setState((s) => ({
      ...s,
      members: s.members.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }))
  }, [])

  const removeMember = useCallback((id) => {
    setState((s) => {
      const logs = { ...s.logs }
      delete logs[id]
      return { ...s, members: s.members.filter((m) => m.id !== id), logs }
    })
  }, [])

  const getDay = useCallback(
    (memberId, date = todayKey()) => state.logs[memberId]?.[date] || { food: [], waterMl: 0, weightKg: null, workoutDone: false, workouts: [] },
    [state.logs],
  )

  const setDay = useCallback((memberId, date, updater) => {
    setState((s) => {
      const member = s.logs[memberId] || {}
      const day = member[date] || { food: [], waterMl: 0, weightKg: null, workoutDone: false, workouts: [] }
      const next = typeof updater === 'function' ? updater(day) : updater
      return {
        ...s,
        logs: { ...s.logs, [memberId]: { ...member, [date]: next } },
      }
    })
  }, [])

  const addFood = useCallback(
    (memberId, item, date = todayKey()) =>
      setDay(memberId, date, (d) => ({ ...d, food: [...d.food, item] })),
    [setDay],
  )

  const removeFood = useCallback(
    (memberId, index, date = todayKey()) =>
      setDay(memberId, date, (d) => ({ ...d, food: d.food.filter((_, i) => i !== index) })),
    [setDay],
  )

  const addWater = useCallback(
    (memberId, ml, date = todayKey()) =>
      setDay(memberId, date, (d) => ({ ...d, waterMl: Math.max(0, d.waterMl + ml) })),
    [setDay],
  )

  const addWorkout = useCallback(
    (memberId, workout, date = todayKey()) =>
      setDay(memberId, date, (d) => ({
        ...d,
        workouts: [...(d.workouts || []), workout],
        workoutDone: true,
      })),
    [setDay],
  )

  const removeWorkout = useCallback(
    (memberId, index, date = todayKey()) =>
      setDay(memberId, date, (d) => {
        const workouts = (d.workouts || []).filter((_, i) => i !== index)
        return { ...d, workouts, workoutDone: workouts.length > 0 }
      }),
    [setDay],
  )

  const logWeight = useCallback(
    (memberId, weightKg, date = todayKey()) => {
      setDay(memberId, date, (d) => ({ ...d, weightKg }))
      updateMember(memberId, { weightKg }) // keep "current weight" fresh
    },
    [setDay, updateMember],
  )

  // Export the whole dataset as a pretty JSON string (for backup/download).
  const exportData = useCallback(
    () => JSON.stringify({ app: 'HomeFit', version: 1, exportedAt: todayKey(), ...state }, null, 2),
    [state],
  )

  // Import a previously exported dataset. Returns {ok, error}.
  const importData = useCallback((json) => {
    try {
      const parsed = typeof json === 'string' ? JSON.parse(json) : json
      if (!parsed || !Array.isArray(parsed.members) || typeof parsed.logs !== 'object') {
        return { ok: false, error: 'This file does not look like a HomeFit backup.' }
      }
      setState({ members: parsed.members, logs: parsed.logs || {} })
      return { ok: true }
    } catch (e) {
      return { ok: false, error: 'Could not read the file — is it valid JSON?' }
    }
  }, [])

  // Weight history for charts: [{date, weightKg}] sorted ascending.
  const weightHistory = useCallback(
    (memberId) => {
      const days = state.logs[memberId] || {}
      return Object.entries(days)
        .filter(([, d]) => d.weightKg != null)
        .map(([date, d]) => ({ date, weightKg: d.weightKg }))
        .sort((a, b) => a.date.localeCompare(b.date))
    },
    [state.logs],
  )

  return {
    state,
    members: state.members,
    addMember,
    updateMember,
    removeMember,
    getDay,
    addFood,
    removeFood,
    addWater,
    addWorkout,
    removeWorkout,
    logWeight,
    weightHistory,
    exportData,
    importData,
    syncStatus,
  }
}
