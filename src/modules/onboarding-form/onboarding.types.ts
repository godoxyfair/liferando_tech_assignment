// Server contract for the Courier Onboarding mock API (public/server.mjs).

export type VehicleTypeId = 'bicycle' | 'ebike' | 'scooter' | 'car'

export type DocumentTypeId =
  | 'id_document'
  | 'drivers_license'
  | 'vehicle_insurance'
  | 'vehicle_registration'

export interface VehicleType {
  id: VehicleTypeId
  label: string
  requiredDocuments: DocumentTypeId[]
}

export interface DocumentMeta {
  label: string
}

export interface OnboardingConfig {
  vehicleTypes: VehicleType[]
  documents: Record<DocumentTypeId, DocumentMeta>
  cities: string[]
}

export interface PersonalDetails {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
}

export interface Eligibility {
  city: string
  vehicleType: VehicleTypeId
}

export interface DocumentEntry {
  type: DocumentTypeId
  number: string
}

export interface OnboardingApplication {
  applicationId: string
  personal: PersonalDetails
  eligibility: Eligibility
  documents: DocumentEntry[]
}

export type SubmitPayload = Omit<OnboardingApplication, 'applicationId'>

export interface SubmitResponse {
  status: 'submitted'
  applicationId: string
}

// 422/409 error bodies carry dot-path field errors, e.g.
export interface ServerFieldError {
  field: string
  message: string
}

export interface ServerErrorBody {
  message?: string
  errors?: ServerFieldError[]
}
