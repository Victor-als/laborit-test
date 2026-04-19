import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock assets
vi.mock('../assets/Send.svg', () => ({ default: 'send.svg' }))
vi.mock('../assets/MiniLogo.png', () => ({ default: 'minilogo.png' }))
vi.mock('../assets/Robot.png', () => ({ default: 'robot.png' }))
vi.mock('../assets/RobotBlur.png', () => ({ default: 'robotblur.png' }))
vi.mock('../assets/Logo.png', () => ({ default: 'logo.png' }))

// Mock clipboard API (não existe no jsdom)
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
})
