import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import BookmarkButton from '../components/BookmarkButton.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import LastVerified from '../components/LastVerified.jsx'
import { getEntry } from '../data/index.js'
import { typeLabel } from '../lib/labels.js'
import { formatNaira } from '../lib/format.js'

// Prefill the Hire form's issue type based on the kind of entry.
const ISSUE_FOR_TYPE = { traffic: 'traffic', constitution: 'police-rights', powers: 'general' }

export default function Entry() {
  const { id } = useParams()
  const navigate = useNavigate()
  const entry = getEntry(id)
  const [showOriginal, setShowOriginal] = useState(false)

  if (!entry) {
    return (
      <div className="card p-8 text-center">
        <p className="font-heading text-lg">Entry not found.</p>
        <Link to="/" className="link-accent mt-3 inline-block">
          Back to home
        </Link>
      </div>
    )
  }

  const t = typeLabel(entry.type)
  const issue = ISSUE_FOR_TYPE[entry.type] || 'general'
  const isTraffic = entry.type === 'traffic'

  const stats = isTraffic
    ? [
        { label: 'Fine', value: formatNaira(entry.fine) },
        { label: 'Points', value: entry.points },
        { label: 'FRSC code', value: entry.code },
      ]
    : []

  return (
    <article className="space-y-6">
      <button type="button" onClick={() => navigate(-1)} className="backlink">
        <Icon name="ArrowLeft" size={16} /> Back
      </button>

      <header>
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
          <Icon name={t.icon} size={13} />
          <span>{t.label}</span>
          {entry.reference && (
            <span className="font-medium normal-case tracking-normal text-faint">· {entry.reference}</span>
          )}
        </div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-heading text-[27px] font-bold leading-tight tracking-tight">{entry.title}</h1>
          <div className="mt-1 shrink-0">
            <BookmarkButton id={entry.id} size={24} withLabel />
          </div>
        </div>
      </header>

      {isTraffic && (
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="card p-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">{s.label}</p>
              <p className="mt-0.5 font-heading text-[19px] font-bold text-ink">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <section className="space-y-2">
        <p className="eyebrow">In plain language</p>
        <p className="text-[17px] leading-relaxed text-ink">{entry.summary}</p>
      </section>

      {entry.original && (
        <section>
          <button
            type="button"
            onClick={() => setShowOriginal((v) => !v)}
            aria-expanded={showOriginal}
            className="btn-outline w-full justify-between"
          >
            <span className="inline-flex items-center gap-2">
              <Icon name="BookOpen" size={18} />
              {showOriginal ? 'Hide original wording' : 'Show original wording'}
            </span>
            <Icon
              name="ChevronRight"
              size={18}
              className={showOriginal ? 'rotate-90 transition-transform' : 'transition-transform'}
            />
          </button>
          {showOriginal && (
            <blockquote className="mt-3 rounded-2xl border-l-4 border-accent bg-accent-soft/50 px-4 py-3 font-heading text-[15px] italic leading-relaxed text-ink">
              {entry.original}
            </blockquote>
          )}
        </section>
      )}

      <LastVerified date={entry.lastVerified} source={entry.source} />

      <div className="card p-5">
        <p className="font-heading text-[17px] font-semibold">Talk to a lawyer about this</p>
        <p className="mt-1 text-sm text-muted">
          General information can only go so far. For your specific situation, connect to a vetted lawyer.
        </p>
        <Link to={`/hire?issue=${issue}`} className="btn-primary mt-4 w-full">
          <Icon name="Gavel" size={18} /> Hire a lawyer
        </Link>
      </div>

      <Disclaimer compact />
    </article>
  )
}
