import { useEffect, useMemo, useState } from 'react'
import { useStore, todayKey } from './store/useStore.js'
import { useAuth } from './auth.js'
import { useFamily, fetchFamilyMembers } from './family.js'
import { quoteOfTheDay } from './data/quotes.js'
import { checkIsAdmin } from './admin.js'
import LoginPage from './components/LoginPage.jsx'
import FamilySetup from './components/FamilySetup.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import {
  loadReminderSettings, saveReminderSettings, scheduleDailyReminder, cancelDailyReminder, supportsTriggers,
} from './reminders.js'
import MemberForm from './components/MemberForm.jsx'
import Dashboard from './components/Dashboard.jsx'
import { CalorieTracker, WaterTracker, WeightTracker } from './components/Trackers.jsx'
import WeightChart from './components/WeightChart.jsx'
import MealPrep from './components/MealPrep.jsx'
import Workouts from './components/Workouts.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import History from './components/History.jsx'
import DataBackup from './components/DataBackup.jsx'

const TABS = [
  { id: 'home', label: '🏠 Dashboard' },
  { id: 'calories', label: '🍎 Calories' },
  { id: 'water', label: '💧 Water' },
  { id: 'weight', label: '⚖️ Weight' },
  { id: 'meals', label: '🍽️ Meal Prep' },
  { id: 'workout', label: '🏃 Workouts' },
  { id: 'history', label: '📅 History' },
]

const AVATAR_COLORS = ['#10b981', '#38bdf8', '#f59e0b', '#f43f5e', '#a78bfa', '#34d399']
const FAMILY = 'family'

const initials = (name) => name.trim().slice(0, 2).toUpperCase()

// Best available on-device data to seed a newly created family (from the
// previous per-user or local-only storage), so existing data isn't lost.
function localSeed(userId) {
  for (const k of [`homefit:v1:${userId}`, 'homefit:v1']) {
    try {
      const d = JSON.parse(localStorage.getItem(k) || 'null')
      if (d?.members?.length) return d
    } catch { /* ignore */ }
  }
  return { members: [], logs: {} }
}

