import { useRef, useState } from 'react'

export default function DataBackup({ store }) {
  const fileRef = useRef(null)
  const [msg, setMsg] = useState(null)

  function download() {
    const blob = new Blob([store.exportData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `homefit-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setMsg({ ok: true, text: 'Backup downloaded.' })
  }

  function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (!confirm('Importing will REPLACE all current HomeFit data on this device. Continue?')) {
        e.target.value = ''
        return
      }
      const res = store.importData(String(reader.result))
      setMsg(res.ok ? { ok: true, text: 'Backup restored.' } : { ok: false, text: res.error })
      e.target.value = ''
    }
    reader.readAsText(file)
  }

  return (
    <div className="card backup" style={{ marginTop: 18 }}>
      <h3>💾 Backup &amp; restore</h3>
      <div className="sub" style={{ marginBottom: 10 }}>
        Your data lives only on this device. Export a file to keep it safe or move it to another
        phone/browser, then import it there.
      </div>
      <div className="row">
        <button className="btn" onClick={download}>⬇️ Export backup</button>
        <button className="btn secondary" onClick={() => fileRef.current?.click()}>⬆️ Import backup</button>
        <input ref={fileRef} className="hidden-file" type="file" accept="application/json,.json" onChange={onFile} />
      </div>
      {msg && (
        <div className="sub" style={{ marginTop: 10, color: msg.ok ? 'var(--green)' : 'var(--red)' }}>
          {msg.ok ? '✅ ' : '⚠️ '}{msg.text}
        </div>
      )}
    </div>
  )
}
