import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { ISSUE_CATEGORIES, NIGERIAN_STATES, PRIVACY } from '../data/meta.js'
import { createCase } from '../services/cases.js'
import { cn } from '../lib/format.js'

const MAX_DESC = 300

export default function HireStart() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const [issue, setIssue] = useState(
    ISSUE_CATEGORIES.some((c) => c.id === params.get('issue')) ? params.get('issue') : '',
  )
  const [state, setState] = useState('')
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [touched, setTouched] = useState(false)

  const valid = issue && state

  function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    const created = createCase({ issue, state, description, name, contact })
    const qp = new URLSearchParams({ issue, state, case: created.id })
    if (description.trim()) qp.set('desc', description.trim())
    if (name.trim()) qp.set('name', name.trim())
    navigate(`/hire/matches?${qp.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <header>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent">Step 1 of 2</p>
        <h1 className="mt-1 section-title text-[24px]">Tell us what’s going on</h1>
        <p className="mt-1 text-muted">
          A few details so we can connect you to the right lawyer. This is a short form — not a chatbot,
          and not automated advice.
        </p>
      </header>

      {/* Issue category */}
      <fieldset className="space-y-3">
        <legend className="mb-1 font-semibold text-ink">
          What do you need help with? <span className="text-warn">*</span>
        </legend>
        <div className="grid gap-2">
          {ISSUE_CATEGORIES.map((c) => {
            const active = issue === c.id
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => setIssue(c.id)}
                aria-pressed={active}
                className={cn(
                  'tap flex items-center justify-between gap-3 rounded-xl2 border px-4 py-3 text-left transition-colors',
                  active ? 'border-accent bg-accent-soft' : 'border-line bg-card hover:border-accent',
                )}
              >
                <span>
                  <span className="block font-semibold text-ink">{c.label}</span>
                  <span className="block text-[13px] text-muted">{c.hint}</span>
                </span>
                <span
                  className={cn(
                    'grid h-5 w-5 shrink-0 place-items-center rounded-full border',
                    active ? 'border-accent bg-accent text-white' : 'border-line',
                  )}
                >
                  {active && <Icon name="ChevronRight" size={12} className="rotate-90" />}
                </span>
              </button>
            )
          })}
        </div>
        {touched && !issue && <p className="text-sm text-warn">Please pick what you need help with.</p>}
      </fieldset>

      {/* State */}
      <div className="space-y-1.5">
        <label htmlFor="state" className="block font-semibold text-ink">
          Which state are you in? <span className="text-warn">*</span>
        </label>
        <select
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="tap input"
        >
          <option value="">Select your state…</option>
          {NIGERIAN_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {touched && !state && <p className="text-sm text-warn">Please select your state.</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="desc" className="block font-semibold text-ink">
          Briefly, what happened? <span className="font-normal text-faint">(optional)</span>
        </label>
        <textarea
          id="desc"
          value={description}
          maxLength={MAX_DESC}
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="1–2 sentences. e.g. “FRSC impounded my car at a checkpoint and I’m not sure why.”"
          className="input"
        />
        <p className="text-right text-[12px] text-faint">
          {description.length}/{MAX_DESC}
        </p>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="block font-semibold text-ink">
          Your name <span className="font-normal text-faint">(optional)</span>
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="So the lawyer knows who they’re speaking to"
          className="tap input"
        />
      </div>

      {/* Contact */}
      <div className="space-y-1.5">
        <label htmlFor="contact" className="block font-semibold text-ink">
          Phone / WhatsApp <span className="font-normal text-faint">(optional)</span>
        </label>
        <input
          id="contact"
          inputMode="tel"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="e.g. 0803 000 0000 — so a lawyer can reach you"
          className="tap input"
        />
      </div>

      <button type="submit" className="btn-primary w-full">
        Find a lawyer <Icon name="ArrowRight" size={18} />
      </button>

      <p className="flex items-start gap-2 text-[13px] text-faint">
        <Icon name="ShieldCheck" size={16} className="mt-0.5 shrink-0" />
        <span>{PRIVACY}</span>
      </p>

      <Link to="/" className="block text-center text-sm font-semibold text-muted hover:text-accent">
        Cancel
      </Link>
    </form>
  )
}
