import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import BookmarkButton from './BookmarkButton.jsx'
import { typeLabel } from '../lib/labels.js'

// A single reference entry, rendered as a tappable card row.
export default function EntryListItem({ entry }) {
  const t = typeLabel(entry.type)
  return (
    <div className="card card-hover flex items-stretch overflow-hidden">
      <Link to={`/entry/${entry.id}`} className="flex min-w-0 flex-1 items-center gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
            <Icon name={t.icon} size={13} />
            <span>{t.label}</span>
            {entry.reference ? (
              <span className="font-medium normal-case tracking-normal text-faint">· {entry.reference}</span>
            ) : null}
          </div>
          <h3 className="truncate font-heading text-[17px] font-semibold text-ink">{entry.title}</h3>
          <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-muted">{entry.summary}</p>
        </div>
        <Icon name="ChevronRight" size={20} className="shrink-0 self-center text-faint" />
      </Link>
      <div className="flex items-center border-l border-line/70 px-1">
        <BookmarkButton id={entry.id} />
      </div>
    </div>
  )
}
