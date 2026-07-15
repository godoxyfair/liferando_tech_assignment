import { useEffect, useRef } from 'react'
import type { StepTransitionProps } from './step-transition.types'
import './step-transition.css'

export function StepTransition({ stepKey, children }: StepTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const legendText = container?.querySelector('legend')?.textContent

    if (legendText) {
      container?.setAttribute('aria-label', legendText)
    }

    container?.focus()
  }, [])

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
