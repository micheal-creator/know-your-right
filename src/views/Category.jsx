import { Link, useParams } from 'react-router-dom'
import EntryListItem from '../components/EntryListItem.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import Icon from '../components/Icon.jsx'
import { getCategory } from '../data/categories.js'
import { entriesByCategory } from '../data/index.js'

export default function Category() {
  const { id } = useParams()
  const category = getCategory(id)
  const entries = entriesByCategory(id)

  if (!category) {
    return (
      <div className="card p-6 text-center">
        <p className="font-heading text-lg">Topic not found.</p>
        <Link to="/" className="link-accent mt-3 inline-block">
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-accent">
        <Icon name="ArrowLeft" size={16} /> Home
      </Link>

      <header>
        <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon name={category.icon} size={22} />
        </div>
        <h1 className="text-[24px]">{category.title}</h1>
        <p className="mt-1 text-muted">{category.blurb}</p>
      </header>

      {category.ready && entries.length > 0 ? (
        <div className="space-y-3">
          {entries.map((e) => (
            <EntryListItem key={e.id} entry={e} />
          ))}
        </div>
      ) : (
        <div className="card p-6 text-center">
          <p className="font-heading text-lg">Coming soon.</p>
          <p className="mt-1 text-sm text-muted">
            This topic is on the roadmap. In the meantime, you can talk to a lawyer.
          </p>
          <Link to="/hire" className="btn-primary mt-4 inline-flex">
            <Icon name="Gavel" size={18} /> Hire a lawyer
          </Link>
        </div>
      )}

      <Disclaimer />
    </div>
  )
}
