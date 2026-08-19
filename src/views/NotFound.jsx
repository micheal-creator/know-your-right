import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

export default function NotFound() {
  return (
    <div className="card p-10 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-accent-soft text-accent">
        <Icon name="Search" size={26} />
      </div>
      <h1 className="section-title text-[22px]">Page not found</h1>
      <p className="mt-1 text-sm text-muted">That page doesn’t exist. Let’s get you back on track.</p>
      <Link to="/" className="btn-primary mt-5 inline-flex">
        <Icon name="Home" size={18} /> Go home
      </Link>
    </div>
  )
}
