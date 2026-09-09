import { Link } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import { entries } from '../../store/contentStore.js'
import { lawyers } from '../../services/lawyers.js'
import { cases } from '../../services/cases.js'
import { conversations } from '../../services/support.js'
import { useCollection } from '../../services/useStore.js'
import { useSettings } from '../../services/settings.js'
import { BACKEND } from '../../services/supabaseClient.js'

function Stat({ icon, label, value, to, tone }) {
  return (
    <Link to={to} className="card block p-5 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <span className={'grid h-11 w-11 place-items-center rounded-xl ' + (tone === 'warn' ? 'bg-warnsoft text-warn' : 'bg-accent-soft text-accent')}>
          <Icon name={icon} size={22} />
        </span>
        <Icon name="ChevronRight" size={18} className="text-faint" />
      </div>
      <p className="mt-4 font-heading text-[30px] font-extrabold leading-none text-ink">{value}</p>
      <p className="mt-1.5 text-[13px] text-muted">{label}</p>
    </Link>
  )
}

export default function AdminDashboard() {
  useCollection(entries)
  useCollection(lawyers)
  useCollection(cases)
  useCollection(conversations)
  const settings = useSettings()

  const entriesCount = entries.all().length
  const approved = lawyers.all().filter((l) => l.status === 'approved').length
  const pending = lawyers.all().filter((l) => l.status === 'pending').length
  const newCases = cases.all().filter((c) => c.status === 'new').length
  const openChats = conversations.all().filter((c) => c.status === 'open').length

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent">{settings.name}</p>
        <h1 className="mt-1 font-heading text-[28px] font-bold">Dashboard</h1>
        <p className="mt-1 text-muted">Manage content, lawyers, cases, support and the website design.</p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <Stat icon="FileText" label="Content entries" value={entriesCount} to="/admin/content" />
        <Stat icon="Users" label="Approved lawyers" value={approved} to="/admin/lawyers" />
        <Stat icon="Users" label="Awaiting review" value={pending} to="/admin/lawyers" tone={pending ? 'warn' : undefined} />
        <Stat icon="Inbox" label="New cases" value={newCases} to="/admin/cases" tone={newCases ? 'warn' : undefined} />
        <Stat icon="MessageSquare" label="Open chats" value={openChats} to="/admin/support" tone={openChats ? 'warn' : undefined} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/admin/lawyers" className="card flex items-center gap-4 p-5 hover:-translate-y-0.5 transition-transform">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent"><Icon name="Users" size={24} /></span>
          <div><p className="font-heading text-[17px] font-bold">Manage lawyers</p><p className="text-[13px] text-muted">Approve, edit and organise the directory grid.</p></div>
        </Link>
        <Link to="/admin/settings" className="card flex items-center gap-4 p-5 hover:-translate-y-0.5 transition-transform">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent"><Icon name="Settings" size={24} /></span>
          <div><p className="font-heading text-[17px] font-bold">Website settings</p><p className="text-[13px] text-muted">Change site information and the design theme.</p></div>
        </Link>
      </div>

      {BACKEND === 'demo' && (
        <div className="flex items-start gap-3 rounded-xl2 border border-warnsoft bg-warnsoft/60 px-4 py-3 text-sm text-muted">
          <Icon name="Info" size={20} className="mt-0.5 shrink-0 text-warn" />
          <p>
            Running in <strong>demo mode</strong> — changes are saved only in this browser. Connect
            Supabase (add the project keys) to make every edit permanent and shared across devices.
          </p>
        </div>
      )}
    </div>
  )
}
