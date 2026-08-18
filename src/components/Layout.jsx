import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Brand from './Brand.jsx'
import Icon from './Icon.jsx'
import { cn } from '../lib/format.js'

const NAV = [
  { to: '/', label: 'Home', icon: 'Home', end: true },
  { to: '/traffic', label: 'Traffic', icon: 'Car' },
  { to: '/hire', label: 'Hire', icon: 'Gavel', primary: true },
  { to: '/bookmarks', label: 'Saved', icon: 'Bookmark' },
  { to: '/about', label: 'About', icon: 'Info' },
]

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname])
  return null
}

function NavItem({ item }) {
  if (item.primary) {
    return (
      <NavLink
        to={item.to}
        aria-label="Hire a lawyer"
        className="relative -mt-6 flex flex-col items-center justify-start"
      >
        {({ isActive }) => (
          <>
            <span
              className={cn(
                'grid h-14 w-14 place-items-center rounded-full border-4 border-paper text-white shadow-lift transition-colors',
                isActive ? 'bg-accent-hover' : 'bg-accent',
              )}
            >
              <Icon name={item.icon} size={24} strokeWidth={2} />
            </span>
            <span className="mt-1 text-[11px] font-semibold text-accent">{item.label}</span>
          </>
        )}
      </NavLink>
    )
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          'tap flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-medium transition-colors',
          isActive ? 'text-accent' : 'text-faint hover:text-ink',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon name={item.icon} size={22} strokeWidth={isActive ? 2 : 1.75} />
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  )
}

export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />

      <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
        <div className="container-app flex h-14 items-center justify-between">
          <Brand />
          <div className="flex items-center gap-0.5">
            <NavLink
              to="/support"
              aria-label="Support"
              className="tap grid place-items-center rounded-lg px-2 text-muted hover:text-accent"
            >
              <Icon name="LifeBuoy" size={22} />
            </NavLink>
            <NavLink
              to="/about"
              aria-label="About and disclaimer"
              className="tap grid place-items-center rounded-lg px-2 text-muted hover:text-accent"
            >
              <Icon name="Info" size={22} />
            </NavLink>
          </div>
        </div>
      </header>

      <main className="container-app w-full flex-1 pb-28 pt-5">
        <Outlet />
      </main>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="container-app grid grid-cols-5 items-end py-2">
          {NAV.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </div>
      </nav>
    </div>
  )
}
