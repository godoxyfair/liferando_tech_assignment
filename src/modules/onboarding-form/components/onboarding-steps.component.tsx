import { useStepper } from '@/ui/stepper'
import { Step } from '../onboarding.constants'
import { PersonalStep } from './steps/personal-step.component'
import { EligibilityStep } from './steps/eligibility-step.component'
import { DocumentsStep } from './steps/documents-step.component'
import { ReviewStep } from './steps/review-step.component'
import type { OnboardingConfig } from '../onboarding.types'

interface OnboardingStepsProps {
  config: OnboardingConfig
}

export function OnboardingSteps({ config }: OnboardingStepsProps) {
  const { step } = useStepper()

  switch (step) {
    case Step.Personal:
      return <PersonalStep />
    case Step.Eligibility:
      return <EligibilityStep config={config} />
    case Step.Documents:
      return <DocumentsStep config={config} />
    case Step.Review:
      return <ReviewStep config={config} />
    default:
      return null
  }
}
