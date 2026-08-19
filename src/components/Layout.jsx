import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'
import PanicButton from './PanicButton.jsx'
import MenuButton from './MenuButton.jsx'
import { cn } from '../lib/format.js'

const LOGO = `${import.meta.env.BASE_URL}icons/icon-192.png`

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
      <NavLink to={item.to} aria-label="Hire a lawyer" className="relative -mt-7 flex flex-col items-center">
        {({ isActive }) => (
          <>
            <span
              className={cn(
                'grid h-14 w-14 place-items-center rounded-full border-2 bg-card text-accent shadow-lift transition-colors',
                isActive ? 'border-accent' : 'border-accent/50',
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
      className="tap flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-medium"
    >
      {({ isActive }) => {
        const solid = isActive && item.icon !== 'Info'
        return (
          <>
            <Icon
              name={item.icon}
              size={22}
              strokeWidth={isActive ? 1.75 : 1.6}
              className={cn(isActive ? 'text-accent' : 'text-faint', solid && 'fill-current')}
            />
            <span className={isActive ? 'text-accent' : 'text-faint'}>{item.label}</span>
          </>
        )
      }}
    </NavLink>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />

      {!isHome && (
        <header className="sticky top-0 z-30 rounded-b-2xl bg-forest text-white shadow-lift">
          <div className="container-app flex h-14 items-center justify-between">
            <Link to="/" className="flex items-center gap-2" aria-label="Know Your Right — home">
              <img src={LOGO} alt="" width="32" height="32" className="h-8 w-8 rounded-lg" />
              <span className="font-heading text-[17px] font-bold">Know Your Right</span>
            </Link>
            <MenuButton tone="light" />
          </div>
        </header>
      )}

      <main className="container-app w-full flex-1 pb-28 pt-5">
        <Outlet />
      </main>

      <PanicButton />

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card/95 backdrop-blur"
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
