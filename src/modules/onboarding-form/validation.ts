import * as yup from 'yup'
import type { Path } from 'react-hook-form'
import type {
  DocumentTypeId,
  OnboardingConfig,
  VehicleTypeId,
} from './onboarding.types'
import type { OnboardingFormValues } from './onboarding.form-model'
import { getRequiredDocuments } from './utils/documents'

const MIN_AGE = 18

function ageFrom(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth)
  if (Number.isNaN(dob.getTime())) {
    return NaN
  }

  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  const monthDelta = now.getMonth() - dob.getMonth()
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < dob.getDate())) {
    age--
  }

  return age
}

function documentEntrySchema(isRequired: boolean) {
  const number = isRequired
    ? yup.string().trim().required('Please enter this document number.')
    : yup.string().trim().defined()

  return yup.object({ number })
}

function documentsShapeFor(
  config: OnboardingConfig,
  vehicleType: VehicleTypeId | '',
) {
  const requiredDocuments = getRequiredDocuments(config, vehicleType)
  const entry = (documentType: DocumentTypeId) =>
    documentEntrySchema(requiredDocuments.includes(documentType))

  return {
    id_document: entry('id_document'),
    drivers_license: entry('drivers_license'),
    vehicle_insurance: entry('vehicle_insurance'),
    vehicle_registration: entry('vehicle_registration'),
  }
}

function documentsSchema(config: OnboardingConfig) {
  return yup
    .object(documentsShapeFor(config, ''))
    .when(['eligibility'], ([eligibility]) =>
      yup.object(documentsShapeFor(config, eligibility?.vehicleType ?? '')),
    )
}

export function buildOnboardingSchema(
  config: OnboardingConfig,
): yup.ObjectSchema<OnboardingFormValues> {
  const vehicleIds = config.vehicleTypes.map((vehicle) => vehicle.id)

  return yup.object({
    personal: yup.object({
      firstName: yup.string().trim().required('First name is required.'),
      lastName: yup.string().trim().required('Last name is required.'),
      email: yup
        .string()
        .trim()
        .email('Enter a valid email address.')
        .required('Email is required.'),
      dateOfBirth: yup
        .string()
        .required('Date of birth is required.')
        .test(
          'is-a-date',
          'Enter a valid date.',
          (value) => !Number.isNaN(new Date(value ?? '').getTime()),
        )
        .test(
          'min-age',
          `You must be at least ${MIN_AGE} years old.`,
          (value) => ageFrom(value ?? '') >= MIN_AGE,
        ),
    }),
    eligibility: yup.object({
      city: yup
        .string()
        .required('City is required.')
        .oneOf(config.cities, 'Choose a city from the list.'),
      vehicleType: yup
        .string()
        .required('Vehicle type is required.')
        .oneOf(vehicleIds, 'Choose a vehicle type.'),
    }),
    documents: documentsSchema(config),
  })
}

export type OnboardingSchema = ReturnType<typeof buildOnboardingSchema>

export const STEP_FIELDS = [
  [
    'personal.firstName',
    'personal.lastName',
    'personal.email',
    'personal.dateOfBirth',
  ],
  ['eligibility.city', 'eligibility.vehicleType'],
  ['documents'],
] as const satisfies ReadonlyArray<ReadonlyArray<Path<OnboardingFormValues>>>

export const STEP_SECTIONS = ['personal', 'eligibility', 'documents'] as const

export type StepSection = (typeof STEP_SECTIONS)[number]
