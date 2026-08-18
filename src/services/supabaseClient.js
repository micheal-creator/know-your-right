// Supabase client — only created when both env vars are present. Otherwise the
// app runs in DEMO mode (browser-local). No code changes are needed to switch:
// add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY and rebuild.
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: true, autoRefreshToken: true },
      })
    : null

export const BACKEND = supabase ? 'supabase' : 'demo'
export const isDemo = !supabase
