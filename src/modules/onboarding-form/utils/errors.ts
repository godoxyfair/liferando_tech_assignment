import * as yup from 'yup'
import type { FieldError, FieldErrors } from 'react-hook-form'
import { Step } from '../onboarding.constants'
import type { OnboardingFormValues } from '../onboarding.form-model'
import type { OnboardingSchema, StepSection } from '../validation'

const FIELD_PREFIX_TO_STEP: Record<string, Step> = {
  personal: Step.Personal,
  eligibility: Step.Eligibility,
  documents: Step.Documents,
}

export function mapServerErrorToStep(field: string): Step | null {
  const prefix = field.split('.')[0]

  return prefix in FIELD_PREFIX_TO_STEP ? FIELD_PREFIX_TO_STEP[prefix] : null
}

function isFieldError(node: unknown): node is FieldError {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    typeof (node as FieldError).type === 'string'
  )
}

export function firstErrorFieldPath(
  errors: FieldErrors<OnboardingFormValues>,
  section: StepSection,
): string | null {
  const walk = (node: unknown, path: string): string | null => {
    if (!node || typeof node !== 'object') {
      return null
    }

    if (isFieldError(node)) {
      return path
    }

    for (const [key, child] of Object.entries(node)) {
      const found = walk(child, `${path}.${key}`)

      if (found) {
        return found
      }
    }

    return null
  }

  return walk(errors[section], section)
}

export function incompleteSteps(
  schema: OnboardingSchema,
  values: OnboardingFormValues,
): Set<Step> {
  try {
    schema.validateSync(values, { abortEarly: false })

    return new Set()
  } catch (error) {
    if (!(error instanceof yup.ValidationError)) {
      return new Set([Step.Personal])
    }

    const steps = error.inner
      .map((innerError) => mapServerErrorToStep(innerError.path ?? ''))
      .filter((step): step is Step => step !== null)

    return new Set(steps.length > 0 ? steps : [Step.Personal])
  }
}

export function firstIncompleteStep(
  schema: OnboardingSchema,
  values: OnboardingFormValues,
): Step {
  const incomplete = incompleteSteps(schema, values)

  return incomplete.size > 0 ? (Math.min(...incomplete) as Step) : Step.Review
}
