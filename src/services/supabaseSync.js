// Supabase sync for the Know Your Right CMS.
// Uses two generic tables in the shared Supabase project:
//   kyr_content(collection, slug, data jsonb, status, sort_order)
//   kyr_settings(id, data jsonb)
// Public can read; only admins (profiles.is_admin) can write (enforced by RLS).
// When Supabase isn't configured, every function is a safe no-op and the app
// keeps using its local (browser) store.

import { supabase, isDemo } from './supabaseClient.js'

export const hasSupabase = !isDemo

const CONTENT = 'kyr_content'
const SETTINGS = 'kyr_settings'

export async function loadCollection(name) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from(CONTENT)
    .select('slug,data,sort_order')
    .eq('collection', name)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data || []).map((r) => ({ id: r.slug, ...(r.data || {}) }))
}

export async function saveCollection(name, items) {
  if (!supabase) return
  const { error: delError } = await supabase.from(CONTENT).delete().eq('collection', name)
  if (delError) throw delError
  const list = Array.isArray(items) ? items : []
  if (list.length) {
    const rows = list.map((it, i) => {
      const { id, ...rest } = it
      return {
        collection: name,
        slug: String(id || `${name}-${i + 1}`),
        data: rest,
        status: rest.status || 'published',
        sort_order: i,
      }
    })
    const { error } = await supabase.from(CONTENT).insert(rows)
    if (error) throw error
  }
}

export async function loadSettingsRow() {
  if (!supabase) return null
  const { data } = await supabase.from(SETTINGS).select('data').eq('id', 'global').maybeSingle()
  return data?.data || null
}

export async function saveSettingsRow(obj) {
  if (!supabase) return
  const { error } = await supabase
    .from(SETTINGS)
    .upsert({ id: 'global', data: obj, updated_at: new Date().toISOString() })
  if (error) throw error
}
