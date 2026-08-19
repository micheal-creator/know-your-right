import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar.jsx'
import EntryListItem from '../components/EntryListItem.jsx'
import Icon from '../components/Icon.jsx'
import { searchEntries } from '../data/index.js'

export default function SearchResults() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const results = useMemo(() => searchEntries(q), [q])

  function update(val) {
    setParams(val ? { q: val } : {}, { replace: true })
  }

  return (
    <div className="space-y-5">
      <Link to="/" className="backlink">
        <Icon name="ArrowLeft" size={16} /> Home
      </Link>

      <SearchBar value={q} onChange={update} autoFocus />

      {q.trim() === '' ? (
        <p className="text-muted">Type a word to search the Constitution, traffic fines and state powers.</p>
      ) : results.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="font-heading text-lg">No results for “{q}”.</p>
          <p className="mt-1 text-sm text-muted">Try a simpler word, or talk to a lawyer.</p>
          <Link to="/hire" className="btn-primary mt-4 inline-flex">
            <Icon name="Gavel" size={18} /> Hire a lawyer
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted" aria-live="polite">
            {results.length} result{results.length > 1 ? 's' : ''}
          </p>
          <div className="space-y-3">
            {results.map((e) => (
              <EntryListItem key={e.id} entry={e} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
