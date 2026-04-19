import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useScreen } from '../hooks/useScreen'

describe('useScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('inicia na tela splash', () => {
    const { result } = renderHook(() => useScreen())
    expect(result.current.screen).toBe('splash')
  })

  it('muda para onboarding após 2200ms', () => {
    const { result } = renderHook(() => useScreen())
    expect(result.current.screen).toBe('splash')
    act(() => vi.advanceTimersByTime(2200))
    expect(result.current.screen).toBe('onboarding')
  })

  it('não muda antes de 2200ms', () => {
    const { result } = renderHook(() => useScreen())
    act(() => vi.advanceTimersByTime(2199))
    expect(result.current.screen).toBe('splash')
  })

  it('goTo muda a tela corretamente', () => {
    const { result } = renderHook(() => useScreen())
    act(() => result.current.goTo('chat'))
    expect(result.current.screen).toBe('chat')
  })

  it('goTo pode ir para qualquer tela', () => {
    const { result } = renderHook(() => useScreen())
    act(() => result.current.goTo('onboarding'))
    expect(result.current.screen).toBe('onboarding')
    act(() => result.current.goTo('chat'))
    expect(result.current.screen).toBe('chat')
    act(() => result.current.goTo('splash'))
    expect(result.current.screen).toBe('splash')
  })
})
