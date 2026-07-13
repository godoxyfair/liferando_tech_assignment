import { useContext } from 'react'
import { useStore } from '@/utils/useStore'
import { StepperContext } from '../store/stepper.context'
import { canGoToStep } from '../store/stepper.store'

export interface StepperApi {
  step: number
  count: number
  isFirst: boolean
  isLast: boolean
  completed: boolean[]
  canGoTo: (step: number) => boolean
  next: () => void
  back: () => void
  goTo: (step: number) => void

  complete: (step?: number) => void
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
    completed: state.completed,
    canGoTo: (step) => canGoToStep(state.completed, step),
    next: state.nextStep,
    back: state.backToStep,
    goTo: state.goToStep,
    complete: state.completeStep,
  }
}
