import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import { signIn } from '../../services/auth.js'
import { BACKEND } from '../../services/supabaseClient.js'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const r = await signIn(email.trim(), password)
    setBusy(false)
    if (!r.ok) setError(r.error || 'Sign in failed.')
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-accent text-white">
            <Icon name="Scale" size={24} strokeWidth={2} />
          </span>
          <h1 className="text-[22px]">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">Know Your Right console</p>
        </div>

        <form onSubmit={submit} className="card space-y-3 p-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-semibold text-ink">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="tap input"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-semibold text-ink">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="tap input"
            />
          </div>

          {error && <p className="text-sm font-semibold text-red-700">{error}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {BACKEND === 'demo' && (
          <div className="mt-4 flex items-start gap-2 rounded-xl2 border border-warnsoft bg-warnsoft/60 px-4 py-3 text-[13px] text-muted">
            <Icon name="Info" size={16} className="mt-0.5 shrink-0 text-warn" />
            <p>
              <strong>Demo mode:</strong> no backend is connected, so any email + password signs you
              in as an admin and all data stays in this browser. Connect Supabase to enforce real
              admin access.
            </p>
          </div>
        )}

        <Link to="/" className="mt-4 block text-center text-sm font-semibold text-muted hover:text-accent">
          ← Back to the app
        </Link>
      </div>
    </div>
  )
}
