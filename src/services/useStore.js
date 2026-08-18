import { useSyncExternalStore } from 'react'

// Subscribe a component to a reactive collection (from local.js).
export function useCollection(collection) {
  return useSyncExternalStore(
    collection.subscribe,
    collection.getSnapshot,
    collection.getSnapshot,
  )
}
