import { createStore } from 'zustand/vanilla'
import type { OnboardingConfig } from '../onboarding.types'

export enum ConfigStatus {
  Idle = 'idle',
  Loading = 'loading',
  Ready = 'ready',
  Error = 'error',
}

export enum SubmitStatus {
  Idle = 'idle',
  Submitting = 'submitting',
  Submitted = 'submitted',
  Error = 'error',
}

export interface OnboardingState {
  config: OnboardingConfig | null
  configStatus: ConfigStatus
  configError: string | null
  submitStatus: SubmitStatus
  submitError: string | null
  applicationId: string | null

  setConfigStatus: (status: ConfigStatus, error?: string | null) => void
  setConfig: (config: OnboardingConfig) => void
  setSubmitStatus: (status: SubmitStatus, error?: string | null) => void
  setApplicationId: (id: string) => void
  reset: () => void
}

const createInitialState = () => ({
  config: null,
  configStatus: ConfigStatus.Idle,
  configError: null,
  submitStatus: SubmitStatus.Idle,
  submitError: null,
  applicationId: null,
})

export const onboardingStore = createStore<OnboardingState>()((set) => ({
  ...createInitialState(),

  setConfigStatus: (configStatus, configError = null) =>
    set({ configStatus, configError }),

  setConfig: (config) =>
    set({ config, configStatus: ConfigStatus.Ready, configError: null }),

  setSubmitStatus: (submitStatus, submitError = null) =>
    set({ submitStatus, submitError }),

  setApplicationId: (applicationId) => set({ applicationId }),

  reset: () => set(createInitialState()),
}))
