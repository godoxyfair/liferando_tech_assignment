import { useIsMobile } from '@/utils/useIsMobile'
import { useStepper } from './hook/useStepper'
import type { StepperProps } from './Stepper.types'
import './stepper.css'
/** Presentational header: renders the step indicators from stepper state.
 *  Use useStepper for handling navigation state
 * */
export function Stepper({
  labels,
  completed = [],
  invalid = [],
}: StepperProps) {
  const { step, canGoTo, goTo } = useStepper()
  const isMobile = useIsMobile()

  if (isMobile) {
    const nextLabel = step < labels.length - 1 ? labels[step + 1] : undefined

    return (
      <nav className="stepper stepper--mobile" aria-label="Onboarding progress">
        <span
          className="stepper__ring"
          data-status={invalid[step] ? 'error' : undefined}
          aria-hidden="true"
        >
          {step + 1}/{labels.length}
        </span>
        <span className="stepper__mobile-info">
          <span className="stepper__mobile-title">{labels[step]}</span>
          {nextLabel && (
            <span className="stepper__mobile-next">Next: {nextLabel}</span>
          )}
        </span>
      </nav>
    )
  }

  return (
    <nav className="stepper" aria-label="Onboarding progress">
      <ol className="stepper__list">
        {labels.map((label, index) => {
          const isActive = index === step
          const isDone = completed[index]
          const reachable = canGoTo(index)

          return (
            <li key={label} className="stepper__item">
              <button
                type="button"
                className="stepper__step"
                data-active={isActive || undefined}
                data-done={isDone || undefined}
                data-status={invalid[index] ? 'error' : undefined}
                aria-current={isActive ? 'step' : undefined}
                disabled={!reachable}
                onClick={() => goTo(index)}
              >
                <span className="stepper__marker" aria-hidden="true">
                  {isDone ? '✓' : index + 1}
                </span>
                <span className="stepper__label">{label}</span>
                {isDone && <span className="stepper__sr"> (completed)</span>}
                {isActive && (
                  <span className="stepper__sr"> (current step)</span>
                )}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
