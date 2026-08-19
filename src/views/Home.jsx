import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Carousel from '../components/Carousel.jsx'
import MenuButton from '../components/MenuButton.jsx'
import EntryListItem from '../components/EntryListItem.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import { CATEGORIES } from '../data/categories.js'
import { getEntry, searchEntries } from '../data/index.js'
import { HIGHLIGHTS } from '../data/highlights.js'

const LOGO = `${import.meta.env.BASE_URL}icons/icon-192.png`
const SEARCH_PLACEHOLDER = 'Search the law or your crime  e.g. “Traffic …”'

function SearchField({ value, onChange, onSubmit }) {
  return (
    <form role="search" onSubmit={onSubmit} className="relative flex-1">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint">
        <Icon name="Search" size={20} />
      </span>
      <input
        type="search"
        inputMode="search"
        aria-label="Search the law"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={SEARCH_PLACEHOLDER}
        className="tap w-full rounded-full border border-black/10 bg-white py-3.5 pl-12 pr-4 text-[15px] text-ink placeholder:text-faint focus:border-accent focus:outline-none"
      />
    </form>
  )
}

function categoryHref(cat) {
  return cat.id === 'traffic' ? '/traffic' : `/category/${cat.id}`
}

function CategoryTile({ cat }) {
  const inner = (
    <>
      <span
        className={
          'grid h-12 w-12 place-items-center rounded-xl2 ' +
          (cat.ready ? 'bg-sage text-white' : 'bg-line text-faint')
        }
      >
        <Icon name={cat.icon} size={22} />
      </span>
      <span className="mt-3 block font-heading text-[17px] font-bold text-forest">{cat.title}</span>
      <span className="mt-1 block text-[13px] leading-snug text-muted">{cat.blurb}</span>
      {!cat.ready && (
        <span className="mt-2 inline-block rounded-full bg-line px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-faint">
          Coming soon
        </span>
      )}
    </>
  )
  if (!cat.ready) return <div aria-disabled="true" className="card p-4 opacity-70">{inner}</div>
  return (
    <Link to={categoryHref(cat)} className="card block p-4 transition-shadow hover:shadow-lift">
      {inner}
    </Link>
  )
}

export default function Home() {
  const [q, setQ] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const query = q.trim()
  const results = useMemo(() => (query ? searchEntries(query) : []), [query])
  const quickResults = results.slice(0, 8)

  useEffect(() => {
    const onScroll = () => setCollapsed(window.scrollY > 150)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function submitSearch(e) {
    e.preventDefault()
    if (query) navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="-mx-4 -mt-5">
      {/* Collapsed sticky bar (slides in on scroll) */}
      <div
        className={
          'fixed inset-x-0 top-0 z-30 rounded-b-2xl bg-forest px-4 py-3 shadow-[0_12px_24px_-16px_rgba(0,0,0,0.5)] transition-transform duration-300 ' +
          (collapsed ? 'translate-y-0' : '-translate-y-full')
        }
      >
        <div className="mx-auto flex max-w-content items-center gap-3">
          <img src={LOGO} alt="" width="32" height="32" className="h-8 w-8 shrink-0 rounded-lg" />
          <SearchField value={q} onChange={setQ} onSubmit={submitSearch} />
          <MenuButton tone="light" />
        </div>
      </div>

      {/* HERO */}
      <section className="rounded-b-[2rem] bg-forest px-4 pb-7 pt-4 text-white">
        <div className="mx-auto max-w-content">
          <div className="flex items-center justify-between">
            <img src={LOGO} alt="Know Your Right" width="36" height="36" className="h-9 w-9 rounded-lg" />
            <MenuButton tone="light" />
          </div>

          <div className="mt-4">
            <Carousel items={HIGHLIGHTS} />
          </div>

          <h1 className="mt-6 font-display text-white">
            <span className="block text-[24px] font-medium leading-tight">Know what the law</span>
            <span className="block text-[46px] font-extrabold leading-[0.98] tracking-tight sm:text-[52px]">
              Actually says.
            </span>
          </h1>

          <p className="mt-3 font-heading text-[15px] leading-relaxed text-white/85">
            Look up the Constitution, traffic fines, and what your state can and cannot do — in plain
            language. When you need a person, connect to a real lawyer.
          </p>

          <div className="mt-5">
            <SearchField value={q} onChange={setQ} onSubmit={submitSearch} />
          </div>
        </div>
      </section>

      {/* BODY */}
      <div className="mx-auto max-w-content px-4 pb-2 pt-6">
        {query ? (
          <section aria-live="polite" className="space-y-3">
            {results.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="font-heading text-lg">No results for “{query}”.</p>
                <p className="mt-1 text-sm text-muted">Try a simpler word, or talk to a lawyer.</p>
                <Link to="/hire" className="btn-primary mt-4 inline-flex">
                  <Icon name="Gavel" size={18} /> Hire a lawyer
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted">
                  {results.length} result{results.length > 1 ? 's' : ''} for “{query}”
                </p>
                <div className="space-y-3">
                  {quickResults.map((e) => (
                    <EntryListItem key={e.id} entry={e} />
                  ))}
                </div>
                {results.length > quickResults.length && (
                  <Link to={`/search?q=${encodeURIComponent(query)}`} className="btn-outline w-full">
                    See all {results.length} results <Icon name="ArrowRight" size={18} />
                  </Link>
                )}
              </>
            )}
          </section>
        ) : (
          <div className="space-y-7">
            <section>
              <h2 className="mb-3 font-heading text-[20px] font-bold text-ink">Browse by Topic</h2>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <CategoryTile key={cat.id} cat={cat} />
                ))}
              </div>
            </section>

            <Link
              to="/hire"
              className="block rounded-xl3 bg-accent p-5 text-white transition-colors hover:bg-accent-hover"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl2 bg-white/15">
                  <Icon name="Gavel" size={22} strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-lg font-semibold">Need a real lawyer?</p>
                  <p className="text-sm text-white/85">Tell us what’s going on — we’ll match you in your state.</p>
                </div>
                <Icon name="ChevronRight" size={22} className="ml-auto shrink-0" />
              </div>
            </Link>

            <Disclaimer />
          </div>
        )}
      </div>
    </div>
  )
}