export default function App() {
  const auth = useAuth()
  const fam = useFamily(auth.user?.id)
  const family = fam.family
  const store = useStore(family?.id)
  const { members } = store
  const [activeId, setActiveId] = useState(FAMILY)
  const [tab, setTab] = useState('home')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [reminderOpen, setReminderOpen] = useState(false)
  const [reminders, setReminders] = useState(loadReminderSettings)
  const [reminderMode, setReminderMode] = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [famMembers, setFamMembers] = useState([])
  const [copied, setCopied] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)

  const quote = useMemo(() => quoteOfTheDay(), [])

  // Is this account an app admin? (controls the 📊 Admin button)
  useEffect(() => {
    let on = true
    if (auth.user) checkIsAdmin().then((v) => { if (on) setIsAdmin(v) })
    else setIsAdmin(false)
    return () => { on = false }
  }, [auth.user])

  // Load the list of accounts in the family when the invite panel opens.
  useEffect(() => {
    if (inviteOpen && family?.id) fetchFamilyMembers(family.id).then(setFamMembers)
  }, [inviteOpen, family?.id])

  function copyCode() {
    if (!family?.invite_code) return
    navigator.clipboard?.writeText(family.invite_code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  // Re-arm reminders on load if previously enabled.
  useEffect(() => {
    if (reminders.enabled) {
      scheduleDailyReminder(reminders.time).then(setReminderMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function applyReminders(next) {
    setReminders(next)
    saveReminderSettings(next)
    if (!next.enabled) {
      cancelDailyReminder()
      setReminderMode('')
      return
    }
    if (!('Notification' in window)) {
      alert('This browser does not support notifications.')
      return
    }
    const perm = await Notification.requestPermission()
    if (perm !== 'granted') {
      alert('Notifications were blocked. Enable them in your browser settings to get reminders.')
      setReminders((s) => ({ ...s, enabled: false }))
      saveReminderSettings({ ...next, enabled: false })
      return
    }
    const mode = await scheduleDailyReminder(next.time)
    setReminderMode(mode)
  }

  const member = activeId === FAMILY ? null : members.find((m) => m.id === activeId) || null
  const day = member ? store.getDay(member.id, todayKey()) : null

  function handleSave(data) {
    if (editing) {
      store.updateMember(editing.id, data)
    } else {
      const id = store.addMember(data)
      setActiveId(id)
      setTab('home')
    }
    setFormOpen(false)
    setEditing(null)
  }

  function handleDelete() {
    if (editing && confirm(`Remove ${editing.name} and all their data?`)) {
      store.removeMember(editing.id)
      setActiveId(FAMILY)
      setFormOpen(false)
      setEditing(null)
    }
  }

  // Auth gating: show a splash while resolving, and the login page when signed out
  // (only when Supabase is configured — otherwise the app runs local-only).
  if (auth.loading) {
    return <div className="auth-wrap"><div className="auth-card" style={{ textAlign: 'center' }}>Loading…</div></div>
  }
  if (auth.isConfigured && !auth.user) {
    return <LoginPage auth={auth} />
  }
  // Logged in but not yet in a family → create/join screen.
  if (auth.isConfigured && auth.user && fam.loading) {
    return <div className="auth-wrap"><div className="auth-card" style={{ textAlign: 'center' }}>Loading your family…</div></div>
  }
  if (auth.isConfigured && auth.user && !family) {
    return (
      <FamilySetup
        email={auth.user.email}
        initialData={localSeed(auth.user.id)}
        onReady={(f) => fam.setFamily(f)}
        onSignOut={() => auth.signOut()}
      />
    )
  }

  const syncLabel = { loading: '☁️ syncing…', synced: '☁️ synced', offline: '⚠️ offline', idle: '' }[store.syncStatus]

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <span className="logo">🏡</span>
          <div>
            HomeFit
            <small>Family health, tracked together</small>
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          {family && (
            <button className="btn ghost sm" onClick={() => setInviteOpen(true)} title="Family & invite code">
              👨‍👩‍👧 {family.name}
            </button>
          )}
          {isAdmin && (
            <button className="btn ghost sm" onClick={() => setAdminOpen(true)} title="App admin overview">
              📊 Admin
            </button>
          )}
          {auth.isConfigured && syncLabel && <span className="sync-badge" title={auth.user?.email}>{syncLabel}</span>}
          <button className="btn ghost sm" onClick={() => setReminderOpen(true)} title="Daily reminders">
            {reminders.enabled ? `🔔 ${reminders.time}` : '🔕 Reminders'}
          </button>
          {auth.isConfigured && (
            <button className="btn ghost sm" onClick={() => auth.signOut()} title={`Sign out ${auth.user?.email || ''}`}>
              Sign out
            </button>
          )}
        </div>
      </div>

      <div className="quote">
        <span className="icon">💬</span>
        <div>
          <p>“{quote.text}”</p>
          <span>— {quote.author}</span>
        </div>
      </div>

      <div className="members">
        <button
          className={`chip ${activeId === FAMILY ? 'active' : ''}`}
          onClick={() => { setActiveId(FAMILY); setTab('home') }}
        >
          👪 Family
        </button>
        {members.map((m, i) => (
          <button
            key={m.id}
            className={`chip ${m.id === activeId ? 'active' : ''}`}
            onClick={() => { setActiveId(m.id); setTab('home') }}
            onDoubleClick={() => { setEditing(m); setFormOpen(true) }}
          >
            <span className="avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
              {initials(m.name)}
            </span>
            {m.name}
          </button>
        ))}
        <button className="chip add" onClick={() => { setEditing(null); setFormOpen(true) }}>
          ＋ Add member
        </button>
      </div>

      {activeId === FAMILY ? (
        members.length === 0 ? (
          <div className="empty">
            <div className="big-icon">👨‍👩‍👧‍👦</div>
            <h2>Welcome to HomeFit</h2>
            <p>Add each family member to start tracking calories, water, weight and more —
              with targets tuned to their age.</p>
            <button className="btn" onClick={() => { setEditing(null); setFormOpen(true) }}>
              ＋ Add your first member
            </button>
          </div>
        ) : (
          <>
            <Leaderboard members={members} store={store} onPick={(id) => { setActiveId(id); setTab('home') }} />
            <DataBackup store={store} />
          </>
        )
      ) : (
        <>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
            <h1 style={{ fontSize: 20, margin: 0 }}>{member.name}</h1>
            <button className="btn ghost sm" onClick={() => { setEditing(member); setFormOpen(true) }}>
              ✎ Edit profile
            </button>
          </div>

          <div className="nav">
            {TABS.map((t) => (
              <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'home' && <Dashboard member={member} day={day} onNavigate={setTab} />}
          {tab === 'calories' && <CalorieTracker member={member} day={day} store={store} />}
          {tab === 'water' && <WaterTracker member={member} day={day} store={store} />}
          {tab === 'weight' && <WeightTracker member={member} store={store} WeightChart={WeightChart} />}
          {tab === 'meals' && <MealPrep member={member} />}
          {tab === 'workout' && <Workouts member={member} store={store} />}
          {tab === 'history' && <History member={member} store={store} />}
        </>
      )}

      <p className="disclaimer">
        ⚠️ HomeFit gives general estimates based on public dietary guidelines, not medical advice.
        Calorie and water targets — especially for children — should be confirmed with a doctor or
        registered dietitian. Your data is saved privately to your family account.
      </p>

      {formOpen && (
        <MemberForm
          initial={editing}
          onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditing(null) }}
          onDelete={editing ? handleDelete : undefined}
        />
      )}

      {reminderOpen && (
        <div className="overlay" onClick={() => setReminderOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Daily reminders 🔔</h2>
            <p className="sub" style={{ marginTop: -6 }}>
              A daily nudge with the quote of the day and a prompt to log water, meals & a workout.
            </p>
            <div className="field">
              <label>Reminder time</label>
              <input
                type="time"
                value={reminders.time}
                onChange={(e) => setReminders((s) => ({ ...s, time: e.target.value }))}
              />
            </div>
            <div className="row" style={{ marginTop: 8 }}>
              <button className="btn" onClick={() => { applyReminders({ ...reminders, enabled: true }); setReminderOpen(false) }}>
                {reminders.enabled ? 'Update reminder' : 'Enable reminders'}
              </button>
              {reminders.enabled && (
                <button className="btn ghost" onClick={() => { applyReminders({ ...reminders, enabled: false }); setReminderOpen(false) }}>
                  Turn off
                </button>
              )}
            </div>
            <p className="disclaimer" style={{ marginTop: 14 }}>
              {supportsTriggers()
                ? '✅ Your browser supports scheduled notifications — reminders can fire even when HomeFit is closed (install it to your home screen for best results).'
                : 'ℹ️ Your browser fires reminders while HomeFit is open in a tab or installed. Guaranteed delivery when fully closed would need a push server, which this app does not use yet.'}
            </p>
          </div>
        </div>
      )}

      {inviteOpen && family && (
        <div className="overlay" onClick={() => setInviteOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>👨‍👩‍👧 {family.name}</h2>
            <p className="sub" style={{ marginTop: -6 }}>
              Share this invite code so the rest of your family can join and track together.
            </p>
            <div className="invite-code" onClick={copyCode} title="Tap to copy">
              <span>{family.invite_code}</span>
              <button className="btn sm">{copied ? '✓ Copied' : 'Copy'}</button>
            </div>
            <h3 style={{ marginBottom: 6 }}>Members ({famMembers.length})</h3>
            <div className="list">
              {famMembers.map((m, i) => (
                <div className="list-item" key={i}>
                  <span>{m.email || 'member'}</span>
                  {m.role === 'owner' && <span className="badge">owner</span>}
                </div>
              ))}
            </div>
            <div className="row" style={{ marginTop: 14 }}>
              <button className="btn ghost" onClick={() => setInviteOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
    </div>
  )
}
