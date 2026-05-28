import { useEffect, useState, useCallback } from 'react'

const KEY = 'homefit:v1'

// Shape:
// { members: [ {id, name, sex, age, heightCm, weightKg, activity, goal, goalWeightKg} ],
//   logs: { [memberId]: { [yyyy-mm-dd]: { food: [{name,kcal}], waterMl, weightKg } } } }

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('Could not read HomeFit data', e)
  }
  return { members: [], logs: {} }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
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

export function useStore() {
  const [state, setState] = useState(load)

  useEffect(() => save(state), [state])

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
  }
}
