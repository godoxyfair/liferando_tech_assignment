export interface StepperProps {
  labels: string[]
  completed?: boolean[]
  invalid?: boolean[]
  onStepSelect?: (step: number) => void
}
