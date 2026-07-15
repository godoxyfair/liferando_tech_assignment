import { createStore } from 'zustand/vanilla'
import type { OnboardingApplication, OnboardingConfig } from '../onboarding.types'

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

export enum ResumeStatus {
  Idle = 'idle',
  Loading = 'loading',
  Ready = 'ready',
  Error = 'error',
}

export interface OnboardingState {
  config: OnboardingConfig | null
  configStatus: ConfigStatus
  configError: string | null
  submitStatus: SubmitStatus
  submitError: string | null
  applicationId: string | null
  resumeStatus: ResumeStatus
  resumeError: string | null
  prefillApplication: OnboardingApplication | null

  setConfigStatus: (status: ConfigStatus, error?: string | null) => void
  setConfig: (config: OnboardingConfig) => void
  setSubmitStatus: (status: SubmitStatus, error?: string | null) => void
  setApplicationId: (id: string) => void
  setResumeStatus: (status: ResumeStatus, error?: string | null) => void
  setPrefillApplication: (application: OnboardingApplication) => void
}

const createInitialState = () => ({
  config: null,
  configStatus: ConfigStatus.Idle,
  configError: null,
  submitStatus: SubmitStatus.Idle,
  submitError: null,
  applicationId: null,
  resumeStatus: ResumeStatus.Idle,
  resumeError: null,
  prefillApplication: null,
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

  setResumeStatus: (resumeStatus, resumeError = null) =>
    set({ resumeStatus, resumeError }),

  setPrefillApplication: (prefillApplication) =>
    set({
      prefillApplication,
      resumeStatus: ResumeStatus.Ready,
      resumeError: null,
    }),
}))
