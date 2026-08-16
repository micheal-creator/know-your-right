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
      <div className="card p-6 text-center">
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

  return (
    <article className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="tap inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-accent"
      >
        <Icon name="ArrowLeft" size={16} /> Back
      </button>

      <header>
        <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-accent">
          <Icon name={t.icon} size={14} />
          <span>{t.label}</span>
          {entry.reference && (
            <span className="font-normal normal-case tracking-normal text-faint">· {entry.reference}</span>
          )}
        </div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-[26px] leading-tight">{entry.title}</h1>
          <div className="mt-1 shrink-0">
            <BookmarkButton id={entry.id} size={24} withLabel />
          </div>
        </div>
      </header>

      {isTraffic && (
        <div className="flex flex-wrap gap-3">
          <div className="card px-4 py-3">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-faint">Fine</p>
            <p className="font-heading text-xl text-ink">{formatNaira(entry.fine)}</p>
          </div>
          <div className="card px-4 py-3">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-faint">Penalty points</p>
            <p className="font-heading text-xl text-ink">{entry.points}</p>
          </div>
          <div className="card px-4 py-3">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-faint">FRSC code</p>
            <p className="font-heading text-xl text-ink">{entry.code}</p>
          </div>
        </div>
      )}

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-faint">In plain language</h2>
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
            <Icon name={showOriginal ? 'ChevronRight' : 'ChevronRight'} size={18} className={showOriginal ? 'rotate-90 transition-transform' : 'transition-transform'} />
          </button>
          {showOriginal && (
            <blockquote className="mt-3 rounded-xl2 border-l-4 border-accent bg-accent-soft/50 px-4 py-3 font-heading text-[15px] italic leading-relaxed text-ink">
              {entry.original}
            </blockquote>
          )}
        </section>
      )}

      <LastVerified date={entry.lastVerified} source={entry.source} />

      <div className="rounded-xl2 border border-line bg-card p-4">
        <p className="font-heading text-[17px] font-semibold">Talk to a lawyer about this</p>
        <p className="mt-1 text-sm text-muted">
          General information can only go so far. For your specific situation, connect to a vetted lawyer.
        </p>
        <Link to={`/hire?issue=${issue}`} className="btn-primary mt-3 w-full">
          <Icon name="Gavel" size={18} /> Hire a lawyer
        </Link>
      </div>

      <Disclaimer compact />
    </article>
  )
}
