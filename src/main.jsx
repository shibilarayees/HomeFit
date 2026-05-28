import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register the service worker for offline use & installability (PWA).
// Only in production builds — in dev, caching Vite's module graph causes
// stale-module / "two copies of React" errors. Unregister any dev SW.
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => console.warn('SW registration failed', err))
    })
  } else {
    navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()))
    if (window.caches) caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)))
  }
}
