import { useState } from 'react'
import type { ReactNode } from 'react'
import { StepperContext } from './store/stepper.context'
import { createStepperStore } from './store/stepper.store'

interface StepperProviderProps {
  count: number
  initialStep?: number
  children: ReactNode
}

export function StepperProvider({
  count,
  initialStep,
  children,
}: StepperProviderProps) {
  const [store] = useState(() => createStepperStore(count, initialStep))

  return (
    <StepperContext.Provider value={store}>{children}</StepperContext.Provider>
  )
}
