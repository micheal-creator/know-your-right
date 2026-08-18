import { createCollection, uid, nowISO, load, save } from './local.js'

// Support conversations + messages (in-app chat between a user and admins).
// In DEMO mode this is browser-local and syncs across tabs of the same browser
// (open the app in one tab and /admin in another to see live replies).
// With Supabase it maps to `conversations` + `messages` tables with Realtime.

const TOKEN_KEY = 'kyr:support:userToken'

// A stable per-device token so a guest can see their own threads without login.
export function userToken() {
  let t = load(TOKEN_KEY, null)
  if (!t) {
    t = uid('usr')
    save(TOKEN_KEY, t)
  }
  return t
}

export const conversations = createCollection('kyr:cms:conversations:v1', () => [])
export const messages = createCollection('kyr:cms:messages:v1', () => [])

// Monotonic sequence to keep message order stable even when several messages
// share the same millisecond timestamp. Seeded from any persisted messages.
let msgSeq = messages.all().reduce((max, m) => Math.max(max, m.seq || 0), 0) + 1

export function startConversation({ subject, name, firstMessage }) {
  const c = {
    id: uid('conv'),
    subject: (subject || '').trim() || 'Support request',
    name: (name || '').trim() || 'Guest',
    userToken: userToken(),
    status: 'open', // 'open' | 'closed'
    createdAt: nowISO(),
    updatedAt: nowISO(),
    lastSender: 'user',
  }
  conversations.upsert(c)
  if (firstMessage && firstMessage.trim()) sendMessage(c.id, 'user', firstMessage)
  return c
}

export function myConversations() {
  const t = userToken()
  return conversations
    .all()
    .filter((c) => c.userToken === t)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
}

export function listConversations() {
  return [...conversations.all()].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
}

export function getConversation(id) {
  return conversations.get(id)
}

export function conversationMessages(conversationId) {
  return messages
    .all()
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => {
      if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? -1 : 1
      return (a.seq || 0) - (b.seq || 0)
    })
}

export function sendMessage(conversationId, sender, body) {
  const text = (body || '').trim()
  if (!text) return null
  const m = {
    id: uid('msg'),
    conversationId,
    sender, // 'user' | 'admin'
    body: text,
    seq: msgSeq++,
    createdAt: nowISO(),
  }
  messages.upsert(m)
  const c = conversations.get(conversationId)
  if (c) {
    conversations.upsert({
      ...c,
      updatedAt: nowISO(),
      lastSender: sender,
      status: 'open',
    })
  }
  return m
}

export function setConversationStatus(id, status) {
  const c = conversations.get(id)
  if (c) conversations.upsert({ ...c, status, updatedAt: nowISO() })
}
