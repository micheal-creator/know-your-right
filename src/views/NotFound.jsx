import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

export default function NotFound() {
  return (
    <div className="card p-8 text-center">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent">
        <Icon name="Search" size={24} />
      </div>
      <h1 className="text-[22px]">Page not found</h1>
      <p className="mt-1 text-sm text-muted">That page doesn’t exist. Let’s get you back on track.</p>
      <Link to="/" className="btn-primary mt-4 inline-flex">
        <Icon name="Home" size={18} /> Go home
      </Link>
    </div>
  )
}
