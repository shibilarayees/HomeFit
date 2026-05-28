import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid, Legend } from 'recharts'

export default function WeightChart({ history, goal, projPoints }) {
  // Merge actual weights and projected points into one date-keyed series.
  const map = new Map()
  history.forEach((h) => map.set(h.date, { date: h.date, weight: h.weightKg }))
  ;(projPoints || []).forEach((p) => {
    const row = map.get(p.date) || { date: p.date }
    row.projected = p.projected
    map.set(p.date, row)
  })
  const data = [...map.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => ({ ...r, label: r.date.slice(5) }))

  const all = [...history.map((h) => h.weightKg), ...(projPoints || []).map((p) => p.projected), goal].filter((v) => v != null)
  const min = Math.min(...all)
  const max = Math.max(...all)
  const pad = Math.max(1, (max - min) * 0.15)

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3a52" />
          <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
          <YAxis domain={[Math.floor(min - pad), Math.ceil(max + pad)]} stroke="#94a3b8" fontSize={12} />
          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #2a3a52', borderRadius: 10, color: '#e2e8f0' }} />
          {projPoints && projPoints.length > 0 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {goal != null && (
            <ReferenceLine y={goal} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'goal', fill: '#f59e0b', fontSize: 11, position: 'insideTopRight' }} />
          )}
          <Line type="monotone" dataKey="weight" name="actual" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981' }} connectNulls />
          {projPoints && projPoints.length > 0 && (
            <Line type="monotone" dataKey="projected" name="projected" stroke="#a78bfa" strokeWidth={2} strokeDasharray="5 4" dot={false} connectNulls />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
