import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar.jsx'
import EntryListItem from '../components/EntryListItem.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import Icon from '../components/Icon.jsx'
import { CATEGORIES } from '../data/categories.js'
import { getEntry, searchEntries } from '../data/index.js'
import { APP } from '../data/meta.js'
import { cn } from '../lib/format.js'

const QUICK_LINKS = ['con-guide-stopped', 'con-35', 'con-37', 'pow-okada']

function categoryHref(cat) {
  return cat.id === 'traffic' ? '/traffic' : `/category/${cat.id}`
}

function CategoryTile({ cat }) {
  const inner = (
    <>
      <span
        className={cn(
          'grid h-11 w-11 place-items-center rounded-xl',
          cat.ready ? 'bg-accent-soft text-accent' : 'bg-line text-faint',
        )}
      >
        <Icon name={cat.icon} size={22} />
      </span>
      <span className="mt-3 block font-heading text-[16px] font-semibold text-ink">{cat.title}</span>
      <span className="mt-1 block text-[13px] leading-snug text-muted">{cat.blurb}</span>
      {!cat.ready && (
        <span className="mt-2 inline-block rounded-full bg-line px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-faint">
          Coming soon
        </span>
      )}
    </>
  )

  if (!cat.ready) {
    return (
      <div aria-disabled="true" className="card p-4 opacity-70">
        {inner}
      </div>
    )
  }
  return (
    <Link to={categoryHref(cat)} className="card block p-4 transition-shadow hover:shadow-lift">
      {inner}
    </Link>
  )
}

export default function Home() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const query = q.trim()

  const results = useMemo(() => (query ? searchEntries(query) : []), [query])
  const quick = QUICK_LINKS.map(getEntry).filter(Boolean)

  return (
    <div className="space-y-7">
      <section>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent">Nigeria</p>
        <h1 className="mt-1 text-[27px] leading-tight">{APP.tagline}</h1>
        <p className="mt-2 text-[15px] text-muted">{APP.blurb}</p>
      </section>

      <SearchBar
        value={q}
        onChange={setQ}
        onSubmit={(val) => val.trim() && navigate(`/search?q=${encodeURIComponent(val.trim())}`)}
      />

      {query ? (
        <section aria-live="polite" className="space-y-3">
          {results.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="font-heading text-lg">No results for “{query}”.</p>
              <p className="mt-1 text-sm text-muted">
                Try a simpler word, or talk to a lawyer about your specific situation.
              </p>
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
                {results.slice(0, 6).map((e) => (
                  <EntryListItem key={e.id} entry={e} />
                ))}
              </div>
              {results.length > 6 && (
                <Link
                  to={`/search?q=${encodeURIComponent(query)}`}
                  className="btn-outline w-full"
                >
                  See all {results.length} results
                  <Icon name="ArrowRight" size={18} />
                </Link>
              )}
            </>
          )}
        </section>
      ) : (
        <>
          <section>
            <h2 className="mb-3 text-lg">Browse by topic</h2>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <CategoryTile key={cat.id} cat={cat} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg">People often look up</h2>
            <div className="space-y-3">
              {quick.map((e) => (
                <EntryListItem key={e.id} entry={e} />
              ))}
            </div>
          </section>

          <Link
            to="/hire"
            className="block rounded-xl2 bg-accent p-5 text-white transition-colors hover:bg-accent-hover"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15">
                <Icon name="Gavel" size={22} strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <p className="font-heading text-lg font-semibold">Need a real lawyer?</p>
                <p className="text-sm text-white/85">
                  Tell us what’s going on and we’ll connect you to a vetted lawyer in your state.
                </p>
              </div>
              <Icon name="ChevronRight" size={22} className="ml-auto shrink-0" />
            </div>
          </Link>

          <Disclaimer />
        </>
      )}
    </div>
  )
}
