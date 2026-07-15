import type {
  OnboardingApplication,
  OnboardingConfig,
} from '../../onboarding.types'

export interface WizardProps {
  config: OnboardingConfig
  prefillApplication?: OnboardingApplication | null
  resumeError?: string | null
}
