import { Link } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import { entries } from '../../store/contentStore.js'
import { lawyers } from '../../services/lawyers.js'
import { cases } from '../../services/cases.js'
import { conversations } from '../../services/support.js'
import { useCollection } from '../../services/useStore.js'
import { BACKEND } from '../../services/supabaseClient.js'

function Stat({ icon, label, value, to, tone }) {
  return (
    <Link to={to} className="card block p-4 transition-shadow hover:shadow-lift">
      <span
        className={
          'grid h-10 w-10 place-items-center rounded-xl ' +
          (tone === 'warn' ? 'bg-warnsoft text-warn' : 'bg-accent-soft text-accent')
        }
      >
        <Icon name={icon} size={20} />
      </span>
      <p className="mt-3 font-heading text-2xl text-ink">{value}</p>
      <p className="text-[13px] text-muted">{label}</p>
    </Link>
  )
}

export default function AdminDashboard() {
  useCollection(entries)
  useCollection(lawyers)
  useCollection(cases)
  useCollection(conversations)

  const entriesCount = entries.all().length
  const pending = lawyers.all().filter((l) => l.status === 'pending').length
  const newCases = cases.all().filter((c) => c.status === 'new').length
  const openChats = conversations.all().filter((c) => c.status === 'open').length

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[24px]">Dashboard</h1>
        <p className="mt-1 text-muted">Manage content, lawyers, cases and support conversations.</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon="FileText" label="Content entries" value={entriesCount} to="/admin/content" />
        <Stat icon="Users" label="Lawyers awaiting review" value={pending} to="/admin/lawyers" tone={pending ? 'warn' : undefined} />
        <Stat icon="Inbox" label="New cases" value={newCases} to="/admin/cases" tone={newCases ? 'warn' : undefined} />
        <Stat icon="MessageSquare" label="Open conversations" value={openChats} to="/admin/support" tone={openChats ? 'warn' : undefined} />
      </div>

      {BACKEND === 'demo' && (
        <div className="flex items-start gap-3 rounded-xl2 border border-warnsoft bg-warnsoft/60 px-4 py-3 text-sm text-muted">
          <Icon name="Info" size={20} className="mt-0.5 shrink-0 text-warn" />
          <p>
            Running in <strong>demo mode</strong> — everything you change here is saved only in this
            browser. Connect Supabase (see <code>supabase/schema.sql</code>) to make it a real,
            multi-user backend with secure admin access and cross-device support chat.
          </p>
        </div>
      )}
    </div>
  )
}
