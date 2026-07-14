import { useStepper } from '@/ui/stepper'
import { PersonalStep } from './steps/personal-step.component'
import { EligibilityStep } from './steps/eligibility-step.component'
import { DocumentsStep } from './steps/documents-step.component'
import type { OnboardingConfig } from '../onboarding.types'

interface OnboardingStepsProps {
  config: OnboardingConfig
}

export function OnboardingSteps({ config }: OnboardingStepsProps) {
  const { step } = useStepper()

  switch (step) {
    case 0:
      return <PersonalStep />
    case 1:
      return <EligibilityStep config={config} />
    case 2:
      return <DocumentsStep config={config} />
    default:
      return null
  }
}
