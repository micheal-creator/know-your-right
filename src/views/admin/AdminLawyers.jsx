import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import { lawyers, allLawyers, setLawyerStatus, removeLawyer } from '../../services/lawyers.js'
import { initials } from '../../data/lawyers.js'
import { useCollection } from '../../services/useStore.js'
import { ISSUE_CATEGORIES } from '../../data/meta.js'
import { cn } from '../../lib/format.js'

const FILTERS = ['all', 'approved', 'pending', 'suspended']

const STATUS_STYLE = {
  approved: 'bg-accent-soft text-accent',
  pending: 'bg-warnsoft text-warn',
  suspended: 'bg-red-50 text-red-700',
}

function catLabel(id) {
  return ISSUE_CATEGORIES.find((c) => c.id === id)?.label || id
}

export default function AdminLawyers() {
  useCollection(lawyers)
  const [filter, setFilter] = useState('all')
  const all = allLawyers()
  const list = all.filter((l) => filter === 'all' || l.status === filter)

  const counts = {
    all: all.length,
    approved: all.filter((l) => l.status === 'approved').length,
    pending: all.filter((l) => l.status === 'pending').length,
    suspended: all.filter((l) => l.status === 'suspended').length,
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-[26px] font-bold">Lawyers</h1>
          <p className="mt-1 text-muted">Approve, edit and manage the directory shown to users.</p>
        </div>
        <Link to="/admin/lawyers/new" className="btn-primary">
          <Icon name="Plus" size={18} /> Add lawyer
        </Link>
      </header>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={
              'tap rounded-full border px-3.5 py-1.5 text-sm font-semibold capitalize transition-colors ' +
              (filter === f
                ? 'border-accent bg-accent text-white'
                : 'border-line bg-card text-muted hover:border-accent hover:text-accent')
            }
          >
            {f} <span className={filter === f ? 'text-white/70' : 'text-faint'}>· {counts[f]}</span>
          </button>
        ))}
      </div>

      {/* GRID of lawyer cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((l) => (
          <div key={l.id} className="card flex flex-col p-5">
            <div className="flex items-start justify-between">
              <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide', STATUS_STYLE[l.status])}>
                {l.status}
              </span>
              <button
                onClick={() => confirm(`Remove ${l.name}?`) && removeLawyer(l.id)}
                aria-label="Remove lawyer"
                className="tap grid place-items-center rounded-lg text-faint hover:text-red-600"
              >
                <Icon name="Trash2" size={16} />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent-soft font-heading text-lg font-bold text-accent">
                {initials(l.name)}
              </span>
              <div className="min-w-0">
                <h3 className="truncate font-heading text-[17px] font-bold text-ink">{l.name}</h3>
                <p className="truncate text-[13px] text-muted">{l.firm || '—'} · {l.city || '—'}</p>
                {l.rating ? (
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[12px] text-ink">
                    <Icon name="Star" size={12} className="fill-amber-400 text-amber-400" /> {l.rating} <span className="text-faint">({l.reviews || 0})</span>
                  </p>
                ) : null}
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-4 text-[13px]">
              <div>
                <dt className="text-faint">States</dt>
                <dd className="truncate font-semibold text-ink">{(l.states || []).slice(0, 2).join(', ') || '—'}{(l.states || []).length > 2 ? ` +${l.states.length - 2}` : ''}</dd>
              </div>
              <div>
                <dt className="text-faint">Fees</dt>
                <dd className="truncate font-semibold text-ink">{l.feeRange || '—'}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-faint">Practice areas</dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {(l.categories || []).slice(0, 3).map((c) => (
                    <span key={c} className="rounded-full bg-cloud px-2 py-0.5 text-[11px] font-medium text-muted">{catLabel(c)}</span>
                  ))}
                  {(l.categories || []).length === 0 && <span className="text-faint">—</span>}
                </dd>
              </div>
            </dl>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link to={`/admin/lawyers/${l.id}`} className="btn-outline px-3 py-2 text-sm">
                <Icon name="Pencil" size={15} /> Edit
              </Link>
              {l.status === 'approved' ? (
                <button onClick={() => setLawyerStatus(l.id, 'suspended')} className="btn px-3 py-2 text-sm bg-warnsoft text-warn hover:bg-warn hover:text-white">
                  Suspend
                </button>
              ) : (
                <button onClick={() => setLawyerStatus(l.id, 'approved')} className="btn-primary px-3 py-2 text-sm">
                  <Icon name="CheckCircle2" size={15} /> Approve
                </button>
              )}
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="card col-span-full p-10 text-center text-muted">No lawyers in this view.</div>}
      </div>
    </div>
  )
}
