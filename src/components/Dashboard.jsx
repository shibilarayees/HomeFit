import { calorieTarget, waterTarget, bmi, ageGroup } from '../data/nutrition.js'

function ProgressCard({ title, value, unit, target, color, sub }) {
  const pct = target ? Math.min(100, Math.round((value / target) * 100)) : 0
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="big">{value}<span style={{ fontSize: 14, color: 'var(--muted)' }}> / {target} {unit}</span></div>
      <div className="bar"><span style={{ width: `${pct}%`, background: color }} /></div>
      <div className="sub" style={{ marginTop: 6 }}>{sub ?? `${pct}% of daily goal`}</div>
    </div>
  )
}

export default function Dashboard({ member, day, onNavigate }) {
  const cal = calorieTarget(member)
  const waterGoal = waterTarget(member)
  const eaten = day.food.reduce((s, f) => s + (f.kcal || 0), 0)
  const water = day.waterMl
  const weight = day.weightKg ?? member.weightKg
  const bmiVal = bmi(member, weight)
  const group = ageGroup(member.age)

  return (
    <div>
      <div className="grid">
        <ProgressCard
          title="Calories today" value={eaten} unit="kcal" target={cal.target}
          color="var(--green)"
          sub={cal.isChild ? 'Growth-based estimate' : `${cal.maintenance} kcal maintenance`}
        />
        <ProgressCard
          title="Water today" value={water} unit="ml" target={waterGoal} color="var(--blue)"
        />
        <div className="card">
          <h3>Weight</h3>
          <div className="big">{weight ? `${weight}` : '—'}<span style={{ fontSize: 14, color: 'var(--muted)' }}> kg</span></div>
          <div className="sub" style={{ marginTop: 6 }}>
            {bmiVal ? `BMI ${bmiVal}` : 'Add height & weight for BMI'}
            {member.goalWeightKg ? ` · goal ${member.goalWeightKg} kg` : ''}
          </div>
        </div>
        <div className="card">
          <h3>Profile</h3>
          <div className="big" style={{ fontSize: 20 }}>{member.age} yrs</div>
          <div className="sub" style={{ marginTop: 6, textTransform: 'capitalize' }}>
            {group} · {member.sex}
          </div>
        </div>
      </div>

      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn pill" onClick={() => onNavigate('calories')}>＋ Log food</button>
        <button className="btn pill secondary" onClick={() => onNavigate('water')}>💧 Add water</button>
        <button className="btn pill secondary" onClick={() => onNavigate('weight')}>⚖️ Log weight</button>
        <button className="btn pill secondary" onClick={() => onNavigate('meals')}>🍽️ Meal ideas</button>
        <button className="btn pill secondary" onClick={() => onNavigate('workout')}>🏃 Workout</button>
      </div>
    </div>
  )
}
