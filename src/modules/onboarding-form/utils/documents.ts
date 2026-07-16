import type {
  DocumentTypeId,
  OnboardingConfig,
  VehicleTypeId,
} from '../onboarding.types'

export function getRequiredDocuments(
  config: OnboardingConfig,
  vehicleType: VehicleTypeId | '',
): DocumentTypeId[] {
  if (!vehicleType) {
    return []
  }

  const vehicle = config.vehicleTypes.find(
    (option) => option.id === vehicleType,
  )

  return vehicle?.requiredDocuments ?? []
}
