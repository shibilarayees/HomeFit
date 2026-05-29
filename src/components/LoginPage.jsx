import { useState } from 'react'
import { quoteOfTheDay } from '../data/quotes.js'

export default function LoginPage({ auth }) {
  const [mode, setMode] = useState('signin') // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const quote = quoteOfTheDay()

  if (!auth.isConfigured) {
    return (
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="brand" style={{ justifyContent: 'center', marginBottom: 12 }}>
            <span className="logo">🏡</span><b style={{ fontSize: 22 }}>HomeFit</b>
          </div>
          <h2>Setup needed</h2>
          <p className="sub">
            Accounts aren't configured yet. Set <code>VITE_SUPABASE_URL</code> and{' '}
            <code>VITE_SUPABASE_ANON_KEY</code> (locally in <code>.env</code> and in your Vercel
            project settings), then reload.
          </p>
        </div>
      </div>
    )
  }

  async function submit(e) {
    e.preventDefault()
    setMsg(null)
    if (!email.trim() || password.length < 6) {
      setMsg({ ok: false, text: 'Enter an email and a password of at least 6 characters.' })
      return
    }
    setBusy(true)
    const fn = mode === 'signin' ? auth.signIn : auth.signUp
    const { data, error } = await fn(email, password)
    setBusy(false)
    if (error) {
      setMsg({ ok: false, text: error.message })
      return
    }
    if (mode === 'signup' && !data.session) {
      setMsg({ ok: true, text: '✅ Check your email to confirm your account, then sign in.' })
      setMode('signin')
    }
    // On success with a session, the auth listener swaps to the app automatically.
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="brand" style={{ justifyContent: 'center', marginBottom: 6 }}>
          <span className="logo">🏡</span>
          <div>HomeFit<small>Family health, tracked together</small></div>
        </div>

        <div className="auth-tabs">
          <button className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setMsg(null) }}>Sign in</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setMsg(null) }}>Create account</button>
        </div>

        <form onSubmit={submit}>
          <div className="field">
            <label>Email</label>
            <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="at least 6 characters" />
          </div>
          <button className="btn" type="submit" disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        {msg && (
          <div className="sub" style={{ marginTop: 10, color: msg.ok ? 'var(--green)' : 'var(--red)' }}>
            {msg.text}
          </div>
        )}

        <div className="how-it-works">
          <b>New here? How it works</b>
          <ol>
            <li><b>Create an account</b> above (email + password).</li>
            <li><b>Start a family</b> — you’ll get a short invite code to share, or <b>join</b> your family with a code someone gave you.</li>
            <li>Add each family member and start tracking — everyone in your family shares the same view.</li>
          </ol>
          <span>🔒 Your data is private to your family — other families can’t see it — and syncs across your devices.</span>
        </div>

        <p className="sub" style={{ marginTop: 12, textAlign: 'center', fontSize: 12 }}>
          Forgot your password? Contact the person who shared HomeFit with you to get it reset.
        </p>

        <p className="sub" style={{ marginTop: 12, fontStyle: 'italic', textAlign: 'center' }}>
          “{quote.text}”
        </p>
      </div>
    </div>
  )
}
