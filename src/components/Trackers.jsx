import { useState } from 'react'
import { calorieTarget, waterTarget } from '../data/nutrition.js'
import { searchFoods } from '../data/foods.js'
import { projectWeight, formatGoalDate } from '../data/projection.js'

export function CalorieTracker({ member, day, store }) {
  const [query, setQuery] = useState('')
  const [custom, setCustom] = useState(false)
  const [name, setName] = useState('')
  const [kcal, setKcal] = useState('')
  const cal = calorieTarget(member)
  const eaten = day.food.reduce((s, f) => s + (f.kcal || 0), 0)
  const remaining = cal.target - eaten
  const vegOnly = (member.diet || 'nonveg') === 'veg'
  const results = searchFoods(query, vegOnly).slice(0, 12)

  function pick(food) {
    store.addFood(member.id, { name: `${food.name} (${food.serving})`, kcal: food.kcal })
    setQuery('')
  }

  function addCustom(e) {
    e.preventDefault()
    if (!name.trim() || !kcal) return
    store.addFood(member.id, { name: name.trim(), kcal: Number(kcal) })
    setName(''); setKcal(''); setCustom(false)
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Calories — {eaten} / {cal.target} kcal</h3>
        <div className="bar">
          <span style={{ width: `${Math.min(100, (eaten / cal.target) * 100)}%`, background: remaining < 0 ? 'var(--amber)' : 'var(--green)' }} />
        </div>
        <div className="sub" style={{ marginTop: 6 }}>
          {remaining >= 0 ? `${remaining} kcal remaining` : `${-remaining} kcal over target`}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h3>Add food {vegOnly && <span className="badge">veg only</span>}</h3>
          <button className="btn ghost sm" onClick={() => setCustom((c) => !c)}>
            {custom ? '← Back to search' : '✎ Custom'}
          </button>
        </div>

        {custom ? (
          <form onSubmit={addCustom} style={{ marginTop: 8 }}>
            <div className="form-grid">
              <div className="field">
                <label>Food / meal</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Grandma's curry" autoFocus />
              </div>
              <div className="field">
                <label>Calories (kcal)</label>
                <input type="number" value={kcal} onChange={(e) => setKcal(e.target.value)} placeholder="e.g. 250" />
              </div>
            </div>
            <button className="btn" type="submit">Add to today</button>
          </form>
        ) : (
          <>
            <input
              className="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search foods — roti, dal, biryani, banana…"
            />
            <div className="food-results">
              {results.length === 0 && <div className="sub" style={{ padding: '8px 2px' }}>No matches — try “Custom” to add your own.</div>}
              {results.map((f, i) => (
                <button className="food-row" key={i} onClick={() => pick(f)}>
                  <span>
                    <span className={`veg-dot ${f.veg ? 'veg' : 'nonveg'}`} />
                    {f.name} <small className="sub">· {f.serving}</small>
                  </span>
                  <b>{f.kcal} kcal</b>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="list">
        {day.food.length === 0 && <div className="sub">No food logged yet today.</div>}
        {day.food.map((f, i) => (
          <div className="list-item" key={i}>
            <span>{f.name}</span>
            <span className="row">
              <b>{f.kcal} kcal</b>
              <button className="x" onClick={() => store.removeFood(member.id, i)}>✕</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function WaterTracker({ member, day, store }) {
  const goal = waterTarget(member)
  const water = day.waterMl
  const pct = Math.min(100, Math.round((water / goal) * 100))
  const amounts = [200, 250, 330, 500]

  return (
    <div>
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Water — {water} / {goal} ml</h3>
        <div className="bar"><span style={{ width: `${pct}%`, background: 'var(--blue)' }} /></div>
        <div className="sub" style={{ marginTop: 6 }}>
          {water >= goal ? '🎉 Goal reached — great job!' : `${goal - water} ml to go (${pct}%)`}
        </div>
      </div>

      <div className="card">
        <h3>Add a drink</h3>
        <div className="water-btns" style={{ marginBottom: 10 }}>
          {amounts.map((a) => (
            <button key={a} className="btn" onClick={() => store.addWater(member.id, a)}>+{a} ml</button>
          ))}
        </div>
        <button className="btn ghost sm" onClick={() => store.addWater(member.id, -200)}>− 200 ml (undo)</button>
      </div>
    </div>
  )
}

export function WeightTracker({ member, store, WeightChart }) {
  const [w, setW] = useState('')
  const history = store.weightHistory(member.id)
  const projection = projectWeight(history, member.goalWeightKg)

  function submit(e) {
    e.preventDefault()
    if (!w) return
    store.logWeight(member.id, Number(w))
    setW('')
  }

  const latest = history[history.length - 1]?.weightKg ?? member.weightKg
  const first = history[0]?.weightKg
  const change = first != null && latest != null ? +(latest - first).toFixed(1) : null

  return (
    <div>
      <div className="grid" style={{ marginBottom: 16 }}>
        <div className="card">
          <h3>Current</h3>
          <div className="big">{latest ?? '—'}<span style={{ fontSize: 14, color: 'var(--muted)' }}> kg</span></div>
        </div>
        <div className="card">
          <h3>Goal</h3>
          <div className="big">{member.goalWeightKg ?? '—'}<span style={{ fontSize: 14, color: 'var(--muted)' }}> kg</span></div>
        </div>
        <div className="card">
          <h3>Change so far</h3>
          <div className="big" style={{ color: change == null ? 'var(--muted)' : change <= 0 ? 'var(--green)' : 'var(--amber)' }}>
            {change == null ? '—' : `${change > 0 ? '+' : ''}${change} kg`}
          </div>
        </div>
      </div>

      <form className="card" onSubmit={submit} style={{ marginBottom: 16 }}>
        <div className="field">
          <label>Log today's weight (kg)</label>
          <input type="number" step="0.1" value={w} onChange={(e) => setW(e.target.value)} placeholder="e.g. 68.5" />
        </div>
        <button className="btn" type="submit">Save weight</button>
      </form>

      <div className="card">
        <h3>Progress</h3>
        {history.length < 2 ? (
          <div className="sub">Log your weight on at least two days to see a trend line.</div>
        ) : (
          <>
            <WeightChart history={history} goal={member.goalWeightKg} projPoints={projection?.projPoints} />
            {projection && (
              <div className="projection" style={{ marginTop: 12 }}>
                {member.goalWeightKg == null ? (
                  <div className="sub">
                    Trend: {projection.slopePerWeek === 0 ? 'holding steady' :
                      `${projection.slopePerWeek > 0 ? '+' : ''}${projection.slopePerWeek} kg/week`}. Set a goal weight to see a projected date.
                  </div>
                ) : projection.onTrack ? (
                  <div>
                    📈 At <b>{projection.slopePerWeek > 0 ? '+' : ''}{projection.slopePerWeek} kg/week</b>, you'll reach your{' '}
                    <b>{member.goalWeightKg} kg</b> goal around{' '}
                    <b style={{ color: 'var(--green)' }}>{formatGoalDate(projection.goalDate)}</b>
                    <span className="sub"> (~{projection.daysToGoal} days)</span>.
                  </div>
                ) : (
                  <div className="sub">
                    {projection.slopePerWeek === 0
                      ? 'Weight is holding steady — no movement toward the goal yet.'
                      : `Current trend (${projection.slopePerWeek > 0 ? '+' : ''}${projection.slopePerWeek} kg/week) isn't heading toward your ${member.goalWeightKg} kg goal.`}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
