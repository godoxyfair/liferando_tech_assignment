import { useStepper } from './hook/useStepper'
import './stepper.css'

interface StepperProps {
  labels: string[]
  completed?: boolean[]
}

/** Presentational header: renders the step indicators from stepper state.
 *  Use useStepper for handling navigation state
 * */
export function Stepper({ labels, completed = [] }: StepperProps) {
  const { step, canGoTo, goTo } = useStepper()

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
