import { ChevronLeft, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"
import type { AppScreen } from "../../types"

interface Props {
  goTo: (s: AppScreen) => void
  onClear?: () => void
}

export function ChatHeader({ goTo, onClear }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex items-center justify-between px-7 pt-6 pb-4 shrink-0 relative">
      <button
        onClick={() => goTo("onboarding")}
        className="w-9 h-9 rounded-xl bg-[#1c1c1c] flex items-center justify-center hover:bg-[#252525] transition-colors"
      >
        <ChevronLeft size={18} className="text-white" />
      </button>

      <span className="text-white text-xl font-medium">Health</span>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-9 h-9 flex items-center justify-center"
        >
          <MoreHorizontal size={28} className="text-gray-500" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-10 bg-[#232627] border border-[#333] rounded-xl overflow-hidden z-50 min-w-[160px] shadow-xl">
            <button
              onClick={() => {
                onClear?.()
                setMenuOpen(false)
              }}
              className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-[#2e2e2e] transition-colors"
            >
              <Trash2 size={14} />
              Limpar conversa
            </button>
          </div>
        )}
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  )
}
