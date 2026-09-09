import { LAWYERS } from '../data/lawyers.js'
import { createCollection, uid } from './local.js'
import { hasSupabase, loadCollection, saveCollection } from './supabaseSync.js'

// Lawyer directory. Seeded from sample data; editable in the CMS.
// status: 'approved' (public) | 'pending' (awaiting review) | 'suspended'
export const lawyers = createCollection('kyr:cms:lawyers:v1', () =>
  LAWYERS.map((l) => ({ ...l, status: 'approved' })),
)

let saveTimer
function persist() {
  if (!hasSupabase) return
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => saveCollection('lawyers', lawyers.all()).catch(() => {}), 500)
}
if (hasSupabase) {
  loadCollection('lawyers')
    .then((rows) => {
      if (rows && rows.length) lawyers.replaceAll(rows)
    })
    .catch(() => {})
}

export function allLawyers() {
  return lawyers.all()
}

export function approvedLawyers() {
  return lawyers.all().filter((l) => l.status === 'approved')
}

export function getLawyer(id) {
  return lawyers.get(id)
}

export function upsertLawyer(l) {
  const id = l.id || uid('law')
  const result = lawyers.upsert({ status: 'pending', verified: false, rating: 0, reviews: 0, ...l, id })
  persist()
  return result
}

export function setLawyerStatus(id, status) {
  const l = lawyers.get(id)
  if (l) {
    lawyers.upsert({ ...l, status, verified: status === 'approved' ? true : l.verified })
    persist()
  }
}

export function removeLawyer(id) {
  lawyers.remove(id)
  persist()
}
