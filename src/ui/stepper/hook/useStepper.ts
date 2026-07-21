import { useContext } from 'react'
import { useStore } from 'zustand'
import { StepperContext } from '../store/stepper.context'
import { canReachStep } from '../store/stepper.store'

export interface StepperApi {
  step: number
  count: number
  isFirst: boolean
  isLast: boolean
  maxReached: number
  canGoTo: (step: number) => boolean
  next: () => void
  back: () => void
  goTo: (step: number) => void
}

export function useStepper(): StepperApi {
  const store = useContext(StepperContext)
  if (!store) {
    throw new Error('useStepper must be used within <StepperProvider>')
  }

  const state = useStore(store)

  return {
    step: state.step,
    count: state.count,
    isFirst: state.step === 0,
    isLast: state.step === state.count - 1,
    maxReached: state.maxReached,
    canGoTo: (step) => canReachStep(state.maxReached, step),
    next: state.nextStep,
    back: state.backToStep,
    goTo: state.goToStep,
  }
}
