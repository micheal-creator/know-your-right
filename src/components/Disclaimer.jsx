import { DISCLAIMER } from '../data/meta.js'
import Icon from './Icon.jsx'

// Plain, always-visible reminder shown near legal content.
export default function Disclaimer({ compact = false }) {
  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-xl2 border border-warnsoft bg-warnsoft/60 px-4 py-3 text-sm text-ink"
    >
      <Icon name="Info" size={compact ? 18 : 20} className="mt-0.5 shrink-0 text-warn" />
      <p className={compact ? 'text-[13px] leading-snug text-muted' : 'text-muted'}>
        {DISCLAIMER}
      </p>
    </div>
  )
}
