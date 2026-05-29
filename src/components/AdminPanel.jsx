import { useEffect, useState } from 'react'
import { fetchAdminOverview } from '../admin.js'

const fmtDate = (s) => (s ? new Date(s).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—')

export default function AdminPanel({ onClose }) {
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    fetchAdminOverview().then(setData).catch((e) => setErr(e.message || 'Failed to load'))
  }, [])

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>📊 Admin overview</h2>
          <button className="btn ghost sm" onClick={onClose}>✕ Close</button>
        </div>
        <p className="sub" style={{ marginTop: 4 }}>Aggregate usage only — no family logs or health data.</p>

        {err && <div className="sub" style={{ color: 'var(--red)', marginTop: 8 }}>⚠️ {err}</div>}
        {!data && !err && <div className="sub" style={{ marginTop: 8 }}>Loading…</div>}

        {data && (
          <>
            <div className="grid" style={{ marginTop: 12 }}>
              <div className="card"><h3>Sign-ups</h3><div className="big">{data.signups}</div></div>
              <div className="card"><h3>Families</h3><div className="big">{data.families}</div></div>
              <div className="card"><h3>People joined</h3><div className="big">{data.people}</div></div>
              <div className="card"><h3>Active (7d)</h3><div className="big">{data.active_7d}</div></div>
            </div>

            <h3 className="section-title" style={{ fontSize: 15 }}>Families ({data.families_list.length})</h3>
            <div className="list">
              {data.families_list.map((f, i) => (
                <div className="list-item" key={i}>
                  <span>{f.name} <small className="sub">· {f.members} member{f.members === 1 ? '' : 's'}</small></span>
                  <small className="sub">created {fmtDate(f.created_at)} · active {fmtDate(f.last_active)}</small>
                </div>
              ))}
              {data.families_list.length === 0 && <div className="sub">No families yet.</div>}
            </div>

            <h3 className="section-title" style={{ fontSize: 15 }}>Who joined ({data.members_list.length})</h3>
            <div className="list">
              {data.members_list.map((m, i) => (
                <div className="list-item" key={i}>
                  <span>{m.email} {m.role === 'owner' && <span className="badge">owner</span>}</span>
                  <small className="sub">{m.family} · {fmtDate(m.joined_at)}</small>
                </div>
              ))}
              {data.members_list.length === 0 && <div className="sub">No members yet.</div>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
