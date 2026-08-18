import { useSyncExternalStore } from 'react'
import { load, save } from './local.js'
import { supabase, isDemo } from './supabaseClient.js'

// Admin authentication.
// DEMO mode: any email/password works and is treated as an admin (NOT secure —
// for local exploration only). With Supabase: real sign-in, and admin access is
// gated by `profiles.is_admin` (enforced server-side by RLS).

const KEY = 'kyr:admin:session:v1'

let session = load(KEY, null)
const listeners = new Set()

function emit() {
  listeners.forEach((l) => l())
}
function setSession(s) {
  session = s
  if (s) save(KEY, s)
  else {
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
  }
  emit()
}

export function subscribeAuth(l) {
  listeners.add(l)
  return () => listeners.delete(l)
}
export function getSession() {
  return session
}
export function useAuth() {
  return useSyncExternalStore(subscribeAuth, getSession, getSession)
}

async function fetchIsAdmin(userId) {
  try {
    const { data } = await supabase.from('profiles').select('is_admin').eq('id', userId).single()
    return !!data?.is_admin
  } catch {
    return false
  }
}

export async function signIn(email, password) {
  if (isDemo) {
    setSession({
      email,
      name: (email || '').split('@')[0] || 'Admin',
      isAdmin: true,
      demo: true,
    })
    return { ok: true }
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false, error: error.message }
  const isAdmin = await fetchIsAdmin(data.user.id)
  if (!isAdmin) {
    await supabase.auth.signOut()
    return { ok: false, error: 'This account does not have admin access.' }
  }
  setSession({ email: data.user.email, name: data.user.email, isAdmin: true, uid: data.user.id })
  return { ok: true }
}

export async function signOut() {
  if (!isDemo && supabase) {
    try {
      await supabase.auth.signOut()
    } catch {
      /* ignore */
    }
  }
  setSession(null)
}

// Best-effort restore of an existing Supabase session on load.
if (!isDemo && supabase) {
  supabase.auth.getSession().then(async ({ data }) => {
    const u = data?.session?.user
    if (u && (await fetchIsAdmin(u.id))) {
      setSession({ email: u.email, name: u.email, isAdmin: true, uid: u.id })
    }
  })
}
