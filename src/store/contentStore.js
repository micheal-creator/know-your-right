// Content store — the single source of truth for reference entries.
//
// Seeded from the bundled static content (so the app works instantly + offline),
// then editable by admins via the CMS. In DEMO mode edits persist to
// localStorage; when Supabase is configured this cache is hydrated/written
// through to the `content_entries` table.

import { CONSTITUTION } from '../data/constitution.js'
import { POWERS } from '../data/powers.js'
import { TRAFFIC_ENTRIES } from '../data/traffic.js'
import { TENANCY } from '../data/tenancy.js'
import { EMPLOYMENT } from '../data/employment.js'
import { CONSUMER } from '../data/consumer.js'
import { BUSINESS } from '../data/business.js'
import { normalize } from '../lib/format.js'
import { createCollection, today } from '../services/local.js'
import { hasSupabase, loadCollection, saveCollection } from '../services/supabaseSync.js'

// Bump when new seed content is shipped so returning users receive it.
const SEED_VERSION = 2

function seed() {
  return [
    ...CONSTITUTION,
    ...POWERS,
    ...TRAFFIC_ENTRIES,
    ...TENANCY,
    ...EMPLOYMENT,
    ...CONSUMER,
    ...BUSINESS,
  ]
}

export const entries = createCollection('kyr:cms:entries:v1', seed)

// One-time, non-destructive merge: append any newly shipped seed entries that
// aren't already stored, without overwriting admin edits or re-adding entries
// the user has since removed (guarded by a stored seed version).
;(function mergeNewSeed() {
  try {
    const stored = Number(localStorage.getItem('kyr:cms:seedVersion') || '1')
    if (stored < SEED_VERSION) {
      const current = entries.all()
      const ids = new Set(current.map((e) => e.id))
      const additions = seed().filter((e) => !ids.has(e.id))
      if (additions.length) entries.replaceAll([...current, ...additions])
      localStorage.setItem('kyr:cms:seedVersion', String(SEED_VERSION))
    }
  } catch {
    /* ignore */
  }
})()

export function getEntries() {
  return entries.all()
}

// Supabase sync: hydrate the cache from the DB, and write admin edits back.
let entriesSaveTimer
function persistEntries() {
  if (!hasSupabase) return
  clearTimeout(entriesSaveTimer)
  entriesSaveTimer = setTimeout(() => saveCollection('entries', entries.all()).catch(() => {}), 500)
}
if (hasSupabase) {
  loadCollection('entries')
    .then((rows) => {
      if (rows && rows.length) entries.replaceAll(rows)
    })
    .catch(() => {})
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
  const result = entries.upsert(record)
  persistEntries()
  return result
}

export function deleteEntry(id) {
  entries.remove(id)
  persistEntries()
}

export function resetEntries() {
  entries.replaceAll(seed())
  persistEntries()
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
