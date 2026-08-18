import { useState } from 'react'
import Icon from '../../components/Icon.jsx'
import {
  cases,
  listCases,
  setCaseStatus,
  setCaseNote,
  removeCase,
  CASE_STATUSES,
  CASE_STATUS_LABEL,
} from '../../services/cases.js'
import { ISSUE_CATEGORIES } from '../../data/meta.js'
import { useCollection } from '../../services/useStore.js'
import { cn } from '../../lib/format.js'

function issueLabel(id) {
  return ISSUE_CATEGORIES.find((c) => c.id === id)?.label || id
}
function when(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) +
    ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const STATUS_STYLE = {
  new: 'bg-warnsoft text-warn',
  reviewing: 'bg-accent-soft text-accent',
  matched: 'bg-accent-soft text-accent',
  closed: 'bg-line text-faint',
}

export default function AdminCases() {
  useCollection(cases)
  const [filter, setFilter] = useState('all')
  const list = listCases().filter((c) => filter === 'all' || c.status === filter)

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-[24px]">Cases</h1>
        <p className="mt-1 text-muted">Hire-a-Lawyer requests submitted from the app.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {['all', ...CASE_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
            className={
              'tap rounded-full border px-3.5 py-1.5 text-sm font-semibold capitalize transition-colors ' +
              (filter === s
                ? 'border-accent bg-accent text-white'
                : 'border-line bg-card text-muted hover:border-accent hover:text-accent')
            }
          >
            {s === 'all' ? 'All' : CASE_STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((c) => (
          <div key={c.id} className="card space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize', STATUS_STYLE[c.status])}>
                    {CASE_STATUS_LABEL[c.status]}
                  </span>
                  <span className="font-heading text-[16px] font-semibold text-ink">{issueLabel(c.issue)}</span>
                </div>
                <p className="mt-0.5 text-[13px] text-faint">
                  {c.state || 'State not given'} · {when(c.createdAt)}
                </p>
              </div>
              <button
                onClick={() => confirm('Delete this case?') && removeCase(c.id)}
                className="tap grid place-items-center rounded-lg px-2 text-faint hover:text-red-700"
                aria-label="Delete case"
              >
                <Icon name="Trash2" size={18} />
              </button>
            </div>

            {(c.name || c.contact) && (
              <p className="text-sm text-ink">
                <span className="font-semibold">{c.name || 'Anonymous'}</span>
                {c.contact && <span className="text-muted"> · {c.contact}</span>}
              </p>
            )}
            {c.description && <p className="text-sm text-muted">{c.description}</p>}

            <div className="grid gap-2 sm:grid-cols-[160px_1fr]">
              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-faint">Status</span>
                <select
                  value={c.status}
                  onChange={(e) => setCaseStatus(c.id, e.target.value)}
                  className="tap w-full rounded-xl border border-line bg-card px-3 py-2 text-sm focus:border-accent"
                >
                  {CASE_STATUSES.map((s) => (
                    <option key={s} value={s}>{CASE_STATUS_LABEL[s]}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-faint">Internal note</span>
                <input
                  defaultValue={c.note}
                  onBlur={(e) => setCaseNote(c.id, e.target.value)}
                  placeholder="Add a note (saved on blur)"
                  className="tap w-full rounded-xl border border-line bg-card px-3 py-2 text-sm focus:border-accent"
                />
              </label>
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="card p-6 text-center text-muted">No cases yet.</div>}
      </div>
    </div>
  )
}
