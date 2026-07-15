import type { StepTransitionProps } from './step-transition.types'
import './step-transition.css'

export function StepTransition({ stepKey, children }: StepTransitionProps) {
  return (
    <div className="step-transition" key={stepKey}>
      {children}
    </div>
  )
}
