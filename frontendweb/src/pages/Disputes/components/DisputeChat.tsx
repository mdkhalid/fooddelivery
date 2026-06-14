import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip } from 'lucide-react'
import Button from '@/components/ui/Button'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/utils/cn'

interface DisputeMessage {
  id: string
  disputeId: string
  senderId: string
  senderRole: string
  content: string
  createdAt: string
}

interface DisputeChatProps {
  messages: DisputeMessage[]
  disputeId: string
  onSendMessage?: (content: string) => void
}

export default function DisputeChat({ messages, onSendMessage }: DisputeChatProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    onSendMessage?.(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-surface-400">No messages yet</p>
          </div>
        ) : (
          messages.map((message) => {
            const isSystem = message.senderRole === 'SYSTEM'
            const isSupport = message.senderRole === 'SUPPORT'

            return (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  isSystem ? 'justify-start' : isSupport ? 'justify-start' : 'justify-end',
                )}
              >
                {!isSystem && (
                  <div
                    className={cn(
                      'h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold',
                      isSupport ? 'bg-blue-100 text-blue-700' : 'bg-brand-100 text-brand-700',
                    )}
                  >
                    {message.senderRole.charAt(0)}
                  </div>
                )}

                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-2.5',
                    isSystem
                      ? 'bg-surface-100 text-surface-600'
                      : isSupport
                        ? 'bg-blue-50 text-surface-800'
                        : 'bg-brand-500 text-white',
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        isSystem ? 'text-surface-500' : isSupport ? 'text-blue-700' : 'text-white/80',
                      )}
                    >
                      {isSystem ? 'System' : isSupport ? 'Support' : 'You'}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  <p
                    className={cn(
                      'mt-1 text-[11px]',
                      isSystem ? 'text-surface-400' : isSupport ? 'text-blue-500' : 'text-white/60',
                    )}
                  >
                    {formatRelativeTime(message.createdAt)}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-surface-100 p-4">
        <div className="flex items-end gap-3">
          <button
            type="button"
            className="mb-2.5 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className={cn(
                'w-full resize-none rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm text-surface-900',
                'placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400',
                'transition-all duration-200',
              )}
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={!input.trim()}
            className="mb-2.5"
            leftIcon={<Send className="h-4 w-4" />}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
