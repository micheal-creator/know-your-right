import { Link, useParams } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import ChatThread from '../../components/ChatThread.jsx'
import {
  conversations,
  listConversations,
  getConversation,
  setConversationStatus,
} from '../../services/support.js'
import { useCollection } from '../../services/useStore.js'
import { cn } from '../../lib/format.js'

function when(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) +
    ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function AdminSupport() {
  const { id } = useParams()
  useCollection(conversations)

  if (id) {
    const convo = getConversation(id)
    if (!convo) {
      return (
        <div className="card p-6 text-center">
          <p className="font-heading text-lg">Conversation not found.</p>
          <Link to="/admin/support" className="link-accent mt-3 inline-block">Back</Link>
        </div>
      )
    }
    return (
      <div className="flex min-h-[70vh] flex-col space-y-4">
        <Link to="/admin/support" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-accent">
          <Icon name="ArrowLeft" size={16} /> Conversations
        </Link>
        <header className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[20px]">{convo.subject}</h1>
            <p className="text-[13px] text-faint">From {convo.name}</p>
          </div>
          <button
            onClick={() => setConversationStatus(convo.id, convo.status === 'open' ? 'closed' : 'open')}
            className="btn-outline px-3 py-2 text-sm"
          >
            {convo.status === 'open' ? 'Mark resolved' : 'Reopen'}
          </button>
        </header>
        <ChatThread conversationId={convo.id} sender="admin" />
      </div>
    )
  }

  const list = listConversations()

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-[24px]">Support</h1>
        <p className="mt-1 text-muted">Respond to conversations started by users.</p>
      </header>

      <div className="space-y-3">
        {list.map((c) => {
          const needsReply = c.status === 'open' && c.lastSender === 'user'
          return (
            <Link
              key={c.id}
              to={`/admin/support/${c.id}`}
              className="card flex items-center gap-3 p-4 transition-shadow hover:shadow-lift"
            >
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                <Icon name="MessageSquare" size={18} />
                {needsReply && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-card bg-warn" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-ink">{c.subject}</span>
                <span className="block truncate text-[13px] text-faint">{c.name} · {when(c.updatedAt)}</span>
              </span>
              {needsReply && (
                <span className="rounded-full bg-warnsoft px-2 py-0.5 text-[11px] font-semibold text-warn">Needs reply</span>
              )}
              <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', c.status === 'open' ? 'bg-accent-soft text-accent' : 'bg-line text-faint')}>
                {c.status}
              </span>
            </Link>
          )
        })}
        {list.length === 0 && <div className="card p-6 text-center text-muted">No conversations yet.</div>}
      </div>
    </div>
  )
}
