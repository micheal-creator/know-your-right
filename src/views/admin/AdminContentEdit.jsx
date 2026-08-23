import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import { getEntry, upsertEntry, deleteEntry } from '../../store/contentStore.js'
import { uid, today } from '../../services/local.js'

const TYPES = ['constitution', 'powers', 'traffic']
const SEVERITIES = ['minor', 'moderate', 'serious']

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

const inputCls =
  'w-full rounded-xl2 border border-line bg-card px-4 py-3 text-base focus:border-accent'

export default function AdminContentEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const existing = id ? getEntry(id) : null
  const editing = !!existing

  const [f, setF] = useState(() => ({
    type: existing?.type || 'constitution',
    title: existing?.title || '',
    reference: existing?.reference || '',
    summary: existing?.summary || '',
    original: existing?.original || '',
    tags: (existing?.tags || []).join(', '),
    lastVerified: existing?.lastVerified || today(),
    source: existing?.source || '',
    fine: existing?.fine ?? '',
    points: existing?.points ?? '',
    code: existing?.code || '',
    severity: existing?.severity || 'minor',
  }))

  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }))
  const isTraffic = f.type === 'traffic'

  function save(e) {
    e.preventDefault()
    if (!f.title.trim() || !f.summary.trim()) {
      alert('Title and plain-language summary are required.')
      return
    }
    const record = {
      id: existing?.id || uid('ent'),
      type: f.type,
      category: f.type,
      title: f.title.trim(),
      reference: f.reference.trim(),
      summary: f.summary.trim(),
      original: f.original.trim() || null,
      tags: f.tags.split(',').map((t) => t.trim()).filter(Boolean),
      lastVerified: f.lastVerified || today(),
      source: f.source.trim(),
    }
    if (isTraffic) {
      record.fine = Number(f.fine) || 0
      record.points = Number(f.points) || 0
      record.code = f.code.trim()
      record.severity = f.severity
    }
    upsertEntry(record)
    navigate('/admin/content')
  }

  function onDelete() {
    if (existing && confirm(`Delete “${existing.title}”?`)) {
      deleteEntry(existing.id)
      navigate('/admin/content')
    }
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <Link to="/admin/content" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-accent">
        <Icon name="ArrowLeft" size={16} /> Content
      </Link>

      <h1 className="text-[24px]">{editing ? 'Edit entry' : 'New entry'}</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type">
          <select value={f.type} onChange={set('type')} className={inputCls}>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Reference" hint="(e.g. Section 35)">
          <input value={f.reference} onChange={set('reference')} className={inputCls} />
        </Field>
      </div>

      <Field label="Title">
        <input value={f.title} onChange={set('title')} className={inputCls} required />
      </Field>

      <Field label="Plain-language summary">
        <textarea value={f.summary} onChange={set('summary')} rows={4} className={inputCls} required />
      </Field>

      <Field label="Original wording" hint="(optional)">
        <textarea value={f.original} onChange={set('original')} rows={3} className={inputCls} />
      </Field>

      {isTraffic && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Fine (₦)">
            <input type="number" value={f.fine} onChange={set('fine')} className={inputCls} />
          </Field>
          <Field label="Points">
            <input type="number" value={f.points} onChange={set('points')} className={inputCls} />
          </Field>
          <Field label="FRSC code">
            <input value={f.code} onChange={set('code')} className={inputCls} />
          </Field>
          <Field label="Severity">
            <select value={f.severity} onChange={set('severity')} className={inputCls}>
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
      )}

      <Field label="Tags" hint="(comma separated)">
        <input value={f.tags} onChange={set('tags')} className={inputCls} placeholder="arrest, police, bail" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Last verified">
          <input type="date" value={f.lastVerified} onChange={set('lastVerified')} className={inputCls} />
        </Field>
        <Field label="Source">
          <input value={f.source} onChange={set('source')} className={inputCls} />
        </Field>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button type="submit" className="btn-primary">
          <Icon name="Save" size={18} /> {editing ? 'Save changes' : 'Create entry'}
        </button>
        {editing && (
          <button type="button" onClick={onDelete} className="btn-outline text-red-700 hover:border-red-300">
            <Icon name="Trash2" size={18} /> Delete
          </button>
        )}
      </div>
    </form>
  )
}
