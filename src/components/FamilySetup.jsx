import { useState } from 'react'
import { createFamily, joinFamily } from '../family.js'

// Shown after login when the user isn't in a family yet.
export default function FamilySetup({ email, initialData, onReady, onSignOut }) {
  const [mode, setMode] = useState('create') // create | join
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setErr(null)
    setBusy(true)
    try {
      const family =
        mode === 'create'
          ? await createFamily(name || 'My Family', initialData)
          : await joinFamily(code)
      onReady(family)
    } catch (e2) {
      setErr(e2.message || 'Something went wrong.')
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="brand" style={{ justifyContent: 'center', marginBottom: 6 }}>
          <span className="logo">🏡</span>
          <div>HomeFit<small>{email}</small></div>
        </div>
        <h2 style={{ textAlign: 'center' }}>Set up your family</h2>
        <p className="sub" style={{ textAlign: 'center', marginTop: -4 }}>
          Create a new family, or join an existing one with its invite code.
        </p>

        <div className="auth-tabs">
          <button className={mode === 'create' ? 'active' : ''} onClick={() => { setMode('create'); setErr(null) }}>Create family</button>
          <button className={mode === 'join' ? 'active' : ''} onClick={() => { setMode('join'); setErr(null) }}>Join family</button>
        </div>

        <form onSubmit={submit}>
          {mode === 'create' ? (
            <div className="field">
              <label>Family name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. The Rahman Family" autoFocus />
            </div>
          ) : (
            <div className="field">
              <label>Invite code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. 7F3A9C"
                maxLength={6}
                style={{ letterSpacing: 2, textTransform: 'uppercase' }}
                autoFocus
              />
            </div>
          )}
          <button className="btn" type="submit" disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Please wait…' : mode === 'create' ? 'Create family' : 'Join family'}
          </button>
        </form>

        {mode === 'create' && (
          <p className="sub" style={{ marginTop: 10 }}>
            You'll get an invite code to share so the rest of your family can join.
          </p>
        )}

        {err && <div className="sub" style={{ marginTop: 10, color: 'var(--red)' }}>⚠️ {err}</div>}

        <p className="sub" style={{ marginTop: 14, textAlign: 'center' }}>
          🔒 Your family’s data is private — other families can’t see it.
        </p>

        <button className="link-btn" onClick={onSignOut} style={{ display: 'block', margin: '14px auto 0' }}>
          Sign out
        </button>
      </div>
    </div>
  )
}
