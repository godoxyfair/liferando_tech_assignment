import { Step } from '../onboarding.constants'

const FIELD_PREFIX_TO_STEP: Record<string, Step> = {
  personal: Step.Personal,
  eligibility: Step.Eligibility,
  documents: Step.Documents,
}

export function mapServerErrorToStep(field: string): Step | null {
  const prefix = field.split('.')[0]

  return prefix in FIELD_PREFIX_TO_STEP ? FIELD_PREFIX_TO_STEP[prefix] : null
}
