import { useStepper } from './hook/useStepper'
import './stepper.css'

interface StepperProps {
  labels: string[]
}

/** Presentational header: renders the step indicators from stepper state.
 *  Use useStepper for handling state
 * */
export function Stepper({ labels }: StepperProps) {
  const { step, completed, canGoTo, goTo } = useStepper()

  return (
    <nav className="stepper" aria-label="Onboarding progress">
      <ol className="stepper__list">
        {labels.map((label, i) => {
          const isActive = i === step
          const isDone = completed[i]
          const reachable = canGoTo(i)

          return (
            <li key={label} className="stepper__item">
              <button
                type="button"
                className="stepper__step"
                data-active={isActive || undefined}
                data-done={isDone || undefined}
                aria-current={isActive ? 'step' : undefined}
                disabled={!reachable}
                onClick={() => goTo(i)}
              >
                <span className="stepper__marker" aria-hidden="true">
                  {isDone ? '✓' : i + 1}
                </span>
                <span className="stepper__label">{label}</span>
                {isDone && <span className="stepper__sr"> (completed)</span>}
                {isActive && <span className="stepper__sr"> (current step)</span>}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
