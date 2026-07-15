import * as yup from 'yup'
import { Step } from '../onboarding.constants'
import type { OnboardingFormValues } from '../onboarding.form-model'
import type { OnboardingSchema } from '../validation'

const FIELD_PREFIX_TO_STEP: Record<string, Step> = {
  personal: Step.Personal,
  eligibility: Step.Eligibility,
  documents: Step.Documents,
}

export function mapServerErrorToStep(field: string): Step | null {
  const prefix = field.split('.')[0]

  return prefix in FIELD_PREFIX_TO_STEP ? FIELD_PREFIX_TO_STEP[prefix] : null
}

export function firstIncompleteStep(
  schema: OnboardingSchema,
  values: OnboardingFormValues,
): Step {
  try {
    schema.validateSync(values, { abortEarly: false })

    return Step.Review
  } catch (error) {
    if (!(error instanceof yup.ValidationError)) {
      return Step.Personal
    }

    const steps = error.inner
      .map((innerError) => mapServerErrorToStep(innerError.path ?? ''))
      .filter((step): step is Step => step !== null)

    return steps.length > 0 ? Math.min(...steps) : Step.Personal
  }
}
