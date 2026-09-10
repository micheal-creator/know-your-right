import { useEffect, useState } from 'react'
import Icon from '../../components/Icon.jsx'
import { supabase, BACKEND } from '../../services/supabaseClient.js'
import { useAuth } from '../../services/auth.js'

const inputCls =
  'w-full rounded-xl border border-line bg-card px-4 py-3 text-[15px] text-ink transition focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10'

export default function AdminTeam() {
  const session = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })
  const [busy, setBusy] = useState(false)

  async function call(body) {
    const { data, error } = await supabase.functions.invoke('admin-users', { body })
    if (error) {
      // Surface a helpful hint if the function isn't deployed yet.
      throw new Error(error.message?.includes('Failed') || error.message?.includes('404')
        ? 'The admin-users function isn’t deployed yet. Run: supabase functions deploy admin-users'
        : (data?.error || error.message))
    }
    if (!data?.ok) throw new Error(data?.error || 'Request failed.')
    return data
  }

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const { users } = await call({ action: 'list' })
      setUsers(users || [])
    } catch (e) {
      setError(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (BACKEND === 'supabase') refresh()
    else setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function addAdmin(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await call({ action: 'create', email: form.email.trim(), password: form.password })
      setForm({ email: '', password: '' })
      await refresh()
    } catch (e) {
      setError(String(e.message || e))
    } finally {
      setBusy(false)
    }
  }

  async function toggle(u) {
    try {
      await call({ action: 'setAdmin', id: u.id, is_admin: !u.is_admin })
      await refresh()
    } catch (e) {
      alert(e.message || e)
    }
  }

  async function remove(u) {
    if (!confirm(`Remove ${u.email}? This deletes their account.`)) return
    try {
      await call({ action: 'remove', id: u.id })
      await refresh()
    } catch (e) {
      alert(e.message || e)
    }
  }

  if (BACKEND !== 'supabase') {
    return (
      <div className="max-w-2xl space-y-4">
        <h1 className="font-heading text-[26px] font-bold">Admins</h1>
        <div className="card p-6 text-sm text-muted">
          Managing admins requires Supabase. Connect the backend first, then this page lets you add
          and manage admin accounts.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h1 className="font-heading text-[26px] font-bold">Admins</h1>
        <p className="mt-1 text-muted">Add or remove people who can sign in and manage the app.</p>
      </header>

      {/* Add admin */}
      <form onSubmit={addAdmin} className="card space-y-4 p-6">
        <h2 className="font-heading text-[17px] font-bold">Add a new admin</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className={inputCls} type="email" required placeholder="Email address" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <input className={inputCls} type="text" required placeholder="Temporary password (6+ chars)" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
        </div>
        <button className="btn-primary" disabled={busy}>
          <Icon name="Plus" size={18} /> {busy ? 'Adding…' : 'Add admin'}
        </button>
        <p className="text-[12px] text-faint">They can sign in immediately with this email + password and should change it after first login.</p>
      </form>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* List */}
      <section className="space-y-3">
        <h2 className="font-heading text-[17px] font-bold">People with access</h2>
        {loading ? (
          <div className="card p-6 text-center text-muted">Loading…</div>
        ) : (
          users.map((u) => (
            <div key={u.id} className="card flex flex-wrap items-center gap-3 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft font-heading font-bold text-accent">
                {(u.email || '?')[0].toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">
                  {u.email} {u.id === session?.uid && <span className="text-[12px] font-normal text-faint">(you)</span>}
                </p>
                <p className="text-[12px] text-faint">{u.is_admin ? 'Admin' : 'Not an admin'}</p>
              </div>
              <button onClick={() => toggle(u)} className="btn-outline px-3 py-2 text-sm">
                {u.is_admin ? 'Revoke admin' : 'Make admin'}
              </button>
              <button onClick={() => remove(u)} className="tap grid place-items-center rounded-lg px-2 text-faint hover:text-red-600" aria-label="Remove user">
                <Icon name="Trash2" size={18} />
              </button>
            </div>
          ))
        )}
        {!loading && users.length === 0 && !error && (
          <div className="card p-6 text-center text-muted">No users yet.</div>
        )}
      </section>
    </div>
  )
}
