import { createCollection, uid, nowISO } from './local.js'

// "Cases" = Hire-a-Lawyer requests submitted from the app.
// status flow: new -> reviewing -> matched -> closed
export const cases = createCollection('kyr:cms:cases:v1', () => [])

export const CASE_STATUSES = ['new', 'reviewing', 'matched', 'closed']

export const CASE_STATUS_LABEL = {
  new: 'New',
  reviewing: 'Reviewing',
  matched: 'Matched',
  closed: 'Closed',
}

export function createCase({ issue, state, description, name, contact }) {
  const c = {
    id: uid('case'),
    issue: issue || 'general',
    state: state || '',
    description: (description || '').trim(),
    name: (name || '').trim(),
    contact: (contact || '').trim(),
    status: 'new',
    note: '',
    createdAt: nowISO(),
    updatedAt: nowISO(),
  }
  cases.upsert(c)
  return c
}

export function listCases() {
  return cases.all()
}

export function getCase(id) {
  return cases.get(id)
}

export function setCaseStatus(id, status) {
  const c = cases.get(id)
  if (c) cases.upsert({ ...c, status, updatedAt: nowISO() })
}

export function setCaseNote(id, note) {
  const c = cases.get(id)
  if (c) cases.upsert({ ...c, note, updatedAt: nowISO() })
}

export function removeCase(id) {
  cases.remove(id)
}
