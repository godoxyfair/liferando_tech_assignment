import { createContext } from 'react'
import type { StepperStore } from './stepper.store'

export const StepperContext = createContext<StepperStore | null>(null)
