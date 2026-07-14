import type { FieldPathByValue } from 'react-hook-form'
import type {
  DocumentTypeId,
  PersonalDetails,
  VehicleTypeId,
} from './onboarding.types'

export interface EligibilityFormValues {
  city: string
  vehicleType: VehicleTypeId | ''
}

export type DocumentsFormValues = Record<DocumentTypeId, { number: string }>

export interface OnboardingFormValues {
  personal: PersonalDetails
  eligibility: EligibilityFormValues
  documents: DocumentsFormValues
}

export type FieldName = FieldPathByValue<OnboardingFormValues, string>

export function createDefaultFormValues(): OnboardingFormValues {
  return {
    personal: { firstName: '', lastName: '', email: '', dateOfBirth: '' },
    eligibility: { city: '', vehicleType: '' },
    documents: {
      id_document: { number: '' },
      drivers_license: { number: '' },
      vehicle_insurance: { number: '' },
      vehicle_registration: { number: '' },
    },
  }
}
