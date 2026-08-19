import { Link } from 'react-router-dom'

// Wordmark used in the top bar.
export default function Brand({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="inline-flex items-center gap-2"
      aria-label="Know Your Right — home"
    >
      <img
        src={`${import.meta.env.BASE_URL}icons/icon-192.png`}
        alt=""
        width="32"
        height="32"
        className="h-8 w-8 rounded-lg"
      />
      <span className="font-heading text-lg font-bold tracking-tight text-ink">
        Know Your Right
      </span>
    </Link>
  )
}
