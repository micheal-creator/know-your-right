import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import { lawyers, allLawyers, setLawyerStatus, removeLawyer } from '../../services/lawyers.js'
import { initials } from '../../data/lawyers.js'
import { useCollection } from '../../services/useStore.js'
import { cn } from '../../lib/format.js'

const FILTERS = ['all', 'pending', 'approved', 'suspended']

const STATUS_STYLE = {
  approved: 'bg-accent-soft text-accent',
  pending: 'bg-warnsoft text-warn',
  suspended: 'bg-red-50 text-red-700',
}

export default function AdminLawyers() {
  useCollection(lawyers)
  const [filter, setFilter] = useState('all')

  const list = allLawyers().filter((l) => filter === 'all' || l.status === filter)

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px]">Lawyers</h1>
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
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((l) => (
          <div key={l.id} className="card p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft font-heading font-semibold text-accent">
                {initials(l.name)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-[17px] font-semibold text-ink">{l.name}</h3>
                  <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize', STATUS_STYLE[l.status])}>
                    {l.status}
                  </span>
                </div>
                <p className="text-sm text-muted">{l.firm} · {l.city}</p>
                <p className="mt-0.5 text-[12px] text-faint">{(l.states || []).join(', ')}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {l.status !== 'approved' && (
                <button onClick={() => setLawyerStatus(l.id, 'approved')} className="btn-outline px-3 py-2 text-sm">
                  <Icon name="CheckCircle2" size={16} /> Approve
                </button>
              )}
              {l.status !== 'suspended' && (
                <button onClick={() => setLawyerStatus(l.id, 'suspended')} className="btn-outline px-3 py-2 text-sm">
                  Suspend
                </button>
              )}
              <Link to={`/admin/lawyers/${l.id}`} className="btn-outline px-3 py-2 text-sm">
                <Icon name="Pencil" size={16} /> Edit
              </Link>
              <button
                onClick={() => confirm(`Remove ${l.name}?`) && removeLawyer(l.id)}
                className="btn-outline px-3 py-2 text-sm text-red-700 hover:border-red-300"
              >
                <Icon name="Trash2" size={16} /> Remove
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="card p-6 text-center text-muted">No lawyers here.</div>}
      </div>
    </div>
  )
}
