// Linear-regression projection of weight toward a goal.
// history: [{date:'yyyy-mm-dd', weightKg}] ascending. Returns null if <2 points.

const DAY = 86400000

export function projectWeight(history, goal) {
  if (!history || history.length < 2) return null

  const t0 = Date.parse(history[0].date)
  const pts = history.map((h) => ({ x: (Date.parse(h.date) - t0) / DAY, y: h.weightKg }))
  const n = pts.length
  const sx = pts.reduce((s, p) => s + p.x, 0)
  const sy = pts.reduce((s, p) => s + p.y, 0)
  const sxx = pts.reduce((s, p) => s + p.x * p.x, 0)
  const sxy = pts.reduce((s, p) => s + p.x * p.y, 0)
  const denom = n * sxx - sx * sx
  const slope = denom === 0 ? 0 : (n * sxy - sx * sy) / denom // kg/day

  const last = history[history.length - 1]
  const lastX = pts[n - 1].x
  const lastY = last.weightKg
  const result = { slopePerWeek: +(slope * 7).toFixed(2), lastWeight: lastY, onTrack: false }

  if (goal == null || slope === 0 || !Number.isFinite(slope)) return result

  const daysToGoal = (goal - lastY) / slope
  // Must be in the future and within ~2 years to be a meaningful projection.
  if (daysToGoal <= 0 || daysToGoal > 730) return result

  result.onTrack = true
  result.daysToGoal = Math.round(daysToGoal)
  result.goalDate = new Date(Date.parse(last.date) + daysToGoal * DAY)

  // Projection points anchored at the last actual weight, extended to the goal.
  const steps = 6
  result.projPoints = []
  for (let i = 0; i <= steps; i++) {
    const dx = (daysToGoal * i) / steps
    const ms = Date.parse(last.date) + dx * DAY
    result.projPoints.push({
      date: new Date(ms).toISOString().slice(0, 10),
      projected: +(lastY + slope * dx).toFixed(1),
    })
  }
  return result
}

export function formatGoalDate(date) {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}
