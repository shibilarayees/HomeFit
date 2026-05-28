// Kerala meal-prep ideas grouped by weekly goal, for Kerala families.
// Each idea carries an adult `portion` and adult `kcal`; both are scaled down
// for children via portionFactor(age). veg:false = contains meat/fish/egg.

export const MEAL_IDEAS = {
  lose: [
    { name: 'Appam with vegetable stew', portion: '2 appam + 0.5 cup stew', kcal: 300, meal: 'Breakfast', veg: true, kidFriendly: true },
    { name: 'Idiyappam with egg curry', portion: '2 idiyappam + 1 egg', kcal: 290, meal: 'Breakfast', veg: false, kidFriendly: true },
    { name: 'Puttu with kadala curry', portion: '1 puttu + 0.5 cup kadala', kcal: 320, meal: 'Breakfast', veg: true, kidFriendly: true },
    { name: 'Kerala rice with sambar & thoran', portion: '1 cup rice + sides', kcal: 380, meal: 'Lunch', veg: true, kidFriendly: true },
    { name: 'Rice with fish curry & salad', portion: '1 cup rice + 1 cup fish curry', kcal: 400, meal: 'Lunch', veg: false, kidFriendly: false },
    { name: 'Kappa with kadala curry', portion: '1 cup kappa + 0.5 cup curry', kcal: 360, meal: 'Lunch', veg: true, kidFriendly: true },
    { name: 'Chapathi with veg korma', portion: '2 chapathi + 0.5 cup korma', kcal: 350, meal: 'Dinner', veg: true, kidFriendly: true },
    { name: 'Appam with chicken stew', portion: '2 appam + 0.5 cup stew', kcal: 380, meal: 'Dinner', veg: false, kidFriendly: true },
    { name: 'Steamed nendran banana', portion: '1 banana', kcal: 130, meal: 'Snack', veg: true, kidFriendly: true },
    { name: 'Parippu vada', portion: '1 no', kcal: 90, meal: 'Snack', veg: true, kidFriendly: true },
  ],
  maintain: [
    { name: 'Puttu with kadala curry', portion: '1 puttu + 1 cup kadala', kcal: 400, meal: 'Breakfast', veg: true, kidFriendly: true },
    { name: 'Appam with egg roast', portion: '2 appam + 1 egg roast', kcal: 420, meal: 'Breakfast', veg: false, kidFriendly: true },
    { name: 'Dosa with sambar & chutney', portion: '2 dosa + sambar', kcal: 360, meal: 'Breakfast', veg: true, kidFriendly: true },
    { name: 'Idiyappam with chicken stew', portion: '3 idiyappam + 1 cup stew', kcal: 450, meal: 'Breakfast', veg: false, kidFriendly: true },
    { name: 'Mini Kerala sadya', portion: 'rice + thoran + olan + avial', kcal: 600, meal: 'Lunch', veg: true, kidFriendly: true },
    { name: 'Rice with fish curry & thoran', portion: '1.5 cup rice + fish curry', kcal: 560, meal: 'Lunch', veg: false, kidFriendly: true },
    { name: 'Kappa with kadala curry', portion: '1 cup kappa + 1 cup curry', kcal: 480, meal: 'Lunch', veg: true, kidFriendly: true },
    { name: 'Chapathi with chicken curry', portion: '2 chapathi + 1 cup curry', kcal: 520, meal: 'Dinner', veg: false, kidFriendly: true },
    { name: 'Appam with green peas curry', portion: '3 appam + 1 cup curry', kcal: 480, meal: 'Dinner', veg: true, kidFriendly: true },
    { name: 'Rice with moru curry & thoran', portion: '1.5 cup rice + sides', kcal: 450, meal: 'Dinner', veg: true, kidFriendly: true },
    { name: 'Pazham pori (banana fritter)', portion: '2 nos', kcal: 220, meal: 'Snack', veg: true, kidFriendly: true },
    { name: 'Unniyappam', portion: '3 nos', kcal: 210, meal: 'Snack', veg: true, kidFriendly: true },
    { name: 'Kerala tea + parippu vada', portion: '1 cup + 1 vada', kcal: 180, meal: 'Snack', veg: true, kidFriendly: true },
  ],
  gain: [
    { name: 'Puttu with fish curry & egg', portion: '1.5 puttu + fish curry + 1 egg', kcal: 560, meal: 'Breakfast', veg: false, kidFriendly: true },
    { name: 'Appam with chicken stew & egg', portion: '4 appam + stew + 1 egg', kcal: 620, meal: 'Breakfast', veg: false, kidFriendly: true },
    { name: 'Ghee dosa with kadala & banana', portion: '3 dosa + kadala + 1 banana', kcal: 580, meal: 'Breakfast', veg: true, kidFriendly: true },
    { name: 'Beef ularthiyathu with rice', portion: '2 cup rice + beef fry', kcal: 720, meal: 'Lunch', veg: false, kidFriendly: false },
    { name: 'Full Kerala sadya', portion: 'rice + 6 sides + payasam', kcal: 750, meal: 'Lunch', veg: true, kidFriendly: true },
    { name: 'Rice with chicken curry & thoran', portion: '2 cup rice + chicken curry', kcal: 700, meal: 'Lunch', veg: false, kidFriendly: true },
    { name: 'Porotta with chicken curry', portion: '2 porotta + 1 cup curry', kcal: 720, meal: 'Dinner', veg: false, kidFriendly: true },
    { name: 'Appam with mutton stew', portion: '4 appam + mutton stew', kcal: 700, meal: 'Dinner', veg: false, kidFriendly: false },
    { name: 'Ghee rice with veg kurma & paneer', portion: '2 cup ghee rice + kurma', kcal: 680, meal: 'Dinner', veg: true, kidFriendly: true },
    { name: 'Banana & dates milkshake', portion: '1 glass', kcal: 420, meal: 'Snack', veg: true, kidFriendly: true },
    { name: 'Egg/beef cutlet', portion: '2 nos', kcal: 380, meal: 'Snack', veg: false, kidFriendly: true },
    { name: 'Pazham pori + tea', portion: '3 nos + tea', kcal: 400, meal: 'Snack', veg: true, kidFriendly: true },
  ],
}

