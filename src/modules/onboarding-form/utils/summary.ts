import type { DeepPartialSkipArrayKey } from 'react-hook-form'
import type { OnboardingConfig } from '../onboarding.types'
import type { OnboardingFormValues } from '../onboarding.form-model'
import { getRequiredDocuments } from './documents'
import { formatDate } from './format-date'

export function buildSummaryItems(
  config: OnboardingConfig,
  values: DeepPartialSkipArrayKey<OnboardingFormValues>,
) {
  const { personal, eligibility, documents } = values

  const vehicleLabel = config.vehicleTypes.find(
    (vehicle) => vehicle.id === eligibility?.vehicleType,
  )?.label

  const requiredDocuments = getRequiredDocuments(
    config,
    eligibility?.vehicleType ?? '',
  )

  return [
    { term: 'First name', description: personal?.firstName },
    { term: 'Last name', description: personal?.lastName },
    { term: 'Email', description: personal?.email },
    {
      term: 'Date of birth',
      description: personal?.dateOfBirth && formatDate(personal.dateOfBirth),
    },
    { term: 'City', description: eligibility?.city },
    { term: 'Vehicle type', description: vehicleLabel },
    ...requiredDocuments.map((documentType) => ({
      term: config.documents[documentType]?.label ?? documentType,
      description: documents?.[documentType]?.number,
    })),
  ]
}
