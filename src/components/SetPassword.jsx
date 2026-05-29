import { useState } from 'react'

// Shown after a user clicks the password-reset link in their email.
export default function SetPassword({ auth }) {
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setMsg(null)
    if (pw.length < 6) { setMsg({ ok: false, text: 'Password must be at least 6 characters.' }); return }
    if (pw !== pw2) { setMsg({ ok: false, text: 'Passwords don’t match.' }); return }
    setBusy(true)
    const { error } = await auth.updatePassword(pw)
    setBusy(false)
    if (error) { setMsg({ ok: false, text: error.message }); return }
    auth.clearRecovery() // proceeds into the app, now signed in with the new password
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="brand" style={{ justifyContent: 'center', marginBottom: 6 }}>
          <span className="logo">🏡</span>
          <div>HomeFit<small>Reset your password</small></div>
        </div>
        <h2 style={{ textAlign: 'center' }}>Set a new password</h2>
        <p className="sub" style={{ textAlign: 'center', marginTop: -4 }}>
          Choose a new password for {auth.user?.email}.
        </p>
        <form onSubmit={submit}>
          <div className="field">
            <label>New password</label>
            <input type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="at least 6 characters" autoFocus />
          </div>
          <div className="field">
            <label>Confirm new password</label>
            <input type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="re-enter password" />
          </div>
          <button className="btn" type="submit" disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Saving…' : 'Save new password'}
          </button>
        </form>
        {msg && <div className="sub" style={{ marginTop: 10, color: msg.ok ? 'var(--green)' : 'var(--red)' }}>{msg.text}</div>}
        <button className="link-btn" onClick={() => { auth.clearRecovery(); auth.signOut() }} style={{ display: 'block', margin: '14px auto 0' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}
