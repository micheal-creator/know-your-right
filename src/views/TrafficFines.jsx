import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import BookmarkButton from '../components/BookmarkButton.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import LastVerified from '../components/LastVerified.jsx'
import { TRAFFIC_META } from '../data/traffic.js'
import { entries, getTraffic } from '../store/contentStore.js'
import { useCollection } from '../services/useStore.js'
import { formatNaira, normalize } from '../lib/format.js'

const SEVERITIES = [
  { id: 'all', label: 'All' },
  { id: 'minor', label: 'Minor' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'serious', label: 'Serious' },
]

const SEVERITY_STYLE = {
  minor: 'bg-line text-muted',
  moderate: 'bg-warnsoft text-warn',
  serious: 'bg-red-50 text-red-700',
}

const SORTS = {
  offence: (a, b) => a.offence.localeCompare(b.offence),
  fineAsc: (a, b) => a.fine - b.fine,
  fineDesc: (a, b) => b.fine - a.fine,
  points: (a, b) => b.points - a.points,
}

export default function TrafficFines() {
  const [q, setQ] = useState('')
  const [severity, setSeverity] = useState('all')
  const [sort, setSort] = useState('offence')

  useCollection(entries)
  const all = useMemo(
    () =>
      getTraffic().map((e) => ({
        id: e.id,
        offence: e.title,
        code: e.code,
        summary: e.summary,
        fine: e.fine,
        points: e.points,
        severity: e.severity,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entries.getSnapshot()],
  )

  const rows = useMemo(() => {
    const nq = normalize(q)
    return all.filter((t) => {
      if (severity !== 'all' && t.severity !== severity) return false
      if (!nq) return true
      return normalize(`${t.offence} ${t.code} ${t.summary}`).includes(nq)
    }).sort(SORTS[sort])
  }, [all, q, severity, sort])

  return (
    <div className="space-y-5">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-accent">
        <Icon name="ArrowLeft" size={16} /> Home
      </Link>

      <header>
        <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon name="Car" size={22} />
        </div>
        <h1 className="text-[24px]">Traffic Laws &amp; Fines</h1>
        <p className="mt-1 text-muted">
          Common FRSC offences, the fine, and the penalty points added to your licence.
        </p>
      </header>

      <div
        role="note"
        className="flex items-start gap-3 rounded-xl2 border border-warnsoft bg-warnsoft/60 px-4 py-3 text-sm text-muted"
      >
        <Icon name="AlertTriangle" size={20} className="mt-0.5 shrink-0 text-warn" />
        <p>
          These figures are a guide based on FRSC’s published schedule. Fines and points are reviewed
          from time to time — always confirm the current amount with FRSC before you pay.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint">
            <Icon name="Search" size={20} />
          </span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Filter offences"
            placeholder="Filter offences… e.g. “phone”, “seat belt”"
            className="tap w-full rounded-xl2 border border-line bg-card py-3 pl-12 pr-4 text-base shadow-card placeholder:text-faint focus:border-accent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by severity">
            {SEVERITIES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSeverity(s.id)}
                aria-pressed={severity === s.id}
                className={
                  'tap rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ' +
                  (severity === s.id
                    ? 'border-accent bg-accent text-white'
                    : 'border-line bg-card text-muted hover:border-accent hover:text-accent')
                }
              >
                {s.label}
              </button>
            ))}
          </div>
          <label className="ml-auto inline-flex items-center gap-2 text-sm text-muted">
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort offences"
              className="tap rounded-xl border border-line bg-card px-3 py-2 text-sm focus:border-accent"
            >
              <option value="offence">Offence (A–Z)</option>
              <option value="fineAsc">Fine (low → high)</option>
              <option value="fineDesc">Fine (high → low)</option>
              <option value="points">Penalty points</option>
            </select>
          </label>
        </div>
      </div>

      <p className="text-sm text-muted" aria-live="polite">
        {rows.length} offence{rows.length === 1 ? '' : 's'}
      </p>

      <div className="space-y-3">
        {rows.map((t) => (
          <div key={t.id} className="card flex items-stretch overflow-hidden transition-shadow hover:shadow-lift">
            <Link to={`/entry/${t.id}`} className="flex min-w-0 flex-1 items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className={'rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ' + SEVERITY_STYLE[t.severity]}>
                    {t.severity}
                  </span>
                  <span className="text-[12px] font-semibold text-faint">{t.code}</span>
                </div>
                <h3 className="font-heading text-[17px] font-semibold text-ink">{t.offence}</h3>
                <p className="mt-0.5 line-clamp-2 text-sm text-muted">{t.summary}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-heading text-lg text-ink">{formatNaira(t.fine)}</p>
                <p className="text-[12px] text-faint">{t.points} pts</p>
              </div>
            </Link>
            <div className="flex items-center border-l border-line px-1">
              <BookmarkButton id={t.id} />
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="card p-6 text-center text-muted">No offence matches that filter.</div>
        )}
      </div>

      <LastVerified date={TRAFFIC_META.lastVerified} source={TRAFFIC_META.source} />
      <Disclaimer compact />
    </div>
  )
}
