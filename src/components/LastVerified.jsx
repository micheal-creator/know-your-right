import { formatDate, isStale } from '../lib/format.js'
import Icon from './Icon.jsx'

// Shows the "last verified" date for a piece of content and flags stale entries.
export default function LastVerified({ date, source }) {
  const stale = isStale(date)
  return (
    <div className="space-y-1 text-[13px] text-faint">
      <div className="flex items-center gap-1.5">
        <Icon name="Clock" size={14} />
        <span>Last verified: {formatDate(date)}</span>
        {stale && (
          <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-warnsoft px-2 py-0.5 text-[11px] font-semibold text-warn">
            <Icon name="AlertTriangle" size={12} /> Needs re-check
          </span>
        )}
      </div>
      {source && <p className="leading-snug">Source: {source}</p>}
    </div>
  )
}
