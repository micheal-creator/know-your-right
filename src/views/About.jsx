import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'
import { ABOUT, APP, PRIVACY } from '../data/meta.js'

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-heading text-[17px] font-semibold text-ink">{title}</h2>
      <p className="mt-1 text-[15px] leading-relaxed text-muted">{children}</p>
    </section>
  )
}

export default function About() {
  return (
    <div className="space-y-6">
      <ScreenHeader icon="Scale" title={`About ${APP.name}`} subtitle={APP.tagline} />

      <Disclaimer />

      <Section title="What it is">{ABOUT.what}</Section>
      <Section title="What it is not">{ABOUT.notWhat}</Section>
      <Section title="Where the content comes from">{ABOUT.sources}</Section>

      <section>
        <h2 className="font-heading text-[17px] font-semibold text-ink">Your privacy</h2>
        <p className="mt-1 flex items-start gap-2 text-[15px] leading-relaxed text-muted">
          <Icon name="ShieldCheck" size={18} className="mt-0.5 shrink-0 text-accent" />
          <span>{PRIVACY}</span>
        </p>
      </section>

      <section>
        <h2 className="font-heading text-[17px] font-semibold text-ink">Keeping content current</h2>
        <p className="mt-1 flex items-start gap-2 text-[15px] leading-relaxed text-muted">
          <Icon name="Clock" size={18} className="mt-0.5 shrink-0 text-accent" />
          <span>
            Every entry shows a “last verified” date. Anything older than six months is flagged for
            re-check, because laws and fines change.
          </span>
        </p>
      </section>

      <div className="card p-5">
        <p className="font-heading text-[17px] font-semibold">Need a real lawyer?</p>
        <p className="mt-1 text-sm text-muted">Connect to a vetted lawyer in your state.</p>
        <Link to="/hire" className="btn-primary mt-4 w-full">
          <Icon name="Gavel" size={18} /> Hire a lawyer
        </Link>
      </div>

      <p className="pt-2 text-center text-[13px]">
        <Link to="/support" className="link-accent">Contact support</Link>
        <span className="text-faint"> · </span>
        <Link to="/admin" className="link-accent">Admin console</Link>
      </p>
      <p className="text-center text-[12px] text-faint">
        {APP.name} · v{__APP_VERSION__} · Works offline once loaded.
      </p>
    </div>
  )
}
