import { useState } from 'react'
import { ageGroup } from '../data/nutrition.js'
import { workoutsFor, parseMinutes, isWorkoutDay, activeMinutes } from '../data/workouts.js'
import { todayKey } from '../store/useStore.js'

// Consecutive days (ending today or yesterday) with a workout logged.
function keyOffset(days) {
  const base = new Date(todayKey() + 'T00:00:00Z')
  base.setUTCDate(base.getUTCDate() + days)
  return base.toISOString().slice(0, 10)
}
function workoutStreak(memberId, store) {
  const done = (k) => isWorkoutDay(store.getDay(memberId, k))
  let start = done(todayKey()) ? 0 : -1
  let streak = 0
  for (let i = start; i > -400; i--) {
    if (done(keyOffset(i))) streak++
    else break
  }
  return streak
}

export default function Workouts({ member, store }) {
  const group = ageGroup(member.age)
  const list = workoutsFor(group)
  const day = store.getDay(member.id, todayKey())
  const logged = day.workouts || []
  const minutes = activeMinutes(day)
  const streak = workoutStreak(member.id, store)
  const [customMin, setCustomMin] = useState('')

  const did = (title) => logged.some((w) => w.title === title)

  return (
    <div>
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Daily workouts for {member.name}</h3>
        <div className="sub" style={{ textTransform: 'capitalize' }}>
          Age-appropriate picks for the <b style={{ color: 'var(--text)' }}>{group}</b> group
          {streak > 0 && <span className="streak"> · 🏃 {streak}-day streak</span>}
        </div>

        {logged.length > 0 ? (
          <div style={{ marginTop: 12 }}>
            <div className="sub" style={{ marginBottom: 6 }}>
              Today: <b style={{ color: 'var(--green)' }}>{minutes} active min</b> across {logged.length} workout{logged.length > 1 ? 's' : ''}
            </div>
            <div className="list">
              {logged.map((w, i) => (
                <div className="list-item" key={i}>
                  <span>🏃 {w.title}</span>
                  <span className="row">
                    <b>{w.minutes} min</b>
                    <button className="x" onClick={() => store.removeWorkout(member.id, i)}>✕</button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="sub" style={{ marginTop: 10 }}>No workout logged yet today — tap “＋ Did this” on one below.</div>
        )}

        <div className="row" style={{ marginTop: 12 }}>
          <input
            className="search"
            style={{ maxWidth: 130, marginTop: 0 }}
            type="number"
            min="1"
            placeholder="minutes"
            value={customMin}
            onChange={(e) => setCustomMin(e.target.value)}
          />
          <button
            className="btn secondary"
            onClick={() => {
              const m = Number(customMin)
              if (m > 0) { store.addWorkout(member.id, { title: 'Other activity', minutes: m }); setCustomMin('') }
            }}
          >
            ＋ Log other activity
          </button>
        </div>
      </div>

      <div className="grid">
        {list.map((w, i) => (
          <div className="card" key={i}>
            <div className="video">
              <iframe
                src={`https://www.youtube.com/embed/${w.youtubeId}`}
                title={w.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="video-meta">
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <b>{w.title}</b>
                  <small>
                    {w.duration} ·{' '}
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(w.title + ' workout')}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--blue)' }}
                    >
                      search YouTube ↗
                    </a>
                  </small>
                </div>
                <button
                  className={`btn sm ${did(w.title) ? '' : 'secondary'}`}
                  disabled={did(w.title)}
                  onClick={() => store.addWorkout(member.id, { title: w.title, minutes: parseMinutes(w.duration) })}
                >
                  {did(w.title) ? '✅ Done' : '＋ Did this'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
