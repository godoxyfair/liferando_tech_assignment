import type {
  DocumentEntry,
  OnboardingApplication,
  OnboardingConfig,
  SubmitPayload,
} from '../onboarding.types'
import {
  createDefaultFormValues,
  type OnboardingFormValues,
} from '../onboarding.form-model'
import { getRequiredDocuments } from './documents'

/**Sanitasin DTO request object for documents */
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

export function toFormValues(
  application: OnboardingApplication,
): OnboardingFormValues {
  const documents = createDefaultFormValues().documents

  for (const entry of application.documents) {
    documents[entry.type] = { number: entry.number }
  }

  return {
    personal: application.personal,
    eligibility: application.eligibility,
    documents,
  }
}
