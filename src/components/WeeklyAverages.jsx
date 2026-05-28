import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, CartesianGrid, Legend,
} from 'recharts'
import { calorieTarget, waterTarget } from '../data/nutrition.js'
import { activeMinutes } from '../data/workouts.js'
import { todayKey } from '../store/useStore.js'

const WEEKS = 6

function keyOffset(days) {
  const base = new Date(todayKey() + 'T00:00:00Z')
  base.setUTCDate(base.getUTCDate() + days)
  return base.toISOString().slice(0, 10)
}

export default function WeeklyAverages({ member, store }) {
  const calTarget = calorieTarget(member).target
  const waterGoal = waterTarget(member)

  // Build trailing 6-week buckets, oldest first.
  const data = []
  let anyData = false
  let anyMinutes = false
  for (let w = WEEKS - 1; w >= 0; w--) {
    let calSum = 0, calDays = 0, waterSum = 0, waterDays = 0, minSum = 0
    let endKey = null
    for (let d = 0; d < 7; d++) {
      const offset = -(w * 7 + d)
      const key = keyOffset(offset)
      if (d === 0) endKey = key
      const day = store.getDay(member.id, key)
      const eaten = day.food.reduce((s, f) => s + (f.kcal || 0), 0)
      if (eaten > 0) { calSum += eaten; calDays++ }
      if (day.waterMl > 0) { waterSum += day.waterMl; waterDays++ }
      minSum += activeMinutes(day)
    }
    if (calDays || waterDays) anyData = true
    if (minSum > 0) anyMinutes = true
    data.push({
      label: endKey.slice(5), // MM-DD of the week's most recent day
      calories: calDays ? Math.round(calSum / calDays) : 0,
      water: waterDays ? Math.round(waterSum / waterDays) : 0,
      minutes: minSum,
    })
  }

  // Scale each axis to include the target so its dashed reference line is visible.
  const maxCal = Math.max(calTarget, ...data.map((d) => d.calories))
  const maxWater = Math.max(waterGoal, ...data.map((d) => d.water))
  const calMax = Math.ceil((maxCal * 1.1) / 100) * 100
  const waterMax = Math.ceil((maxWater * 1.1) / 100) * 100

  if (!anyData) {
    return (
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Weekly averages</h3>
        <div className="sub">Log meals and water across a few days to see weekly trends here.</div>
      </div>
    )
  }

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3>Weekly averages — last {WEEKS} weeks</h3>
      <div className="sub" style={{ marginBottom: 8 }}>
        Avg per logged day · bars = calories, line = water. Dashed lines are this member's targets.
      </div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3a52" />
            <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
            <YAxis yAxisId="cal" domain={[0, calMax]} stroke="#10b981" fontSize={11} />
            <YAxis yAxisId="water" orientation="right" domain={[0, waterMax]} stroke="#38bdf8" fontSize={11} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #2a3a52', borderRadius: 10, color: '#e2e8f0' }}
              formatter={(v, name) => [`${v} ${name === 'calories' ? 'kcal' : 'ml'}`, name === 'calories' ? 'Avg calories' : 'Avg water']}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine yAxisId="cal" y={calTarget} stroke="#10b981" strokeDasharray="4 4" />
            <ReferenceLine yAxisId="water" y={waterGoal} stroke="#38bdf8" strokeDasharray="4 4" />
            <Bar yAxisId="cal" dataKey="calories" name="calories" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={34} />
            <Line yAxisId="water" type="monotone" dataKey="water" name="water" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3, fill: '#38bdf8' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {anyMinutes && (
        <>
          <div className="sub" style={{ margin: '14px 0 8px' }}>🏃 Active minutes per week</div>
          <div style={{ width: '100%', height: 160 }}>
            <ResponsiveContainer>
              <ComposedChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3a52" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#a78bfa" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #2a3a52', borderRadius: 10, color: '#e2e8f0' }}
                  formatter={(v) => [`${v} min`, 'Active minutes']}
                />
                <Bar dataKey="minutes" name="minutes" fill="#a78bfa" radius={[4, 4, 0, 0]} maxBarSize={34} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
