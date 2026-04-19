export type AppScreen = 'splash' | 'onboarding' | 'chat'
export type Role = 'user' | 'assistant'

export interface Message {
  id: string
  role: Role
  content: string
  timestamp: Date
  isLoading?: boolean
}

export interface OnboardingSlide {
  title: string
  description: string
}
