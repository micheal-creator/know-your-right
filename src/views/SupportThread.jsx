import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import ChatThread from '../components/ChatThread.jsx'
import { conversations, getConversation } from '../services/support.js'
import { useCollection } from '../services/useStore.js'
import { cn } from '../lib/format.js'

export default function SupportThread() {
  const { id } = useParams()
  useCollection(conversations)
  const convo = getConversation(id)

  if (!convo) {
    return (
      <div className="card p-6 text-center">
        <p className="font-heading text-lg">Conversation not found.</p>
        <Link to="/support" className="link-accent mt-3 inline-block">
          Back to support
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-[68vh] flex-col space-y-4">
      <Link to="/support" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-accent">
        <Icon name="ArrowLeft" size={16} /> Support
      </Link>

      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[20px]">{convo.subject}</h1>
          <p className="text-[13px] text-faint">Replies from the Know Your Right team</p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold',
            convo.status === 'open' ? 'bg-accent-soft text-accent' : 'bg-line text-faint',
          )}
        >
          {convo.status}
        </span>
      </header>

      <ChatThread conversationId={convo.id} sender="user" />
    </div>
  )
}
