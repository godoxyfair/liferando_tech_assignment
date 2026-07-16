import { createStore } from 'zustand/vanilla'
import type { StoreApi } from 'zustand'

export interface StepperState {
  step: number
  count: number
  maxReached: number
  nextStep: () => void
  backToStep: () => void
  goToStep: (step: number) => void
}

export type StepperStore = StoreApi<StepperState>

const clamp = (step: number, count: number) =>
  Math.max(0, Math.min(count - 1, step))

/** A step is reachable once it has been unlocked by reaching it at least once */
export function canReachStep(maxReached: number, step: number): boolean {
  return step <= maxReached
}

export function createStepperStore(
  count: number,
  initialStep = 0,
): StepperStore {
  return createStore<StepperState>()((set) => ({
    step: initialStep,
    count,
    maxReached: initialStep,
    nextStep: () =>
      set((state) => {
        const step = clamp(state.step + 1, state.count)

        return { step, maxReached: Math.max(state.maxReached, step) }
      }),
    backToStep: () =>
      set((state) => ({ step: clamp(state.step - 1, state.count) })),
    goToStep: (step) =>
      set((state) =>
        canReachStep(state.maxReached, step)
          ? { step: clamp(step, state.count) }
          : state,
      ),
  }))
}
