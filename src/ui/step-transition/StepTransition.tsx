import { useEffect, useRef } from 'react'
import type { StepTransitionProps } from './step-transition.types'
import './step-transition.css'

export function StepTransition({ stepKey, children }: StepTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousStepKey = useRef(stepKey)

  useEffect(() => {
    const container = containerRef.current
    const legendText = container?.querySelector('legend')?.textContent

    if (legendText) {
      container?.setAttribute('aria-label', legendText)
    }

    if (previousStepKey.current !== stepKey) {
      previousStepKey.current = stepKey
      container?.focus()
    }
  }, [stepKey])

  return (
    <div
      className="step-transition"
      key={stepKey}
      ref={containerRef}
      role="group"
      tabIndex={-1}
    >
      {children}
    </div>
  )
}
