import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendMessageToAI } from '../services/chat'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('sendMessageToAI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retorna a resposta da IA em sucesso', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: 'Resposta da IA' } }],
      }),
    })

    const result = await sendMessageToAI('Olá')
    expect(result).toBe('Resposta da IA')
  })

  it('retorna "Sem resposta." quando choices está vazio', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ choices: [] }),
    })

    const result = await sendMessageToAI('Olá')
    expect(result).toBe('Sem resposta.')
  })

  it('retorna mensagem de erro quando API retorna status não ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: 'Unauthorized' } }),
    })

    const result = await sendMessageToAI('Olá')
    expect(result).toBe('Erro ao conectar com a IA.')
  })

  it('retorna mensagem de erro quando fetch lança exceção', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const result = await sendMessageToAI('Olá')
    expect(result).toBe('Erro ao conectar com a IA.')
  })

  it('envia o conteúdo correto no body da requisição', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: 'ok' } }],
      }),
    })

    await sendMessageToAI('minha pergunta')

    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    const userMsg = body.messages.find((m: { role: string }) => m.role === 'user')
    expect(userMsg.content).toBe('minha pergunta')
  })
})
