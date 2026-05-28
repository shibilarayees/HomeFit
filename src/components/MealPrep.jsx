import { calorieTarget, isChild, WEEKLY_GOALS, ageGroup } from '../data/nutrition.js'
import { buildDayPlan, scalePortion, MEAL_IDEAS } from '../data/mealPlans.js'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function MealPrep({ member }) {
  const child = isChild(member.age)
  const goal = child ? 'maintain' : member.goal
  const diet = member.diet || 'nonveg'
  const cal = calorieTarget(member)
  const goalLabel = (WEEKLY_GOALS.find((g) => g.value === goal) || WEEKLY_GOALS[1]).label

  // Size the whole plan to this member's age-based calorie target: first learn
  // the base (adult-recipe) day total, then scale every portion so the days land
  // near the target. Because the target is age-based, kids get smaller servings.
  const rawWeek = DAYS.map((d, i) => buildDayPlan(goal, cal.target, child, i, diet, 1))
  const avgBase = rawWeek.reduce((s, w) => s + w.total, 0) / (rawWeek.length || 1) || 1
  const factor = Math.min(2, Math.max(0.4, cal.target / avgBase))
  const week = DAYS.map((d, i) => ({ day: d, ...buildDayPlan(goal, cal.target, child, i, diet, factor) }))

  let pool = MEAL_IDEAS[goal] || MEAL_IDEAS.maintain
  if (diet === 'veg') pool = pool.filter((m) => m.veg)

  return (
    <div>
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Kerala weekly plan for {member.name}</h3>
        <div className="sub">
          Goal: <b style={{ color: 'var(--text)' }}>{goalLabel}</b> · target ~{cal.target} kcal/day
          {' · '}{diet === 'veg' ? '🥦 Veg' : '🍗 Non-veg'}
          {child && ' · 👶 kid-friendly'}
        </div>
        <div className="sub" style={{ marginTop: 4 }}>
          🍽️ Portions sized for {ageGroup(member.age)} ({member.age} yrs) — tuned to
          this member's <b style={{ color: 'var(--text)' }}>~{cal.target} kcal/day</b> target.
        </div>
      </div>

      <div className="grid">
        {week.map((d) => (
          <div className="card" key={d.day}>
            <h3>{d.day} <span className="sub">~{d.total} kcal</span></h3>
            <div className="list" style={{ marginTop: 8 }}>
              {d.plan.map((m, i) => (
                <div className="list-item" key={i}>
                  <span>
                    <small className="sub">{m.meal}</small><br />
                    <span className="row" style={{ gap: 6 }}>
                      <span className={`veg-dot ${m.veg ? 'veg' : 'nonveg'}`} title={m.veg ? 'Veg' : 'Non-veg'} />
                      {m.name}
                    </span>
                    <small className="sub">{m.portion}</small>
                  </span>
                  <b>{m.kcal}</b>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title">More Kerala ideas for this goal</h2>
      <div className="grid">
        {pool.map((m, i) => (
          <div className="card" key={i}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <b>{m.name}</b>
              <span className="row" style={{ gap: 4 }}>
                <span className={`veg-dot ${m.veg ? 'veg' : 'nonveg'}`} title={m.veg ? 'Veg' : 'Non-veg'} />
                {m.kidFriendly && <span className="badge kid">kid ok</span>}
              </span>
            </div>
            <div className="sub" style={{ marginTop: 4 }}>
              {m.meal} · {scalePortion(m.portion, factor)} · {Math.round(m.kcal * factor)} kcal
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
