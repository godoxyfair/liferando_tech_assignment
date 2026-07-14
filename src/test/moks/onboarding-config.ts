import type { OnboardingConfig } from '@/modules/onboarding-form/onboarding.types'

export const testConfig: OnboardingConfig = {
  vehicleTypes: [
    { id: 'bicycle', label: 'Bicycle', requiredDocuments: ['id_document'] },
    { id: 'ebike', label: 'E-Bike', requiredDocuments: ['id_document'] },
    {
      id: 'scooter',
      label: 'Motor Scooter',
      requiredDocuments: [
        'id_document',
        'drivers_license',
        'vehicle_insurance',
      ],
    },
    {
      id: 'car',
      label: 'Car',
      requiredDocuments: [
        'id_document',
        'drivers_license',
        'vehicle_insurance',
        'vehicle_registration',
      ],
    },
  ],
  documents: {
    id_document: { label: 'ID Document' },
    drivers_license: { label: "Driver's Licence" },
    vehicle_insurance: { label: 'Vehicle Insurance' },
    vehicle_registration: { label: 'Vehicle Registration' },
  },
  cities: ['Berlin', 'Hamburg', 'Faultown'],
}
