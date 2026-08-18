import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { messages, conversationMessages, sendMessage } from '../services/support.js'
import { useCollection } from '../services/useStore.js'
import { cn } from '../lib/format.js'

function time(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Shared chat view used by both the user (sender="user") and admins
// (sender="admin"). Reactive: new messages appear live in the same browser.
export default function ChatThread({ conversationId, sender, disabled = false }) {
  useCollection(messages)
  const msgs = conversationMessages(conversationId)
  const [text, setText] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [msgs.length])

  function submit(e) {
    e.preventDefault()
    if (!text.trim()) return
    sendMessage(conversationId, sender, text)
    setText('')
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-2 overflow-y-auto rounded-xl2 border border-line bg-paper p-3">
        {msgs.length === 0 && (
          <p className="py-6 text-center text-sm text-faint">No messages yet.</p>
        )}
        {msgs.map((m) => {
          const mine = m.sender === sender
          return (
            <div
              key={m.id}
              className={cn(
                'max-w-[82%] rounded-2xl px-3 py-2',
                mine
                  ? 'ml-auto bg-accent text-white'
                  : 'mr-auto border border-line bg-card text-ink',
              )}
            >
              <p className="whitespace-pre-wrap text-[15px] leading-snug">{m.body}</p>
              <p className={cn('mt-1 text-[10px]', mine ? 'text-white/70' : 'text-faint')}>
                {m.sender === 'admin' ? 'Support' : 'You'} · {time(m.createdAt)}
              </p>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="mt-3 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          aria-label="Message"
          placeholder="Type a message…"
          className="tap flex-1 rounded-xl2 border border-line bg-card px-4 py-3 text-base focus:border-accent disabled:opacity-60"
        />
        <button type="submit" className="btn-primary px-4" disabled={disabled} aria-label="Send message">
          <Icon name="Send" size={18} />
        </button>
      </form>
    </div>
  )
}
