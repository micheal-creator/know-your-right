import { Link } from 'react-router-dom'
import EntryListItem from '../components/EntryListItem.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'
import Icon from '../components/Icon.jsx'
import { useBookmarkIds } from '../lib/bookmarks.js'
import { getEntry } from '../data/index.js'

export default function Bookmarks() {
  const ids = useBookmarkIds()
  const entries = ids.map(getEntry).filter(Boolean)

  return (
    <div className="space-y-6">
      <ScreenHeader
        icon="Bookmark"
        title="Saved"
        subtitle="Entries you’ve kept for later. Saved on this device."
      />

      {entries.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-accent-soft text-accent">
            <Icon name="Bookmark" size={26} />
          </div>
          <p className="font-heading text-lg font-semibold">Nothing saved yet</p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
            Tap the bookmark on any entry to keep it here — handy for your state’s rules or common fines.
          </p>
          <Link to="/" className="btn-primary mt-5 inline-flex">
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
