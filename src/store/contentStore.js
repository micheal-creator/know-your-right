// Content store — the single source of truth for reference entries.
//
// Seeded from the bundled static content (so the app works instantly + offline),
// then editable by admins via the CMS. In DEMO mode edits persist to
// localStorage; when Supabase is configured this cache is hydrated/written
// through to the `content_entries` table.

import { CONSTITUTION } from '../data/constitution.js'
import { POWERS } from '../data/powers.js'
import { TRAFFIC_ENTRIES } from '../data/traffic.js'
import { normalize } from '../lib/format.js'
import { createCollection, today } from '../services/local.js'

function seed() {
  return [...CONSTITUTION, ...POWERS, ...TRAFFIC_ENTRIES]
}

export const entries = createCollection('kyr:cms:entries:v1', seed)

export function getEntries() {
  return entries.all()
}

export function getEntry(id) {
  return entries.get(id)
}

export function entriesByCategory(categoryId) {
  return entries.all().filter((e) => e.category === categoryId)
}

export function getTraffic() {
  return entries.all().filter((e) => e.type === 'traffic')
}

export function upsertEntry(entry) {
  const record = { ...entry, lastVerified: entry.lastVerified || today() }
  return entries.upsert(record)
}

export function deleteEntry(id) {
  entries.remove(id)
}

export function resetEntries() {
  entries.replaceAll(seed())
}

// Lightweight ranked local search across title, reference, summary and tags.
export function searchEntries(query) {
  const q = normalize(query)
  if (!q) return []
  const terms = q.split(/\s+/).filter(Boolean)

  const scored = entries.all().map((e) => {
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
    if (score > 0 && title.includes(q)) score += 6
    return { entry: e, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.entry)
}
