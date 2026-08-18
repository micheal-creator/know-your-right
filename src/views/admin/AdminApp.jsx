import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import { useAuth, signOut } from '../../services/auth.js'
import { BACKEND } from '../../services/supabaseClient.js'
import AdminLogin from './AdminLogin.jsx'
import { cn } from '../../lib/format.js'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'LayoutDashboard', end: true },
  { to: '/admin/content', label: 'Content', icon: 'FileText' },
  { to: '/admin/lawyers', label: 'Lawyers', icon: 'Users' },
  { to: '/admin/cases', label: 'Cases', icon: 'Inbox' },
  { to: '/admin/support', label: 'Support', icon: 'MessageSquare' },
]

export default function AdminApp() {
  const session = useAuth()
  const navigate = useNavigate()

  if (!session?.isAdmin) return <AdminLogin />

  async function handleSignOut() {
    await signOut()
    navigate('/admin')
  }

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
        <div className="container-app flex h-14 items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-white">
              <Icon name="Scale" size={18} strokeWidth={2} />
            </span>
            <span className="font-heading text-[15px] font-bold leading-none">
              Admin
              <span className="block text-[11px] font-normal text-faint">Know Your Right</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                BACKEND === 'demo' ? 'bg-warnsoft text-warn' : 'bg-accent-soft text-accent',
              )}
              title={BACKEND === 'demo' ? 'No backend connected — data is local to this browser' : 'Connected to Supabase'}
            >
              {BACKEND === 'demo' ? 'Demo mode' : 'Supabase'}
            </span>
            <button
              onClick={handleSignOut}
              className="tap inline-flex items-center gap-1 rounded-lg px-2 text-sm font-semibold text-muted hover:text-accent"
            >
              <Icon name="LogOut" size={18} /> Sign out
            </button>
          </div>
        </div>
        <nav aria-label="Admin sections" className="container-app -mb-px flex gap-1 overflow-x-auto">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors',
                  isActive
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted hover:text-ink',
                )
              }
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="container-app w-full flex-1 py-6 pb-16">
        <Outlet />
      </main>
    </div>
  )
}
