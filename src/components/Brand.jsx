import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

// Wordmark used in the top bar.
export default function Brand({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="inline-flex items-center gap-2"
      aria-label="Know Your Right — home"
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-white">
        <Icon name="Scale" size={18} strokeWidth={2} />
      </span>
      <span className="font-heading text-lg font-bold tracking-tight text-ink">
        Know Your Right
      </span>
    </Link>
  )
}
