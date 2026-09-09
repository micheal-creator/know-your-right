import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Icon from '../../components/Icon.jsx'
import { useAuth, signOut } from '../../services/auth.js'
import { BACKEND } from '../../services/supabaseClient.js'
import { useSettings } from '../../services/settings.js'
import AdminLogin from './AdminLogin.jsx'
import { cn } from '../../lib/format.js'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'LayoutDashboard', end: true },
  { to: '/admin/content', label: 'Content', icon: 'FileText' },
  { to: '/admin/lawyers', label: 'Lawyers', icon: 'Users' },
  { to: '/admin/cases', label: 'Cases', icon: 'Inbox' },
  { to: '/admin/support', label: 'Support', icon: 'MessageSquare' },
  { to: '/admin/settings', label: 'Settings', icon: 'Settings' },
]

function SidebarBody({ session, onSignOut, onItem }) {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center gap-2.5 px-2 py-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-white">
          <Icon name="Scale" size={19} strokeWidth={2} />
        </span>
        <div className="leading-tight">
          <p className="font-heading text-[15px] font-bold">Know Your Right</p>
          <p className="text-[11px] text-faint">Admin console</p>
        </div>
      </div>

      <span
        className={cn(
          'mx-2 mt-3 w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold',
          BACKEND === 'demo' ? 'bg-warnsoft text-warn' : 'bg-accent-soft text-accent',
        )}
      >
        {BACKEND === 'demo' ? '● Local demo mode' : '● Supabase connected'}
      </span>

      <nav className="mt-5 flex-1 space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onItem}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-colors',
                isActive ? 'bg-accent text-white shadow-card' : 'text-muted hover:bg-accent-soft hover:text-accent',
              )
            }
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 rounded-xl border border-line p-3">
        <p className="truncate text-[13px] font-semibold text-ink">{session?.name || session?.email || 'Admin'}</p>
        <p className="truncate text-[11px] text-faint">{session?.email}</p>
        <button onClick={onSignOut} className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-accent">
          <Icon name="LogOut" size={15} /> Sign out
        </button>
      </div>
    </div>
  )
}

export default function AdminApp() {
  const session = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  useSettings() // re-render on theme change

  if (!session?.isAdmin) return <AdminLogin />

  async function handleSignOut() {
    await signOut()
    navigate('/admin')
  }

  return (
    <div className="min-h-dvh bg-cloud lg:grid lg:grid-cols-[252px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh border-r border-line bg-card lg:block">
        <SidebarBody session={session} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-card px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-white"><Icon name="Scale" size={16} strokeWidth={2} /></span>
          <span className="font-heading text-[14px] font-bold">Admin</span>
        </div>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-lg text-ink"><Menu size={22} /></button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-card shadow-lift">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg text-muted"><X size={20} /></button>
            <SidebarBody session={session} onSignOut={handleSignOut} onItem={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="min-w-0 p-5 sm:p-8">
        <Outlet />
      </main>
    </div>
  )
}
