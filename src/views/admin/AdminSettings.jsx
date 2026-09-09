import { useState } from 'react'
import Icon from '../../components/Icon.jsx'
import { useSettings, setSettings, THEMES } from '../../services/settings.js'
import { BACKEND } from '../../services/supabaseClient.js'

const inputCls =
  'w-full rounded-xl border border-line bg-card px-4 py-3 text-[15px] text-ink transition focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10'

function Field({ label, hint, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[13px] font-semibold text-ink">{label} {hint && <span className="font-normal text-faint">{hint}</span>}</span>
      {children}
    </label>
  )
}

export default function AdminSettings() {
  const settings = useSettings()
  const [draft, setDraft] = useState(settings)
  const [saved, setSaved] = useState(false)

  const set = (k) => (e) => { setDraft((d) => ({ ...d, [k]: e.target.value })); setSaved(false) }

  function pickTheme(id) {
    setDraft((d) => ({ ...d, theme: id }))
    setSettings({ theme: id }) // apply + persist immediately for a live preview
  }

  function save() {
    setSettings(draft)
    setSaved(true)
  }

  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <h1 className="font-heading text-[26px] font-bold">Website settings</h1>
        <p className="mt-1 text-muted">Change the site’s information and design. Updates apply across the app.</p>
      </header>

      {/* Design */}
      <section className="card p-6">
        <h2 className="font-heading text-[18px] font-bold">Design theme</h2>
        <p className="mt-1 text-sm text-muted">Pick the accent colour used across buttons, links and the app header.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.entries(THEMES).map(([id, t]) => {
            const active = draft.theme === id
            return (
              <button
                key={id}
                onClick={() => pickTheme(id)}
                className={
                  'flex items-center gap-3 rounded-xl border p-3 text-left transition-all ' +
                  (active ? 'border-accent ring-2 ring-accent' : 'border-line hover:border-accent')
                }
              >
                <span className="h-8 w-8 shrink-0 rounded-lg" style={{ background: `rgb(${t.rgb})` }} />
                <span className="text-[14px] font-semibold">{t.label}</span>
                {active && <Icon name="CheckCircle2" size={16} className="ml-auto text-accent" />}
              </button>
            )
          })}
        </div>
      </section>

      {/* Site information */}
      <section className="card space-y-4 p-6">
        <h2 className="font-heading text-[18px] font-bold">Site information</h2>
        <Field label="App name"><input className={inputCls} value={draft.name || ''} onChange={set('name')} /></Field>
        <Field label="Tagline"><input className={inputCls} value={draft.tagline || ''} onChange={set('tagline')} /></Field>
        <Field label="Home blurb"><textarea rows={3} className={`${inputCls} resize-y`} value={draft.blurb || ''} onChange={set('blurb')} /></Field>
        <Field label="Disclaimer"><textarea rows={3} className={`${inputCls} resize-y`} value={draft.disclaimer || ''} onChange={set('disclaimer')} /></Field>
        <Field label="Support email"><input className={inputCls} value={draft.supportEmail || ''} onChange={set('supportEmail')} /></Field>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={save} className="btn-primary"><Icon name="Save" size={18} /> Save changes</button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Icon name="CheckCircle2" size={16} /> {BACKEND === 'demo' ? 'Saved (this browser)' : 'Saved to Supabase'}
            </span>
          )}
        </div>
      </section>

      {BACKEND === 'demo' && (
        <p className="text-[13px] text-faint">
          Demo mode: settings are stored in this browser. Connect Supabase to make them permanent and global.
        </p>
      )}
    </div>
  )
}
