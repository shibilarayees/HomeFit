// Daily reminder scheduling. Two strategies:
//  1. Notification Triggers API (TimestampTrigger) — fires even when the app is
//     CLOSED, but is Chromium-only/experimental. Used when available.
//  2. In-page setTimeout fallback — fires only while the tab/PWA is alive.
//
// True guaranteed background push (app fully closed, any browser) requires a
// push server, which HomeFit deliberately does not have (local-only, no backend).

import { quoteOfTheDay } from './data/quotes.js'

const KEY = 'homefit:reminders'

export function loadReminderSettings() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { enabled: false, time: '08:00' }
  } catch {
    return { enabled: false, time: '08:00' }
  }
}

export function saveReminderSettings(s) {
  localStorage.setItem(KEY, JSON.stringify(s))
}

export function supportsTriggers() {
  return typeof window !== 'undefined' && 'Notification' in window && 'TimestampTrigger' in window
}

// Next occurrence of HH:MM as a timestamp (ms).
function nextOccurrence(time) {
  const [h, m] = time.split(':').map(Number)
  const now = new Date()
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0)
  if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1)
  return next.getTime()
}

function notificationBody() {
  const q = quoteOfTheDay()
  return `“${q.text}” — ${q.author}\nTime to log water, meals & a quick workout!`
}

let timer = null

// Schedule the daily reminder. Returns a string describing the mode used.
export async function scheduleDailyReminder(time) {
  cancelDailyReminder()
  if (!('Notification' in window) || Notification.permission !== 'granted') return 'no-permission'

  const reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.ready.catch(() => null) : null
  const ts = nextOccurrence(time)

  // Strategy 1: real scheduled notification (works when closed, where supported).
  if (reg && supportsTriggers()) {
    try {
      await reg.showNotification('HomeFit reminder 💧', {
        tag: 'homefit-daily',
        body: notificationBody(),
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        // eslint-disable-next-line no-undef
        showTrigger: new TimestampTrigger(ts),
      })
      return 'scheduled' // fires even if app is closed
    } catch {
      /* fall through to timer */
    }
  }

  // Strategy 2: in-page timer (fires only while app stays open).
  const fire = async () => {
    const r = 'serviceWorker' in navigator ? await navigator.serviceWorker.ready.catch(() => null) : null
    const opts = { tag: 'homefit-daily', body: notificationBody(), icon: '/icon-192.png' }
    if (r) r.showNotification('HomeFit reminder 💧', opts)
    else new Notification('HomeFit reminder 💧', opts)
    timer = setTimeout(fire, 24 * 60 * 60 * 1000)
  }
  timer = setTimeout(fire, Math.max(1000, ts - Date.now()))
  return 'timer'
}

export function cancelDailyReminder() {
  if (timer) { clearTimeout(timer); timer = null }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((reg) => reg.getNotifications({ tag: 'homefit-daily' }).then((ns) => ns.forEach((n) => n.close())))
      .catch(() => {})
  }
}
