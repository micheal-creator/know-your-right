import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'
import { conversations, myConversations, startConversation } from '../services/support.js'
import { useCollection } from '../services/useStore.js'
import { cn } from '../lib/format.js'

function when(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) +
    ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Support() {
  useCollection(conversations)
  const navigate = useNavigate()
  const mine = myConversations()

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')

  function start(e) {
    e.preventDefault()
    if (!message.trim() && !subject.trim()) return
    const c = startConversation({ subject, name, firstMessage: message })
    navigate(`/support/${c.id}`)
  }

  return (
    <div className="space-y-6">
      <ScreenHeader
        icon="LifeBuoy"
        title="Support"
        subtitle="A question about the app, a fine, or your rights? Send a message — a real person replies. This is support, not legal advice."
      />

      <form onSubmit={start} className="card space-y-3 p-4">
        <p className="font-heading text-[17px] font-semibold">Start a conversation</p>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          aria-label="Subject"
          placeholder="Subject (e.g. “Wrong fine at checkpoint”)"
          className="tap w-full rounded-xl2 border border-line bg-card px-4 py-3 text-base focus:border-accent"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          aria-label="Message"
          placeholder="How can we help?"
          className="w-full rounded-xl2 border border-line bg-card px-4 py-3 text-base focus:border-accent"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Your name (optional)"
          placeholder="Your name (optional)"
          className="tap w-full rounded-xl2 border border-line bg-card px-4 py-3 text-base focus:border-accent"
        />
        <button type="submit" className="btn-primary w-full">
          <Icon name="Send" size={18} /> Send message
        </button>
      </form>

      {mine.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg">Your conversations</h2>
          {mine.map((c) => (
            <Link
              key={c.id}
              to={`/support/${c.id}`}
              className="card flex items-center gap-3 p-4 transition-shadow hover:shadow-lift"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                <Icon name="MessageSquare" size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-ink">{c.subject}</span>
                <span className="block text-[13px] text-faint">{when(c.updatedAt)}</span>
              </span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                  c.status === 'open' ? 'bg-accent-soft text-accent' : 'bg-line text-faint',
                )}
              >
                {c.status}
              </span>
              <Icon name="ChevronRight" size={18} className="shrink-0 text-faint" />
            </Link>
          ))}
        </section>
      )}

      <Disclaimer compact />
    </div>
  )
}
