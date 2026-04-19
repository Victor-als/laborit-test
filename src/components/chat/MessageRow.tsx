import { useState, useRef, useEffect } from "react"
import { Copy, Share2, SquarePen, Check } from "lucide-react"
import type { Message } from "../../types"
import MiniLogo from "../../assets/MiniLogo.png"
import LogoRobot from "../../assets/Robot.png"

interface Props {
  message: Message
  onEdit?: (id: string, newContent: string) => void
}

export function MessageRow({ message, onEdit }: Props) {
  const [copied, setCopied] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(message.content)
  const inputRef = useRef<HTMLInputElement>(null)
  const isUser = message.role === "user"

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function handleCopy() {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleEditSubmit() {
    if (editValue.trim() && onEdit) {
      onEdit(message.id, editValue.trim())
    }
    setEditing(false)
  }

  // Loading indicator
  if (message.isLoading) {
    return (
      <div className="bg-[#232627] p-8">
        <div className="flex items-center gap-3">
          <img src={MiniLogo} alt="" width={28} />
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      </div>
    )
  }

  // User message
  if (isUser) {
    return (
      <div className="flex items-center gap-6 px-8 mt-2">
        <img src={LogoRobot} alt="" width={28} />

        <div className="flex-1 flex items-center justify-between gap-3">
          {editing ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditSubmit()
                if (e.key === "Escape") setEditing(false)
              }}
              className="flex-1 bg-[#1a1a1a] border border-[#444] rounded-lg px-3 py-1.5 text-white text-xs outline-none focus:border-[#666]"
            />
          ) : (
            <p className="text-white text-xs flex-1">{message.content}</p>
          )}

          {editing ? (
            <button
              onClick={handleEditSubmit}
              className="opacity-60 hover:opacity-100 transition-opacity shrink-0"
            >
              <Check size={15} className="text-green-400" />
            </button>
          ) : (
            <button
              onClick={() => {
                setEditValue(message.content)
                setEditing(true)
              }}
              className="opacity-40 hover:opacity-100 transition-opacity shrink-0"
            >
              <SquarePen size={15} className="text-white" />
            </button>
          )}
        </div>
      </div>
    )
  }

  // Assistant message
  return (
    <div>
      <div className="bg-[#232627] p-8 relative">
        <div className="flex items-center justify-between mb-5">
          <img src={MiniLogo} alt="" width={28} />

          <div className="flex gap-3 items-center">
            <button
              onClick={handleCopy}
              className="opacity-40 hover:opacity-100 transition-opacity"
            >
              {copied
                ? <Check size={15} className="text-green-400" />
                : <Copy size={15} className="text-white" />
              }
            </button>

            <button className="opacity-40 hover:opacity-100 transition-opacity">
              <Share2 size={15} className="text-white" />
            </button>
          </div>
        </div>

        <p className="text-[#ccc] text-xs leading-relaxed whitespace-pre-line">
          {message.content}
        </p>
      </div>
    </div>
  )
}
