import { useState, useRef } from "react"
import type { Message } from "../types"
import { sendMessageToAI } from "../services/chat"

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const hasMessages = messages.length > 0

  function scrollToBottom() {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  function addLoadingMessage(): string {
    const loadingId = "loading-" + Date.now()
    setMessages((prev) => [
      ...prev,
      { id: loadingId, role: "assistant", content: "", timestamp: new Date(), isLoading: true },
    ])
    return loadingId
  }

  function resolveLoadingMessage(loadingId: string, content: string) {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === loadingId
          ? { ...msg, content, isLoading: false }
          : msg
      )
    )
  }

  function rejectLoadingMessage(loadingId: string) {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === loadingId
          ? { ...msg, content: "Erro ao responder. Tente novamente.", isLoading: false }
          : msg
      )
    )
  }

  async function sendMessageWithContent(content: string) {
    const userMessage: Message = {
      id: Date.now().toString() + Math.random(),
      role: "user",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    scrollToBottom()

    const loadingId = addLoadingMessage()

    try {
      const aiResponse = await sendMessageToAI(content)
      resolveLoadingMessage(loadingId, aiResponse)
      scrollToBottom()
    } catch {
      rejectLoadingMessage(loadingId)
    }
  }

  async function sendMessage() {
    if (!input.trim()) return
    await sendMessageWithContent(input)
    setInput("")
  }

  async function editMessage(id: string, newContent: string) {
    const index = messages.findIndex((m) => m.id === id)
    if (index === -1) return

    const updated = messages.slice(0, index + 1).map((m, i) =>
      i === index ? { ...m, content: newContent } : m
    )
    setMessages(updated)

    const loadingId = "loading-" + Date.now()
    setMessages((prev) => [
      ...prev,
      { id: loadingId, role: "assistant", content: "", timestamp: new Date(), isLoading: true },
    ])

    try {
      const aiResponse = await sendMessageToAI(newContent)
      resolveLoadingMessage(loadingId, aiResponse)
      scrollToBottom()
    } catch {
      rejectLoadingMessage(loadingId)
    }
  }

  async function regenerateLastMessage() {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")
    if (!lastUserMessage) return

    const lastAssistantIndex = [...messages]
      .map((m, i) => ({ ...m, index: i }))
      .reverse()
      .find((m) => m.role === "assistant")?.index

    if (lastAssistantIndex === undefined) return

    setMessages((prev) => {
      const copy = [...prev]
      copy[lastAssistantIndex] = { ...copy[lastAssistantIndex], content: "", isLoading: true }
      return copy
    })

    try {
      const aiResponse = await sendMessageToAI(lastUserMessage.content)
      setMessages((prev) => {
        const copy = [...prev]
        copy[lastAssistantIndex] = {
          ...copy[lastAssistantIndex],
          content: aiResponse,
          isLoading: false,
        }
        return copy
      })
    } catch {
      setMessages((prev) => {
        const copy = [...prev]
        copy[lastAssistantIndex] = {
          ...copy[lastAssistantIndex],
          content: "Erro ao responder. Tente novamente.",
          isLoading: false,
        }
        return copy
      })
    }
  }

  function clearMessages() {
    setMessages([])
  }

  return {
    messages,
    input,
    setInput,
    sendMessage,
    regenerateLastMessage,
    editMessage,
    clearMessages,
    hasMessages,
    bottomRef,
  }
}
