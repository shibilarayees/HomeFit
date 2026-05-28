// Age-based nutrition targets.
// NOTE: These are general estimates based on public dietary guidelines
// (USDA Dietary Guidelines, IOM water intake references, Mifflin-St Jeor BMR).
// They are NOT medical advice — kids especially should follow a pediatrician's guidance.

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary (little/no exercise)', factor: 1.2 },
  { value: 'light', label: 'Lightly active (1-3 days/wk)', factor: 1.375 },
  { value: 'moderate', label: 'Moderately active (3-5 days/wk)', factor: 1.55 },
  { value: 'active', label: 'Very active (6-7 days/wk)', factor: 1.725 },
]

export const WEEKLY_GOALS = [
  { value: 'lose', label: 'Lose weight', kcalDelta: -500 },
  { value: 'maintain', label: 'Maintain', kcalDelta: 0 },
  { value: 'gain', label: 'Gain weight', kcalDelta: 350 },
]

export function activityFactor(level) {
  return (ACTIVITY_LEVELS.find((a) => a.value === level) || ACTIVITY_LEVELS[2]).factor
}

// Estimated daily calories for children & teens (kcal), moderately active.
// Source: USDA Dietary Guidelines estimated energy requirements, banded by age.
function childCalories(age, sex) {
  const male = sex === 'male'
  if (age <= 1) return 800
  if (age <= 3) return 1200
  if (age <= 8) return male ? 1600 : 1500
  if (age <= 13) return male ? 2000 : 1800
  // 14-17 teens
  return male ? 2600 : 2000
}

// Mifflin-St Jeor BMR for adults (18+). Requires weight(kg), height(cm).
function adultBMR({ weightKg, heightCm, age, sex }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

export function isChild(age) {
  return age < 18
}

// Returns recommended daily calorie target for a member.
export function calorieTarget(member) {
  const { age, sex, weightKg, heightCm, activity, goal } = member
  let maintenance
  if (isChild(age)) {
    // Children's needs already reflect growth; we don't apply a deficit by default.
    maintenance = childCalories(age, sex)
    // Light adjustment for activity beyond "moderate" baseline.
    const f = activityFactor(activity)
    maintenance = Math.round(maintenance * (f / 1.55))
    return { target: maintenance, maintenance, isChild: true }
  }
  const bmr = adultBMR({ weightKg, heightCm, age, sex })
  maintenance = Math.round(bmr * activityFactor(activity))
  const delta = (WEEKLY_GOALS.find((g) => g.value === goal) || WEEKLY_GOALS[1]).kcalDelta
  // Never recommend below a safe floor.
  const floor = sex === 'male' ? 1500 : 1200
  const target = Math.max(floor, maintenance + delta)
  return { target, maintenance, isChild: false }
}

// Recommended daily drinking water (ml). Based on IOM total-water adequate intake,
// adjusted to the ~70-80% that typically comes from beverages.
export function waterTarget(member) {
  const { age, sex, weightKg } = member
  if (age <= 3) return 1000
  if (age <= 8) return 1200
  if (age <= 13) return sex === 'male' ? 1800 : 1600
  if (age <= 17) return sex === 'male' ? 2600 : 1800
  // Adults: ~35 ml per kg, clamped to sensible bounds, with sex-based defaults.
  if (weightKg) return Math.round(Math.min(4000, Math.max(2000, weightKg * 35)))
  return sex === 'male' ? 3000 : 2200
}

export function bmi(member, weightKg) {
  const w = weightKg ?? member.weightKg
  if (!w || !member.heightCm) return null
  const m = member.heightCm / 100
  return +(w / (m * m)).toFixed(1)
}

export function ageGroup(age) {
  if (age <= 3) return 'toddler'
  if (age <= 8) return 'child'
  if (age <= 13) return 'preteen'
  if (age <= 17) return 'teen'
  if (age <= 64) return 'adult'
  return 'senior'
}
