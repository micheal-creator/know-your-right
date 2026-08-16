import { toggleBookmark, useIsBookmarked } from '../lib/bookmarks.js'
import { cn } from '../lib/format.js'
import Icon from './Icon.jsx'

// Save/unsave toggle used on entry rows and the entry detail page.
export default function BookmarkButton({ id, size = 20, withLabel = false, className }) {
  const saved = useIsBookmarked(id)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleBookmark(id)
      }}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved' : 'Save for later'}
      className={cn(
        'tap inline-flex items-center justify-center gap-2 rounded-xl px-2 transition-colors',
        saved ? 'text-accent' : 'text-faint hover:text-ink',
        className,
      )}
    >
      <Icon name={saved ? 'BookmarkCheck' : 'Bookmark'} size={size} strokeWidth={saved ? 2 : 1.75} />
      {withLabel && <span className="font-sans text-sm font-semibold">{saved ? 'Saved' : 'Save'}</span>}
    </button>
  )
}
