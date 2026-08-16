import { Link } from 'react-router-dom'
import EntryListItem from '../components/EntryListItem.jsx'
import Icon from '../components/Icon.jsx'
import { useBookmarkIds } from '../lib/bookmarks.js'
import { getEntry } from '../data/index.js'

export default function Bookmarks() {
  const ids = useBookmarkIds()
  const entries = ids.map(getEntry).filter(Boolean)

  return (
    <div className="space-y-5">
      <header>
        <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon name="Bookmark" size={22} />
        </div>
        <h1 className="text-[24px]">Saved</h1>
        <p className="mt-1 text-muted">Entries you’ve kept for later. Saved on this device.</p>
      </header>

      {entries.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent">
            <Icon name="Bookmark" size={24} />
          </div>
          <p className="font-heading text-lg">Nothing saved yet</p>
          <p className="mt-1 text-sm text-muted">
            Tap the bookmark on any entry to keep it here — handy for your state’s rules or common fines.
          </p>
          <Link to="/" className="btn-primary mt-4 inline-flex">
            <Icon name="Search" size={18} /> Browse the law
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((e) => (
            <EntryListItem key={e.id} entry={e} />
          ))}
        </div>
      )}
    </div>
  )
}
