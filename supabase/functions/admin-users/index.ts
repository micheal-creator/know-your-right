// Know Your Right — admin user management (server-side, service role).
// Callable only by an existing admin. Lets the dashboard list, create,
// promote/revoke and remove admin users.
//
// Deploy:  supabase functions deploy admin-users
// (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided to Edge Functions
//  automatically — no secrets to set.)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

  // Verify the caller is a signed-in admin.
  const token = (req.headers.get('Authorization') || '').replace('Bearer ', '')
  if (!token) return json({ ok: false, error: 'Not signed in.' }, 401)
  const { data: userData, error: userErr } = await admin.auth.getUser(token)
  const caller = userData?.user
  if (userErr || !caller) return json({ ok: false, error: 'Invalid session.' }, 401)
  const { data: prof } = await admin.from('profiles').select('is_admin').eq('id', caller.id).single()
  if (!prof?.is_admin) return json({ ok: false, error: 'Admins only.' }, 403)

  let body: any = {}
  try {
    body = await req.json()
  } catch {
    /* ignore */
  }
  const action = body.action

  try {
    if (action === 'list') {
      const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 })
      if (error) throw error
      const { data: profiles } = await admin.from('profiles').select('id,is_admin')
      const adminMap = new Map((profiles || []).map((p) => [p.id, p.is_admin]))
      const users = (data?.users || []).map((u) => ({
        id: u.id,
        email: u.email,
        is_admin: Boolean(adminMap.get(u.id)),
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
      }))
      return json({ ok: true, users })
    }

    if (action === 'create') {
      const email = String(body.email || '').trim()
      const password = String(body.password || '')
      if (!email || password.length < 6) return json({ ok: false, error: 'Email and a 6+ character password are required.' }, 400)
      const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true })
      if (error) throw error
      await admin.from('profiles').upsert({ id: data.user.id, email, is_admin: true })
      return json({ ok: true })
    }

    if (action === 'setAdmin') {
      if (body.id === caller.id && body.is_admin === false) return json({ ok: false, error: 'You cannot revoke your own admin access.' }, 400)
      const { error } = await admin.from('profiles').update({ is_admin: Boolean(body.is_admin) }).eq('id', body.id)
      if (error) throw error
      return json({ ok: true })
    }

    if (action === 'remove') {
      if (body.id === caller.id) return json({ ok: false, error: 'You cannot remove your own account.' }, 400)
      const { error } = await admin.auth.admin.deleteUser(body.id)
      if (error) throw error
      return json({ ok: true })
    }

    return json({ ok: false, error: 'Unknown action.' }, 400)
  } catch (e) {
    return json({ ok: false, error: String((e as Error)?.message || e) }, 500)
  }
})
