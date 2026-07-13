import { useRef } from 'react'
import type { ReactNode } from 'react'
import { StepperContext } from './store/stepper.context'
import { createStepperStore } from './store/stepper.store'
import type { StepperStore } from './store/stepper.store'

interface StepperProviderProps {
  count: number
  children: ReactNode
}

export function StepperProvider({ count, children }: StepperProviderProps) {
  const storeRef = useRef<StepperStore | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createStepperStore(count)
  }

  return (
    <StepperContext.Provider value={storeRef.current}>
      {children}
    </StepperContext.Provider>
  )
}
