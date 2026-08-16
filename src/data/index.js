import { CONSTITUTION } from './constitution.js'
import { POWERS } from './powers.js'
import { TRAFFIC_ENTRIES } from './traffic.js'
import { normalize } from '../lib/format.js'

// All searchable reference entries in one array.
export const ENTRIES = [...CONSTITUTION, ...POWERS, ...TRAFFIC_ENTRIES]

export function getEntry(id) {
  return ENTRIES.find((e) => e.id === id)
}

export function entriesByCategory(categoryId) {
  return ENTRIES.filter((e) => e.category === categoryId)
}

// Lightweight ranked search across title, reference, summary and tags.
// Runs entirely locally so it is instant and works offline.
export function searchEntries(query) {
  const q = normalize(query)
  if (!q) return []
  const terms = q.split(/\s+/).filter(Boolean)

  const scored = ENTRIES.map((e) => {
    const title = normalize(e.title)
    const ref = normalize(e.reference)
    const summary = normalize(e.summary)
    const tags = normalize((e.tags || []).join(' '))
    const haystack = `${title} ${ref} ${summary} ${tags}`

    let score = 0
    for (const term of terms) {
      if (!haystack.includes(term)) {
        score = -1
        break
      }
      if (title.includes(term)) score += 5
      if (title.startsWith(term)) score += 3
      if (tags.includes(term)) score += 3
      if (ref.includes(term)) score += 2
      if (summary.includes(term)) score += 1
    }
    // Exact phrase bonus.
    if (score > 0 && title.includes(q)) score += 6
    return { entry: e, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.entry)
}
