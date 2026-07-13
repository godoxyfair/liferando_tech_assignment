import { createStore } from 'zustand/vanilla'
import type { OnboardingConfig } from '../onboarding.types'

export type OnboardingStatus =
  | 'idle'
  | 'loading' 
  | 'ready' 
  | 'submitting'
  | 'submitted'
  | 'error' 

export interface OnboardingState {
  config: OnboardingConfig | null
  status: OnboardingStatus
  applicationId: string | null
  error: string | null
  setConfig: (config: OnboardingConfig) => void
  setStatus: (status: OnboardingStatus, error?: string | null) => void
  setApplicationId: (id: string) => void
  reset: () => void
}

const createInitialState = () => ({
  config: null as OnboardingConfig | null,
  status: 'idle' as OnboardingStatus,
  applicationId: null as string | null,
  error: null as string | null,
})

export const onboardingStore = createStore<OnboardingState>()((set) => ({
  ...createInitialState(),
  setConfig: (config) => set({ config, status: 'ready' }),
  setStatus: (status, error = null) => set({ status, error }),
  setApplicationId: (applicationId) => set({ applicationId }),
  reset: () => set(createInitialState()),
}))
