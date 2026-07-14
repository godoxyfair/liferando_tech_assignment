import { useState } from 'react'
import type { ReactNode } from 'react'
import { StepperContext } from './store/stepper.context'
import { createStepperStore } from './store/stepper.store'

interface StepperProviderProps {
  count: number
  children: ReactNode
}

export function StepperProvider({ count, children }: StepperProviderProps) {
  const [store] = useState(() => createStepperStore(count))

  return (
    <StepperContext.Provider value={store}>{children}</StepperContext.Provider>
  )
}
