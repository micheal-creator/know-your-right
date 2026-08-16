import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { LAWYERS, initials } from '../data/lawyers.js'
import { ISSUE_CATEGORIES } from '../data/meta.js'

function issueLabel(id) {
  return ISSUE_CATEGORIES.find((c) => c.id === id)?.label || 'a legal matter'
}

function Stars({ rating }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-ink" aria-label={`${rating} out of 5`}>
      <Icon name="Star" size={14} className="fill-warn text-warn" />
      <span className="font-semibold">{rating.toFixed(1)}</span>
    </span>
  )
}

function buildMatches(issue, state) {
  const exact = LAWYERS.filter(
    (l) => (!issue || l.categories.includes(issue)) && (!state || l.states.includes(state)),
  )
  if (exact.length) return { list: exact, note: null }

  const partial = LAWYERS.filter(
    (l) => (state && l.states.includes(state)) || (issue && l.categories.includes(issue)),
  )
  if (partial.length)
    return {
      list: partial,
      note: `No exact match yet in ${state || 'your state'} for this issue — here are lawyers who match your state or your type of issue.`,
    }

  return {
    list: [...LAWYERS].sort((a, b) => b.rating - a.rating).slice(0, 3),
    note: 'No exact match yet — here are highly-rated lawyers who may be able to help or refer you.',
  }
}

function LawyerCard({ lawyer, message }) {
  const wa = `https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(message)}`
  const tel = `tel:+${lawyer.phone}`

  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent-soft font-heading text-lg font-semibold text-accent">
          {initials(lawyer.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-heading text-[18px] font-semibold text-ink">{lawyer.name}</h3>
            {lawyer.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
                <Icon name="ShieldCheck" size={12} /> Verified
              </span>
            )}
          </div>
          <p className="text-sm text-muted">
            {lawyer.firm} · {lawyer.city}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <Stars rating={lawyer.rating} />
            <span className="text-faint">({lawyer.reviews} reviews)</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted">{lawyer.bio}</p>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
        <div className="rounded-lg bg-paper px-3 py-2">
          <dt className="text-faint">Fees</dt>
          <dd className="font-semibold text-ink">{lawyer.feeRange}</dd>
        </div>
        <div className="rounded-lg bg-paper px-3 py-2">
          <dt className="text-faint">Response</dt>
          <dd className="font-semibold text-ink">{lawyer.respondsWithin}</dd>
        </div>
      </dl>

      <p className="mt-2 flex items-center gap-1.5 text-[12px] text-faint">
        <Icon name="FileText" size={13} /> Bar reference: {lawyer.barNumber}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a href={tel} className="btn-outline">
          <Icon name="Phone" size={18} /> Call
        </a>
        <a href={wa} target="_blank" rel="noreferrer" className="btn-primary">
          <Icon name="MessageCircle" size={18} /> WhatsApp
        </a>
      </div>
    </div>
  )
}

export default function HireMatches() {
  const [params] = useSearchParams()
  const issue = params.get('issue') || ''
  const state = params.get('state') || ''
  const desc = params.get('desc') || ''
  const name = params.get('name') || ''

  const { list, note } = useMemo(() => buildMatches(issue, state), [issue, state])

  const message =
    `Hello, I found you on Know Your Right. I need help with ${issueLabel(issue).toLowerCase()}` +
    (state ? ` in ${state}` : '') +
    '.' +
    (desc ? ` ${desc}` : '') +
    (name ? ` — ${name}` : '')

  return (
    <div className="space-y-5">
      <Link to="/hire" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-accent">
        <Icon name="ArrowLeft" size={16} /> Edit details
      </Link>

      <header>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent">Step 2 of 2</p>
        <h1 className="mt-1 text-[24px]">Lawyers for you</h1>
        <p className="mt-1 text-muted">
          {issueLabel(issue)}
          {state ? ` · ${state}` : ''}
        </p>
      </header>

      <div
        role="note"
        className="flex items-start gap-3 rounded-xl2 border border-line bg-accent-soft/50 px-4 py-3 text-sm text-muted"
      >
        <Icon name="Info" size={20} className="mt-0.5 shrink-0 text-accent" />
        <p>
          Sample directory for this preview. In the live app, every lawyer here is manually vetted —
          bar/licence checked — before they appear. No payment is taken before a lawyer responds.
        </p>
      </div>

      {note && <p className="text-sm text-muted">{note}</p>}

      <div className="space-y-4">
        {list.map((lawyer) => (
          <LawyerCard key={lawyer.id} lawyer={lawyer} message={message} />
        ))}
      </div>

      <p className="text-center text-[13px] text-faint">
        Can’t see the right fit? Try{' '}
        <Link to="/hire" className="link-accent">
          adjusting your details
        </Link>
        .
      </p>
    </div>
  )
}
