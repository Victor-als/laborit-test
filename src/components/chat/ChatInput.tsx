import SendSvg from "../../assets/Send.svg"

interface Props {
  input: string
  setInput: (v: string) => void
  onSend: () => void
  disabled?: boolean
}

export function ChatInput({ input, setInput, onSend, disabled = false }: Props) {
  return (
    <div className="px-7 pb-8 pt-1 shrink-0">
      <div className={`flex items-center bg-[#232627] rounded-lg border px-4 py-2 gap-3 transition-colors ${
        disabled ? "border-[#444] opacity-60" : "border-[#676767]"
      }`}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !disabled && onSend()}
          placeholder="Send a message."
          disabled={disabled}
          className="flex-1 bg-transparent text-white text-sm placeholder-[#A3A3AB] outline-none disabled:cursor-not-allowed"
        />

        <button
          onClick={onSend}
          disabled={disabled || !input.trim()}
          className="w-8 h-8 flex items-center justify-center hover:bg-[#333] rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <img src={SendSvg} alt="send" />
        </button>
      </div>
    </div>
  )
}
