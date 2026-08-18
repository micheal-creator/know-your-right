import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import { getLawyer, upsertLawyer, removeLawyer } from '../../services/lawyers.js'
import { ISSUE_CATEGORIES, NIGERIAN_STATES } from '../../data/meta.js'
import { cn } from '../../lib/format.js'

const inputCls = 'w-full rounded-xl2 border border-line bg-card px-4 py-3 text-base focus:border-accent'

function Field({ label, hint, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-sm font-semibold text-ink">
        {label} {hint && <span className="font-normal text-faint">{hint}</span>}
      </span>
      {children}
    </label>
  )
}

export default function AdminLawyerEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const existing = id ? getLawyer(id) : null
  const editing = !!existing

  const [f, setF] = useState(() => ({
    name: existing?.name || '',
    firm: existing?.firm || '',
    city: existing?.city || '',
    phone: existing?.phone || '',
    whatsapp: existing?.whatsapp || '',
    barNumber: existing?.barNumber || '',
    feeRange: existing?.feeRange || '',
    respondsWithin: existing?.respondsWithin || 'usually within a few hours',
    bio: existing?.bio || '',
    rating: existing?.rating ?? 0,
    reviews: existing?.reviews ?? 0,
    status: existing?.status || 'pending',
    states: existing?.states || [],
    categories: existing?.categories || [],
  }))

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }))

  function toggleCategory(cid) {
    setF((p) => ({
      ...p,
      categories: p.categories.includes(cid)
        ? p.categories.filter((x) => x !== cid)
        : [...p.categories, cid],
    }))
  }
  function onStates(e) {
    setF((p) => ({ ...p, states: Array.from(e.target.selectedOptions).map((o) => o.value) }))
  }

  function save(e) {
    e.preventDefault()
    if (!f.name.trim()) {
      alert('Name is required.')
      return
    }
    upsertLawyer({
      id: existing?.id,
      name: f.name.trim(),
      firm: f.firm.trim(),
      city: f.city.trim(),
      phone: f.phone.trim(),
      whatsapp: (f.whatsapp || f.phone).trim(),
      barNumber: f.barNumber.trim(),
      feeRange: f.feeRange.trim(),
      respondsWithin: f.respondsWithin.trim(),
      bio: f.bio.trim(),
      rating: Number(f.rating) || 0,
      reviews: Number(f.reviews) || 0,
      status: f.status,
      verified: f.status === 'approved',
      states: f.states,
      categories: f.categories,
    })
    navigate('/admin/lawyers')
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <Link to="/admin/lawyers" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-accent">
        <Icon name="ArrowLeft" size={16} /> Lawyers
      </Link>

      <h1 className="text-[24px]">{editing ? 'Edit lawyer' : 'Add lawyer'}</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name"><input value={f.name} onChange={set('name')} className={inputCls} required /></Field>
        <Field label="Firm"><input value={f.firm} onChange={set('firm')} className={inputCls} /></Field>
        <Field label="City"><input value={f.city} onChange={set('city')} className={inputCls} /></Field>
        <Field label="Bar / SCN number"><input value={f.barNumber} onChange={set('barNumber')} className={inputCls} /></Field>
        <Field label="Phone" hint="(intl, no +)"><input value={f.phone} onChange={set('phone')} className={inputCls} placeholder="2348000000000" /></Field>
        <Field label="WhatsApp" hint="(defaults to phone)"><input value={f.whatsapp} onChange={set('whatsapp')} className={inputCls} placeholder="2348000000000" /></Field>
        <Field label="Fee range"><input value={f.feeRange} onChange={set('feeRange')} className={inputCls} placeholder="From ₦15,000 consultation" /></Field>
        <Field label="Responds within"><input value={f.respondsWithin} onChange={set('respondsWithin')} className={inputCls} /></Field>
        <Field label="Rating" hint="(0–5)"><input type="number" step="0.1" min="0" max="5" value={f.rating} onChange={set('rating')} className={inputCls} /></Field>
        <Field label="Reviews"><input type="number" min="0" value={f.reviews} onChange={set('reviews')} className={inputCls} /></Field>
      </div>

      <Field label="Bio"><textarea value={f.bio} onChange={set('bio')} rows={3} className={inputCls} /></Field>

      <Field label="Status">
        <select value={f.status} onChange={set('status')} className={inputCls}>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="suspended">suspended</option>
        </select>
      </Field>

      <div>
        <p className="mb-1.5 text-sm font-semibold text-ink">Practice areas</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ISSUE_CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => toggleCategory(c.id)}
              aria-pressed={f.categories.includes(c.id)}
              className={cn(
                'tap rounded-xl border px-3 py-2 text-left text-[13px] font-medium transition-colors',
                f.categories.includes(c.id)
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-line bg-card text-muted hover:border-accent',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <Field label="States covered" hint="(Ctrl/Cmd-click to select several)">
        <select multiple value={f.states} onChange={onStates} className={inputCls + ' h-40'}>
          {NIGERIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>

      <div className="flex items-center gap-2 pt-2">
        <button type="submit" className="btn-primary">
          <Icon name="Save" size={18} /> {editing ? 'Save changes' : 'Add lawyer'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => confirm(`Remove ${existing.name}?`) && (removeLawyer(existing.id), navigate('/admin/lawyers'))}
            className="btn-outline text-red-700 hover:border-red-300"
          >
            <Icon name="Trash2" size={18} /> Remove
          </button>
        )}
      </div>
    </form>
  )
}
