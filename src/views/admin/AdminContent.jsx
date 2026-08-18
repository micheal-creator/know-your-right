import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import { entries, getEntries, deleteEntry, resetEntries } from '../../store/contentStore.js'
import { useCollection } from '../../services/useStore.js'
import { typeLabel } from '../../lib/labels.js'
import { normalize, formatDate, isStale } from '../../lib/format.js'

const TYPES = [
  { id: 'all', label: 'All' },
  { id: 'constitution', label: 'Constitution' },
  { id: 'powers', label: 'Powers' },
  { id: 'traffic', label: 'Traffic' },
]

export default function AdminContent() {
  useCollection(entries)
  const [q, setQ] = useState('')
  const [type, setType] = useState('all')

  const nq = normalize(q)
  const list = getEntries().filter((e) => {
    if (type !== 'all' && e.type !== type) return false
    if (!nq) return true
    return normalize(`${e.title} ${e.reference} ${e.summary}`).includes(nq)
  })

  function onDelete(e) {
    if (confirm(`Delete “${e.title}”? This cannot be undone.`)) deleteEntry(e.id)
  }
  function onReset() {
    if (confirm('Reset all content back to the built-in defaults? Your edits will be lost.')) resetEntries()
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px]">Content</h1>
          <p className="mt-1 text-muted">Edit the Constitution, powers and traffic entries.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onReset} className="btn-outline">
            <Icon name="RefreshCw" size={16} /> Reset
          </button>
          <Link to="/admin/content/new" className="btn-primary">
            <Icon name="Plus" size={18} /> Add entry
          </Link>
        </div>
      </header>

      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint">
          <Icon name="Search" size={20} />
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search content…"
          className="tap w-full rounded-xl2 border border-line bg-card py-3 pl-12 pr-4 text-base focus:border-accent"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            aria-pressed={type === t.id}
            className={
              'tap rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ' +
              (type === t.id
                ? 'border-accent bg-accent text-white'
                : 'border-line bg-card text-muted hover:border-accent hover:text-accent')
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted">{list.length} entr{list.length === 1 ? 'y' : 'ies'}</p>

      <div className="space-y-2">
        {list.map((e) => (
          <div key={e.id} className="card flex items-center gap-3 p-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-accent">
                <Icon name={typeLabel(e.type).icon} size={13} />
                {typeLabel(e.type).label}
                {isStale(e.lastVerified) && (
                  <span className="rounded-full bg-warnsoft px-1.5 text-[10px] text-warn">stale</span>
                )}
              </div>
              <p className="truncate font-heading text-[16px] font-semibold text-ink">{e.title}</p>
              <p className="truncate text-[12px] text-faint">
                {e.reference} · verified {formatDate(e.lastVerified)}
              </p>
            </div>
            <Link to={`/admin/content/${e.id}`} className="tap grid place-items-center rounded-lg px-2 text-muted hover:text-accent" aria-label="Edit">
              <Icon name="Pencil" size={18} />
            </Link>
            <button onClick={() => onDelete(e)} className="tap grid place-items-center rounded-lg px-2 text-muted hover:text-red-700" aria-label="Delete">
              <Icon name="Trash2" size={18} />
            </button>
          </div>
        ))}
        {list.length === 0 && <div className="card p-6 text-center text-muted">No entries match.</div>}
      </div>
    </div>
  )
}
