import { calorieTarget, waterTarget } from '../data/nutrition.js'
import { isWorkoutDay } from '../data/workouts.js'
import { todayKey } from '../store/useStore.js'

const MEDALS = ['🥇', '🥈', '🥉']

// UTC day key offset from today (matches how days are stored).
function keyOffset(days) {
  const base = new Date(todayKey() + 'T00:00:00Z')
  base.setUTCDate(base.getUTCDate() + days)
  return base.toISOString().slice(0, 10)
}

// Generic consecutive-day streak ending today (or yesterday, so it doesn't
// break mid-day before today is done), given a per-day predicate.
function streakBy(member, store, predicate) {
  const good = (key) => predicate(store.getDay(member.id, key), member)
  let start = good(todayKey()) ? 0 : -1
  let streak = 0
  for (let i = start; i > -400; i--) {
    if (good(keyOffset(i))) streak++
    else break
  }
  return streak
}

// A healthy day = at least one meal logged AND water ≥ 60% of goal.
const isHealthyDay = (d, member) => d.food.length > 0 && d.waterMl >= waterTarget(member) * 0.6
const didWorkout = (d) => isWorkoutDay(d)

// A friendly daily "wellness score" out of 100:
//  hydration 40% · nutrition logged & near target 35% · workout 15% · weighed in 10%
function scoreFor(member, store) {
  const day = store.getDay(member.id, todayKey())
  const cal = calorieTarget(member)
  const waterGoal = waterTarget(member)
  const eaten = day.food.reduce((s, f) => s + (f.kcal || 0), 0)

  const hydration = Math.min(100, (day.waterMl / waterGoal) * 100)
  const nutrition = eaten === 0 ? 0 : 100 - Math.min(100, (Math.abs(eaten - cal.target) / cal.target) * 100)
  const workout = day.workoutDone ? 100 : 0
  const weighed = day.weightKg != null ? 100 : 0
  const score = Math.round(0.4 * hydration + 0.35 * nutrition + 0.15 * workout + 0.1 * weighed)

  return {
    member, score,
    eaten, calTarget: cal.target,
    waterMl: day.waterMl, waterGoal,
    hydrationPct: Math.round(hydration),
    weighed: day.weightKg != null,
    workoutDone: day.workoutDone,
    foodCount: day.food.length,
    streak: streakBy(member, store, isHealthyDay),
    workoutStreak: streakBy(member, store, didWorkout),
  }
}

export default function Leaderboard({ members, store, onPick }) {
  const rows = members.map((m) => scoreFor(m, store)).sort((a, b) => b.score - a.score)

  const totalWater = rows.reduce((s, r) => s + r.waterMl, 0)
  const allLogged = rows.filter((r) => r.foodCount > 0).length

  return (
    <div>
      <div className="grid" style={{ marginBottom: 16 }}>
        <div className="card">
          <h3>Family hydration today</h3>
          <div className="big">{(totalWater / 1000).toFixed(1)}<span style={{ fontSize: 14, color: 'var(--muted)' }}> L</span></div>
        </div>
        <div className="card">
          <h3>Logged a meal today</h3>
          <div className="big">{allLogged}<span style={{ fontSize: 14, color: 'var(--muted)' }}> / {rows.length}</span></div>
        </div>
        <div className="card">
          <h3>Top score</h3>
          <div className="big">{rows[0]?.member.name ?? '—'}</div>
          <div className="sub">{rows[0] ? `${rows[0].score} pts` : 'add members to compete'}</div>
        </div>
      </div>

      <h2 className="section-title">🏆 Today's leaderboard</h2>
      <div className="list">
        {rows.map((r, i) => (
          <button className="leader-row" key={r.member.id} onClick={() => onPick(r.member.id)}>
            <span className="rank">{MEDALS[i] || i + 1}</span>
            <span className="who">
              <b>
                {r.member.name}
                {r.streak > 0 && <span className="streak"> · 🔥 {r.streak}d</span>}
                {r.workoutStreak > 0 && <span className="streak"> · 🏃 {r.workoutStreak}d</span>}
              </b>
              <small className="sub">
                💧 {r.waterMl}/{r.waterGoal}ml · 🍎 {r.eaten}/{r.calTarget} kcal {r.workoutDone ? '· 🏃' : ''} {r.weighed ? '· ⚖️' : ''}
              </small>
            </span>
            <span className="score-wrap">
              <span className="bar" style={{ width: 90 }}>
                <span style={{ width: `${r.score}%`, background: r.score >= 70 ? 'var(--green)' : r.score >= 40 ? 'var(--amber)' : 'var(--red)' }} />
              </span>
              <b>{r.score}</b>
            </span>
          </button>
        ))}
      </div>
      <p className="disclaimer">
        Score = hydration (40%) + meals near target (35%) + workout done (15%) + weighed in (10%).
        A bit of friendly motivation — not a medical measure. Tap a name to open their tracker.
      </p>
    </div>
  )
}
