import { useSyncExternalStore } from 'react'

// Local bookmark store backed by localStorage. Works offline and keeps every
// subscribed component in sync (and across tabs).

const KEY = 'kyr:bookmarks:v1'

let ids = load()
let snapshot = [...ids]
const listeners = new Set()

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function commit() {
  snapshot = [...ids]
  try {
    localStorage.setItem(KEY, JSON.stringify(snapshot))
  } catch {
    /* storage may be unavailable (private mode) — ignore */
  }
  listeners.forEach((l) => l())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      ids = load()
      snapshot = [...ids]
      listeners.forEach((l) => l())
    }
  })
}

export function getBookmarkIds() {
  return snapshot
}

export function toggleBookmark(id) {
  if (ids.has(id)) ids.delete(id)
  else ids.add(id)
  commit()
}

export function useBookmarkIds() {
  return useSyncExternalStore(subscribe, getBookmarkIds, getBookmarkIds)
}

export function useIsBookmarked(id) {
  return useSyncExternalStore(
    subscribe,
    () => ids.has(id),
    () => ids.has(id),
  )
}
