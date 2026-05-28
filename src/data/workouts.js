// Daily workout suggestions by age group. Videos are public YouTube links
// embedded read-only. Swap the ids for your family's favourites anytime.

export const WORKOUTS = {
  toddler: [
    { title: 'Toddler dance & move along', duration: '10 min', youtubeId: 'cs_yCKHWefc' },
    { title: 'Animal walks for little ones', duration: '8 min', youtubeId: 'dEH0czyB1xc' },
  ],
  child: [
    { title: 'Kids fun cardio workout', duration: '15 min', youtubeId: 'L_A_HjHZxfI' },
    { title: 'Cosmic kids yoga adventure', duration: '20 min', youtubeId: 'YzKqj2tSjE0' },
  ],
  preteen: [
    { title: 'Kids HIIT — no equipment', duration: '20 min', youtubeId: 'L_A_HjHZxfI' },
    { title: 'Beginner bodyweight strength', duration: '18 min', youtubeId: 'UItWltVZZmE' },
  ],
  teen: [
    { title: 'Full-body HIIT for teens', duration: '25 min', youtubeId: 'ml6cT4AZdqI' },
    { title: 'No-equipment strength circuit', duration: '20 min', youtubeId: 'UItWltVZZmE' },
  ],
  adult: [
    { title: 'Full-body fat-burn HIIT', duration: '30 min', youtubeId: 'ml6cT4AZdqI' },
    { title: 'Low-impact home cardio', duration: '25 min', youtubeId: 'gC_L9qAHVJ8' },
    { title: 'Beginner strength workout', duration: '20 min', youtubeId: 'UItWltVZZmE' },
  ],
  senior: [
    { title: 'Gentle seated full-body', duration: '20 min', youtubeId: 'tB3X4tjgZBU' },
    { title: 'Low-impact walk at home', duration: '15 min', youtubeId: 'gC_L9qAHVJ8' },
  ],
}

export function workoutsFor(group) {
  return WORKOUTS[group] || WORKOUTS.adult
}

// Minutes from a duration label like "30 min".
export function parseMinutes(duration) {
  const m = parseInt(duration, 10)
  return Number.isFinite(m) ? m : 0
}

// Back-compatible: older logs only had a `workoutDone` boolean.
export function isWorkoutDay(day) {
  return (day.workouts && day.workouts.length > 0) || !!day.workoutDone
}

export function activeMinutes(day) {
  return (day.workouts || []).reduce((s, w) => s + (w.minutes || 0), 0)
}
