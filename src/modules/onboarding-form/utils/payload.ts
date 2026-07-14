import type {
  DocumentEntry,
  OnboardingConfig,
  SubmitPayload,
} from '../onboarding.types'
import type { OnboardingFormValues } from '../onboarding.form-model'
import { getRequiredDocuments } from './documents'

export function toSubmitPayload(
  values: OnboardingFormValues,
  config: OnboardingConfig,
): SubmitPayload {
  const { city, vehicleType } = values.eligibility

  if (!vehicleType) {
    throw new Error('Cannot build a submit payload before a vehicle is chosen.')
  }

  const documents: DocumentEntry[] = getRequiredDocuments(
    config,
    vehicleType,
  ).map((type) => ({
    type,
    number: values.documents[type].number.trim(),
  }))

  return {
    personal: values.personal,
    eligibility: { city, vehicleType },
    documents,
  }
}
