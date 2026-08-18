// Local-storage backed reactive collections.
//
// These power the app + admin console in DEMO mode (no backend). Every
// collection is reactive (useSyncExternalStore-friendly) and syncs across tabs
// in the same browser via the `storage` event — enough to demo live support
// chat locally. When Supabase is configured, these act as the in-memory cache
// that the Supabase adapters hydrate and write through.

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function nowISO() {
  return new Date().toISOString()
}

export function today() {
  return new Date().toISOString().slice(0, 10)
}

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch {
    /* storage unavailable (private mode) — ignore */
  }
}

// Create a reactive array collection persisted at `key`, seeded via `seedFn()`.
export function createCollection(key, seedFn) {
  let items = load(key, null)
  if (!Array.isArray(items)) {
    items = seedFn ? seedFn() : []
    save(key, items)
  }
  let snapshot = items
  const listeners = new Set()

  function emit() {
    listeners.forEach((l) => l())
  }
  function commit(next) {
    items = next
    snapshot = next
    save(key, next)
    emit()
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === key) {
        items = load(key, items)
        snapshot = items
        emit()
      }
    })
  }

  return {
    key,
    subscribe(l) {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    getSnapshot() {
      return snapshot
    },
    all() {
      return snapshot
    },
    get(id) {
      return snapshot.find((x) => x.id === id)
    },
    upsert(item) {
      const i = snapshot.findIndex((x) => x.id === item.id)
      const next =
        i >= 0
          ? snapshot.map((x) => (x.id === item.id ? { ...x, ...item } : x))
          : [item, ...snapshot]
      commit(next)
      return item
    },
    remove(id) {
      commit(snapshot.filter((x) => x.id !== id))
    },
    replaceAll(next) {
      commit(next)
    },
  }
}
