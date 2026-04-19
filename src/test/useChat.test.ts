import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useChat } from '../hooks/useChat'

vi.mock('../services/chat', () => ({
  sendMessageToAI: vi.fn(),
}))


const { sendMessageToAI } = await import('../services/chat')
const mockSendMessageToAI = vi.mocked(sendMessageToAI)

describe('useChat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('inicia com mensagens vazias', () => {
    const { result } = renderHook(() => useChat())
    expect(result.current.messages).toHaveLength(0)
    expect(result.current.hasMessages).toBe(false)
  })

  it('inicia com input vazio', () => {
    const { result } = renderHook(() => useChat())
    expect(result.current.input).toBe('')
  })

  it('atualiza o input corretamente', () => {
    const { result } = renderHook(() => useChat())
    act(() => result.current.setInput('nova mensagem'))
    expect(result.current.input).toBe('nova mensagem')
  })

  it('não envia mensagem se input estiver vazio', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => {
      result.current.setInput('')
      await result.current.sendMessage()
    })
    expect(mockSendMessageToAI).not.toHaveBeenCalled()
    expect(result.current.messages).toHaveLength(0)
  })

  it('não envia mensagem se input tiver só espaços', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => {
      result.current.setInput('   ')
      await result.current.sendMessage()
    })
    expect(mockSendMessageToAI).not.toHaveBeenCalled()
  })

  it('adiciona mensagem do usuário e resposta da IA ao enviar', async () => {
    mockSendMessageToAI.mockResolvedValueOnce('Resposta da IA')
    const { result } = renderHook(() => useChat())

    act(() => result.current.setInput('Olá'))

    await act(async () => {
      await result.current.sendMessage()
    })

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2)
    })

    expect(result.current.messages[0].role).toBe('user')
    expect(result.current.messages[0].content).toBe('Olá')
    expect(result.current.messages[1].role).toBe('assistant')
    expect(result.current.messages[1].content).toBe('Resposta da IA')
    expect(result.current.messages[1].isLoading).toBe(false)
  })

  it('limpa o input após envio', async () => {
    mockSendMessageToAI.mockResolvedValueOnce('ok')
    const { result } = renderHook(() => useChat())

    act(() => result.current.setInput('mensagem'))

    await act(async () => {
      await result.current.sendMessage()
    })

    await waitFor(() => {
      expect(result.current.input).toBe('')
    })
  })

  it('hasMessages é true após envio', async () => {
    mockSendMessageToAI.mockResolvedValueOnce('ok')
    const { result } = renderHook(() => useChat())

    act(() => result.current.setInput('teste'))

    await act(async () => {
      await result.current.sendMessage()
    })

    await waitFor(() => {
      expect(result.current.hasMessages).toBe(true)
    })
  })

  it('mostra mensagem de erro quando IA falha', async () => {
    mockSendMessageToAI.mockRejectedValueOnce(new Error('Falha'))
    const { result } = renderHook(() => useChat())

    act(() => result.current.setInput('Olá'))

    await act(async () => {
      await result.current.sendMessage()
    })

    await waitFor(() => {
      const msgs = result.current.messages
      expect(msgs.length).toBeGreaterThan(0)
    })

    const lastMsg = result.current.messages[result.current.messages.length - 1]
    expect(lastMsg.role).toBe('assistant')
    expect(lastMsg.content).toBe('Erro ao responder. Tente novamente.')
    expect(lastMsg.isLoading).toBe(false)
  })

  it('clearMessages limpa todas as mensagens', async () => {
    mockSendMessageToAI.mockResolvedValueOnce('ok')
    const { result } = renderHook(() => useChat())

    act(() => result.current.setInput('teste'))

    await act(async () => {
      await result.current.sendMessage()
    })

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2)
    })

    act(() => result.current.clearMessages())

    expect(result.current.messages).toHaveLength(0)
    expect(result.current.hasMessages).toBe(false)
  })

  it('editMessage atualiza o conteúdo e busca nova resposta', async () => {
    mockSendMessageToAI.mockResolvedValueOnce('primeira resposta')
    mockSendMessageToAI.mockResolvedValueOnce('resposta editada')
    const { result } = renderHook(() => useChat())

    act(() => result.current.setInput('pergunta original'))

    await act(async () => {
      await result.current.sendMessage()
    })

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2)
    })

    const userMsgId = result.current.messages[0].id

    await act(async () => {
      await result.current.editMessage(userMsgId, 'pergunta editada')
    })

    await waitFor(() => {
      expect(result.current.messages[0].content).toBe('pergunta editada')
      expect(result.current.messages[1].content).toBe('resposta editada')
    })
  })

  it('regenerateLastMessage refaz a última resposta', async () => {
    mockSendMessageToAI.mockResolvedValueOnce('resposta original')
    mockSendMessageToAI.mockResolvedValueOnce('resposta regenerada')
    const { result } = renderHook(() => useChat())

    act(() => result.current.setInput('pergunta'))

    await act(async () => {
      await result.current.sendMessage()
    })

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2)
    })

    await act(async () => {
      await result.current.regenerateLastMessage()
    })

    await waitFor(() => {
      const lastMsg = result.current.messages[result.current.messages.length - 1]
      expect(lastMsg.content).toBe('resposta regenerada')
      expect(lastMsg.isLoading).toBe(false)
    })
  })
})
