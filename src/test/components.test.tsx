import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ChatInput } from '../components/chat/ChatInput'
import { ChatEmptyState } from '../components/chat/ChatEmptyState'
import { ChatHeader } from '../components/chat/ChatHeader'
import { MessageRow } from '../components/chat/MessageRow'
import type { Message } from '../types'

// ── ChatInput ────────────────────────────────────────────────────────────────

describe('ChatInput', () => {
  it('renderiza o placeholder corretamente', () => {
    render(<ChatInput input="" setInput={vi.fn()} onSend={vi.fn()} />)
    expect(screen.getByPlaceholderText('Send a message.')).toBeInTheDocument()
  })

  it('chama setInput ao digitar', async () => {
    const setInput = vi.fn()
    render(<ChatInput input="" setInput={setInput} onSend={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText('Send a message.'), 'a')
    expect(setInput).toHaveBeenCalled()
  })

  it('chama onSend ao pressionar Enter', async () => {
    const onSend = vi.fn()
    render(<ChatInput input="texto" setInput={vi.fn()} onSend={onSend} />)
    await userEvent.type(screen.getByPlaceholderText('Send a message.'), '{Enter}')
    expect(onSend).toHaveBeenCalled()
  })

  it('não chama onSend ao pressionar Enter quando disabled', async () => {
    const onSend = vi.fn()
    render(<ChatInput input="texto" setInput={vi.fn()} onSend={onSend} disabled />)
    await userEvent.type(screen.getByPlaceholderText('Send a message.'), '{Enter}')
    expect(onSend).not.toHaveBeenCalled()
  })

  it('botão de envio fica desabilitado quando input está vazio', () => {
    render(<ChatInput input="" setInput={vi.fn()} onSend={vi.fn()} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('botão de envio fica habilitado quando há texto', () => {
    render(<ChatInput input="texto" setInput={vi.fn()} onSend={vi.fn()} />)
    expect(screen.getByRole('button')).not.toBeDisabled()
  })
})

// ── ChatEmptyState ───────────────────────────────────────────────────────────

describe('ChatEmptyState', () => {
  it('renderiza o título BrainBox', () => {
    render(<ChatEmptyState />)
    expect(screen.getByText('BrainBox')).toBeInTheDocument()
  })

  it('renderiza todos os 5 cards de capacidades', () => {
    render(<ChatEmptyState />)
    expect(screen.getByText(/Remembers what user said/i)).toBeInTheDocument()
    expect(screen.getByText(/follow-up corrections/i)).toBeInTheDocument()
    expect(screen.getByText(/Limited knowledge/i)).toBeInTheDocument()
    expect(screen.getByText(/incorrect information/i)).toBeInTheDocument()
    expect(screen.getByText(/harmful instructions/i)).toBeInTheDocument()
  })
})

// ── ChatHeader ───────────────────────────────────────────────────────────────

describe('ChatHeader', () => {
  it('renderiza o título Health', () => {
    render(<ChatHeader goTo={vi.fn()} />)
    expect(screen.getByText('Health')).toBeInTheDocument()
  })

  it('chama goTo("onboarding") ao clicar no botão voltar', async () => {
    const goTo = vi.fn()
    render(<ChatHeader goTo={goTo} />)
    // Pega o primeiro botão (botão voltar)
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[0])
    expect(goTo).toHaveBeenCalledWith('onboarding')
  })

  it('abre o menu ao clicar nos três pontos', async () => {
    render(<ChatHeader goTo={vi.fn()} onClear={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[buttons.length - 1])
    expect(screen.getByText('Limpar conversa')).toBeInTheDocument()
  })

  it('chama onClear ao clicar em Limpar conversa', async () => {
    const onClear = vi.fn()
    render(<ChatHeader goTo={vi.fn()} onClear={onClear} />)
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[buttons.length - 1])
    await userEvent.click(screen.getByText('Limpar conversa'))
    expect(onClear).toHaveBeenCalled()
  })
})

// ── MessageRow ───────────────────────────────────────────────────────────────

const userMessage: Message = {
  id: '1',
  role: 'user',
  content: 'Olá, como vai?',
  timestamp: new Date(),
}

const assistantMessage: Message = {
  id: '2',
  role: 'assistant',
  content: 'Tudo bem, obrigado!',
  timestamp: new Date(),
}

const loadingMessage: Message = {
  id: '3',
  role: 'assistant',
  content: '',
  timestamp: new Date(),
  isLoading: true,
}

describe('MessageRow — usuário', () => {
  it('renderiza o conteúdo da mensagem do usuário', () => {
    render(<MessageRow message={userMessage} />)
    expect(screen.getByText('Olá, como vai?')).toBeInTheDocument()
  })

  it('entra em modo de edição ao clicar no ícone de editar', async () => {
    render(<MessageRow message={userMessage} onEdit={vi.fn()} />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByDisplayValue('Olá, como vai?')).toBeInTheDocument()
  })

  it('chama onEdit ao confirmar edição com Enter', async () => {
    const onEdit = vi.fn()
    render(<MessageRow message={userMessage} onEdit={onEdit} />)
    await userEvent.click(screen.getByRole('button'))
    const input = screen.getByDisplayValue('Olá, como vai?')
    await userEvent.clear(input)
    await userEvent.type(input, 'nova mensagem{Enter}')
    expect(onEdit).toHaveBeenCalledWith('1', 'nova mensagem')
  })

  it('cancela edição ao pressionar Escape', async () => {
    render(<MessageRow message={userMessage} onEdit={vi.fn()} />)
    await userEvent.click(screen.getByRole('button'))
    await userEvent.keyboard('{Escape}')
    expect(screen.getByText('Olá, como vai?')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Olá, como vai?')).not.toBeInTheDocument()
  })
})

describe('MessageRow — assistente', () => {
  it('renderiza o conteúdo da resposta da IA', () => {
    render(<MessageRow message={assistantMessage} />)
    expect(screen.getByText('Tudo bem, obrigado!')).toBeInTheDocument()
  })

  it('renderiza os dots de loading quando isLoading é true', () => {
    const { container } = render(<MessageRow message={loadingMessage} />)
    const dots = container.querySelectorAll('.animate-bounce')
    expect(dots).toHaveLength(3)
  })

  it('copia o conteúdo ao clicar no botão de copiar', async () => {
    render(<MessageRow message={assistantMessage} />)
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[0])
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Tudo bem, obrigado!')
  })
})
