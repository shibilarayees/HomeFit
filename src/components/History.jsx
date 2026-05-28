import { useState } from 'react'
import { calorieTarget, waterTarget } from '../data/nutrition.js'
import { isWorkoutDay, activeMinutes } from '../data/workouts.js'
import { todayKey } from '../store/useStore.js'
import WeeklyAverages from './WeeklyAverages.jsx'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

// All date keys use UTC to stay consistent with how days are stored (todayKey).
const keyOf = (y, m, d) => new Date(Date.UTC(y, m, d)).toISOString().slice(0, 10)

export default function History({ member, store }) {
  const today = new Date(todayKey() + 'T00:00:00Z')
  const [offset, setOffset] = useState(0) // months back from current
  const [selected, setSelected] = useState(todayKey())

  const view = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - offset, 1))
  const year = view.getUTCFullYear()
  const month = view.getUTCMonth()
  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay()
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  const cal = calorieTarget(member)
  const waterGoal = waterTarget(member)

  function dayInfo(key) {
    const d = store.getDay(member.id, key)
    const eaten = d.food.reduce((s, f) => s + (f.kcal || 0), 0)
    return {
      d, eaten,
      hasFood: d.food.length > 0,
      hydrated: d.waterMl >= waterGoal * 0.6,
      weighed: d.weightKg != null,
      worked: isWorkoutDay(d),
      minutes: activeMinutes(d),
      any: d.food.length > 0 || d.waterMl > 0 || d.weightKg != null || isWorkoutDay(d),
    }
  }

  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(day)

  const sel = selected ? dayInfo(selected) : null
  const canGoNext = offset > 0

  return (
    <div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <button className="btn ghost sm" onClick={() => setOffset((o) => o + 1)}>‹</button>
          <h3 style={{ margin: 0, color: 'var(--text)' }}>{MONTHS[month]} {year}</h3>
          <button className="btn ghost sm" disabled={!canGoNext} style={{ opacity: canGoNext ? 1 : 0.3 }} onClick={() => canGoNext && setOffset((o) => o - 1)}>›</button>
        </div>

        <div className="cal-grid head">
          {WEEKDAYS.map((w, i) => <span key={i} className="cal-dow">{w}</span>)}
        </div>
        <div className="cal-grid">
          {cells.map((day, i) => {
            if (day == null) return <span key={i} className="cal-cell empty" />
            const key = keyOf(year, month, day)
            const info = dayInfo(key)
            const isToday = key === todayKey()
            const isSel = key === selected
            const isFuture = key > todayKey()
            return (
              <button
                key={i}
                className={`cal-cell ${isSel ? 'sel' : ''} ${isToday ? 'today' : ''} ${info.any ? 'has' : ''}`}
                disabled={isFuture}
                style={{ opacity: isFuture ? 0.3 : 1 }}
                onClick={() => setSelected(key)}
              >
                <span className="num">{day}</span>
                <span className="dots">
                  {info.hasFood && <i className="dot food" title="Meals logged" />}
                  {info.hydrated && <i className="dot water" title="Hydrated" />}
                  {info.worked && <i className="dot workout" title="Workout done" />}
                  {info.weighed && <i className="dot weight" title="Weighed in" />}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <WeeklyAverages member={member} store={store} />

      {sel && (
        <div className="card">
          <h3>{selected === todayKey() ? 'Today' : selected}</h3>
          {!sel.any ? (
            <div className="sub">Nothing logged on this day.</div>
          ) : (
            <>
              <div className="grid" style={{ marginBottom: 12 }}>
                <div>
                  <div className="sub">Calories</div>
                  <b>{sel.eaten}</b> <span className="sub">/ {cal.target} kcal</span>
                </div>
                <div>
                  <div className="sub">Water</div>
                  <b>{sel.d.waterMl}</b> <span className="sub">/ {waterGoal} ml</span>
                </div>
                <div>
                  <div className="sub">Weight</div>
                  <b>{sel.d.weightKg ?? '—'}</b> <span className="sub">kg</span>
                </div>
                <div>
                  <div className="sub">Workout</div>
                  <b>{sel.worked ? `🏃 ${sel.minutes || ''} min`.trim() : '—'}</b>
                </div>
              </div>
              {sel.d.food.length > 0 && (
                <div className="list">
                  {sel.d.food.map((f, i) => (
                    <div className="list-item" key={i}>
                      <span>{f.name}</span><b>{f.kcal} kcal</b>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <p className="disclaimer">
        🍎 meals · 💧 hydrated (≥60% of goal) · 🏃 workout · ⚖️ weighed in. Tap any past day to see its detail.
      </p>
    </div>
  )
}
