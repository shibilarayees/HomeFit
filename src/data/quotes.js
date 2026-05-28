// Motivational quotes. A deterministic day-of-year index gives everyone the
// same "quote of the day" without needing randomness or a server.

export const QUOTES = [
  { text: 'Take care of your body. It’s the only place you have to live.', author: 'Jim Rohn' },
  { text: 'A year from now you may wish you had started today.', author: 'Karen Lamb' },
  { text: 'Small steps every day add up to big results.', author: 'Unknown' },
  { text: 'The greatest wealth is health.', author: 'Virgil' },
  { text: 'Don’t count the days, make the days count.', author: 'Muhammad Ali' },
  { text: 'Your body can stand almost anything. It’s your mind you have to convince.', author: 'Unknown' },
  { text: 'Drink water like it’s your job today.', author: 'HomeFit' },
  { text: 'Strive for progress, not perfection.', author: 'Unknown' },
  { text: 'A healthy family is a happy family.', author: 'HomeFit' },
  { text: 'Eat to fuel your body, not just your feelings.', author: 'Unknown' },
  { text: 'The hardest lift is lifting yourself off the couch.', author: 'Unknown' },
  { text: 'Every glass of water is a small win.', author: 'HomeFit' },
  { text: 'Discipline is choosing what you want most over what you want now.', author: 'Unknown' },
  { text: 'Move your body today so your future self can thank you.', author: 'HomeFit' },
]

export function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date - start
  return Math.floor(diff / 86400000)
}

export function quoteOfTheDay(date = new Date()) {
  return QUOTES[dayOfYear(date) % QUOTES.length]
}
