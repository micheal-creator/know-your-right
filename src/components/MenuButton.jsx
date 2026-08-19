import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, LifeBuoy, Info, Shield } from 'lucide-react'

const ITEMS = [
  { to: '/support', label: 'Support', icon: LifeBuoy },
  { to: '/about', label: 'About', icon: Info },
  { to: '/admin', label: 'Admin', icon: Shield },
]

// Top-right menu. `tone="light"` for the green header (white icon),
// `tone="dark"` on white surfaces.
export default function MenuButton({ tone = 'light' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        className={
          'tap grid place-items-center rounded-lg ' +
          (tone === 'light' ? 'text-white/90 hover:text-white' : 'text-ink hover:text-accent')
        }
      >
        <Menu size={24} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-40 w-48 overflow-hidden rounded-xl2 border border-line bg-card py-1 shadow-lift">
          {ITEMS.map(({ to, label, icon: I }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-ink hover:bg-accent-soft hover:text-accent"
            >
              <I size={18} /> {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
