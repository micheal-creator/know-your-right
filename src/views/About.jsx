import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import { ABOUT, APP, PRIVACY } from '../data/meta.js'

function Section({ title, children }) {
  return (
    <section className="space-y-1.5">
      <h2 className="text-lg">{title}</h2>
      <p className="text-[15px] leading-relaxed text-muted">{children}</p>
    </section>
  )
}

export default function About() {
  return (
    <div className="space-y-6">
      <header>
        <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white">
          <Icon name="Scale" size={22} strokeWidth={2} />
        </div>
        <h1 className="text-[24px]">About {APP.name}</h1>
        <p className="mt-1 text-muted">{APP.tagline}</p>
      </header>

      <Disclaimer />

      <Section title="What it is">{ABOUT.what}</Section>
      <Section title="What it is not">{ABOUT.notWhat}</Section>
      <Section title="Where the content comes from">{ABOUT.sources}</Section>

      <section className="space-y-1.5">
        <h2 className="text-lg">Your privacy</h2>
        <p className="flex items-start gap-2 text-[15px] leading-relaxed text-muted">
          <Icon name="ShieldCheck" size={18} className="mt-0.5 shrink-0 text-accent" />
          <span>{PRIVACY}</span>
        </p>
      </section>

      <section className="space-y-1.5">
        <h2 className="text-lg">Keeping content current</h2>
        <p className="flex items-start gap-2 text-[15px] leading-relaxed text-muted">
          <Icon name="Clock" size={18} className="mt-0.5 shrink-0 text-accent" />
          <span>
            Every entry shows a “last verified” date. Anything older than six months is flagged for
            re-check, because laws and fines change.
          </span>
        </p>
      </section>

      <div className="rounded-xl2 border border-line bg-card p-4">
        <p className="font-heading text-[17px] font-semibold">Need a real lawyer?</p>
        <p className="mt-1 text-sm text-muted">Connect to a vetted lawyer in your state.</p>
        <Link to="/hire" className="btn-primary mt-3 w-full">
          <Icon name="Gavel" size={18} /> Hire a lawyer
        </Link>
      </div>

      <p className="pt-2 text-center text-[12px] text-faint">
        {APP.name} · v{__APP_VERSION__} · Works offline once loaded.
      </p>
    </div>
  )
}
