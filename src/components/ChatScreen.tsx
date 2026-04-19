import { useRef } from "react"
import { RefreshCw } from "lucide-react"
import type { AppScreen } from "../types"
import { useChat } from "../hooks/useChat"
import { ChatHeader } from "../components/chat/ChatHeader"
import { ChatEmptyState } from "../components/chat/ChatEmptyState"
import { MessageRow } from "../components/chat/MessageRow"
import { ChatInput } from "../components/chat/ChatInput"

interface Props {
  goTo: (s: AppScreen) => void
}

export function ChatScreen({ goTo }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const {
    messages,
    input,
    setInput,
    sendMessage,
    regenerateLastMessage,
    editMessage,
    clearMessages,
    hasMessages,
    bottomRef,
  } = useChat()

  const isLastMessageLoading = messages[messages.length - 1]?.isLoading === true

  return (
    <div className="bg-[#111111] min-h-screen flex justify-center">
      <div className="w-full md:max-w-[480px] md:h-screen md:rounded-2xl md:overflow-hidden md:shadow-2xl">
        <div className="flex flex-col h-screen overflow-hidden bg-[#111111]">
          {/* Header */}
          <ChatHeader goTo={goTo} onClear={clearMessages} />

          {/* Scroll area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {!hasMessages && <ChatEmptyState />}

            <div className="pt-2 pb-4 space-y-4 min-h-full flex flex-col justify-end">
              {messages.map((msg) => (
                <MessageRow key={msg.id} message={msg} onEdit={editMessage} />
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Regenerate — only when last message is not loading */}
          {hasMessages && !isLastMessageLoading && (
            <div className="flex justify-center pb-6 pt-6 shrink-0">
              <button
                onClick={regenerateLastMessage}
                className="flex items-center gap-2 px-5 py-3 bg-[#232627] rounded-lg border border-[#676767] hover:scale-105 transition-all"
              >
                <RefreshCw size={15} className="text-white" />
                <span className="text-[#A3A3AB] text-xs">Regenerate Response</span>
              </button>
            </div>
          )}

          {/* Input */}
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            disabled={isLastMessageLoading}
          />
        </div>
      </div>
    </div>
  )
}