// Scale the numbers inside a portion string by the age factor (nearest 0.5, min 0.5).
export function scalePortion(portion, factor = 1) {
  if (factor === 1) return portion
  return portion.replace(/\d+(\.\d+)?/g, (m) => {
    const scaled = Math.max(0.5, Math.round(parseFloat(m) * factor * 2) / 2)
    return Number.isInteger(scaled) ? String(scaled) : String(scaled)
  })
}

// Build a one-day sample plan that lands near a calorie target.
// `seed` rotates picks so each day differs; `diet` ('veg') filters non-veg;
// `factor` (from portionFactor(age)) scales portion sizes & calories age-wise.
export function buildDayPlan(goal, calorieTarget, kidOnly = false, seed = 0, diet = 'nonveg', factor = 1) {
  let pool = MEAL_IDEAS[goal] || MEAL_IDEAS.maintain
  if (kidOnly) pool = pool.filter((m) => m.kidFriendly)
  if (diet === 'veg') pool = pool.filter((m) => m.veg)
  const order = ['Breakfast', 'Lunch', 'Dinner', 'Snack']
  const plan = []
  let total = 0
  order.forEach((slot, slotIdx) => {
    const options = pool.filter((m) => m.meal === slot)
    if (options.length) {
      const pick = options[(seed + slotIdx) % options.length]
      const kcal = Math.round(pick.kcal * factor)
      plan.push({ ...pick, portion: scalePortion(pick.portion, factor), kcal })
      total += kcal
    }
  })
  return { plan, total, target: calorieTarget }
}
