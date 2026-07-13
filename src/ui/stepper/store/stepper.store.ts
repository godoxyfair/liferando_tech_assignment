import { createStore } from 'zustand/vanilla'
import type { StoreApi } from 'zustand'

export interface StepperState {
  step: number
  count: number
  completed: boolean[]
  nextStep: () => void
  backToStep: () => void
  goToStep: (step: number) => void
  completeStep: (step?: number) => void
  reset: () => void
}

export type StepperStore = StoreApi<StepperState>

const clamp = (step: number, count: number) =>
  Math.max(0, Math.min(count - 1, step))

export function canGoToStep(completed: boolean[], step: number): boolean {
  return step === 0 || completed.slice(0, step).every(Boolean)
}

export function createStepperStore(count: number): StepperStore {
  return createStore<StepperState>()((set) => ({
    step: 0,
    count,
    completed: Array(count).fill(false),
    nextStep: () => set((s) => ({ step: clamp(s.step + 1, s.count) })),
    backToStep: () => set((s) => ({ step: clamp(s.step - 1, s.count) })),
    goToStep: (step) =>
      set((s) =>
        canGoToStep(s.completed, step) ? { step: clamp(step, s.count) } : s,
      ),
    completeStep: (step) =>
      set((s) => {
        const i = step ?? s.step
        if (s.completed[i]) return s
        const completed = s.completed.slice()
        completed[i] = true
        return { completed }
      }),
    reset: () =>
      set((s) => ({ step: 0, completed: Array(s.count).fill(false) })),
  }))
}
