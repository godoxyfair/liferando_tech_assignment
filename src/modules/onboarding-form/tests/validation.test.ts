import { describe, expect, it } from 'vitest'
import { testConfig } from '@/test/moks/onboarding-config'
import { createDefaultFormValues } from '../onboarding.form-model'
import type { OnboardingFormValues } from '../onboarding.form-model'
import { buildOnboardingSchema } from '../validation'

const schema = buildOnboardingSchema(testConfig)

function validValues(): OnboardingFormValues {
  return {
    personal: {
      firstName: 'Mara',
      lastName: 'Voss',
      email: 'mara@example.com',
      dateOfBirth: '1996-04-12',
    },
    eligibility: { city: 'Berlin', vehicleType: 'bicycle' },
    documents: {
      id_document: { number: 'ID-1' },
      drivers_license: { number: '' },
      vehicle_insurance: { number: '' },
      vehicle_registration: { number: '' },
    },
  }
}

async function errorPaths(values: OnboardingFormValues): Promise<string[]> {
  try {
    await schema.validate(values, { abortEarly: false })

    return []
  } catch (err) {
    return (err as { inner: { path?: string }[] }).inner
      .map((error) => error.path ?? '')
      .sort()
  }
}

describe('buildOnboardingSchema', () => {
  it('accepts a well-formed application', async () => {
    await expect(schema.validate(validValues())).resolves.toBeDefined()
  })

  it('requires only the documents the chosen vehicle needs', async () => {
    const bicycle = validValues()
    bicycle.documents.id_document.number = ''
    expect(await errorPaths(bicycle)).toEqual(['documents.id_document.number'])
  })

  it('requires the extra documents once a car is selected', async () => {
    const car = createDefaultFormValues()
    car.personal = validValues().personal
    car.eligibility = { city: 'Berlin', vehicleType: 'car' }
    expect(await errorPaths(car)).toEqual([
      'documents.drivers_license.number',
      'documents.id_document.number',
      'documents.vehicle_insurance.number',
      'documents.vehicle_registration.number',
    ])
  })

  it('rejects applicants under 18', async () => {
    const tooYoung = validValues()
    tooYoung.personal.dateOfBirth = '2020-01-01'
    expect(await errorPaths(tooYoung)).toContain('personal.dateOfBirth')
  })
})
