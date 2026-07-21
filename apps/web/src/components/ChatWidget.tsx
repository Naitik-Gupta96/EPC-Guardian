import { useState, useRef, useEffect } from 'react'
import { useStore } from '../state/store'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: string[]
  timestamp: number
}

const initialMessages: Message[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Hello! I\'m your EPC project intelligence assistant. Ask me anything about specifications, submittals, deviations, or the project schedule.',
    timestamp: Date.now(),
  },
]

function generateMockResponse(query: string, deviations: any[]): Message {
  const lower = query.toLowerCase()

  if (lower.includes('deviation') || lower.includes('non-conformance') || lower.includes('nonconformance')) {
    const critical = deviations.filter((d: any) => d.severity === 'critical')
    const total = deviations.length
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `Found **${total} deviations** in the current project. **${critical.length} critical** — the most severe is **${critical[0]?.id || 'N/A'}** (delta ${critical[0]?.delta}${critical[0]?.normalized_unit || ''}). See the Compliance Feed for full details.`,
      citations: ['Compliance Feed', 'Deviation Detail'],
      timestamp: Date.now(),
    }
  }

  if (lower.includes('ups') || lower.includes('battery') || lower.includes('autonomy')) {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `**UPS-A battery autonomy**: Requirement is ≥ 15 minutes at full rated load (per DC-TIER3-UPS-SPEC-001 §2.1). Vendor submittal VS-019 states **10 minutes** — a deviation of **−5.0 minutes**. This is flagged as **CRITICAL** severity and affects IST, 3 schedule activities, and 2 purchase orders.`,
      citations: ['DC-TIER3-UPS-SPEC-001 §2.1', 'SUB-UPS-A-001', 'DEV-UPS-001'],
      timestamp: Date.now(),
    }
  }

  if (lower.includes('schedule') || lower.includes('delay') || lower.includes('critical path')) {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `The current **critical path** runs through: A-2210 (UPS installation) → A-2220 (IST) → A-2230 (SAT). Total float on A-2210 is **0 days**. The UPS-A autonomy deviation could add **up to 30 days** to IST if a battery replacement is required. Use the Scenario Simulator to model specific delay scenarios.`,
      citations: ['CPM Analysis', 'Scenario Simulator'],
      timestamp: Date.now(),
    }
  }

  if (lower.includes('schedule') || lower.includes('delay') || lower.includes('critical path')) {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `The current **critical path** runs through: A-2210 (UPS installation) → A-2220 (IST) → A-2230 (SAT). Total float on A-2210 is **0 days**.`,
      citations: ['CPM Analysis'],
      timestamp: Date.now(),
    }
  }

  if (lower.includes('hello') || lower.includes('hi ') || lower.includes('hey')) {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: 'Hi there! I can help with:\n\n• **Deviations** — "Show me critical deviations"\n• **Specifications** — "What does the UPS spec require?"\n• **Schedule** — "What is the critical path?"\n• **Documents** — "Find me the generator submittal"\n• **Compliance** — "Is UPS-B compliant?"',
      citations: [],
      timestamp: Date.now(),
    }
  }

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: `I searched the project knowledge base for "${query}". I found relevant information in the specification and submittal documents. Could you narrow down your question? For example, ask about a specific deviation (e.g. "UPS autonomy"), schedule items, or compliance results.`,
    citations: ['Project Knowledge Base'],
    timestamp: Date.now(),
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const deviations = useStore((s) => s.deviations)

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    setTimeout(() => {
      const reply = generateMockResponse(text, deviations)
      setMessages((prev) => [...prev, reply])
      setLoading(false)
    }, 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[520px] bg-secondary border border-gray-700 rounded-xl shadow-elevated flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-primary/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-sm font-semibold text-text-primary">Project Intelligence</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md hover:bg-tertiary text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-accent-blue text-white rounded-br-sm'
                      : 'bg-tertiary text-text-primary rounded-bl-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-gray-700/50">
                      {msg.citations.map((c) => (
                        <span key={c} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/50 text-text-muted">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-tertiary rounded-lg rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 p-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about deviations, specs, schedule..."
                className="flex-1 bg-primary border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="p-2 rounded-lg bg-accent-blue hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent-blue hover:bg-blue-700 shadow-glow-blue text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        title="Project Intelligence Chat"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        )}
      </button>
    </>
  )
}
