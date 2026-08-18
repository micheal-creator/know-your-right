import { LAWYERS } from '../data/lawyers.js'
import { createCollection, uid } from './local.js'

// Lawyer directory. Seeded from sample data; editable in the CMS.
// status: 'approved' (public) | 'pending' (awaiting review) | 'suspended'
export const lawyers = createCollection('kyr:cms:lawyers:v1', () =>
  LAWYERS.map((l) => ({ ...l, status: 'approved' })),
)

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
  return lawyers.upsert({ status: 'pending', verified: false, rating: 0, reviews: 0, ...l, id })
}

export function setLawyerStatus(id, status) {
  const l = lawyers.get(id)
  if (l) lawyers.upsert({ ...l, status, verified: status === 'approved' ? true : l.verified })
}

export function removeLawyer(id) {
  lawyers.remove(id)
}
