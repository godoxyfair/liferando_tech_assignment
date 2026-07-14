import { describe, expect, it } from 'vitest'
import { testConfig } from '@/test/moks/onboarding-config'
import { createDefaultFormValues } from '../onboarding.form-model'
import type { OnboardingFormValues } from '../onboarding.form-model'
import { toSubmitPayload } from '../utils/payload'

function formWith(
  overrides: Partial<OnboardingFormValues>,
): OnboardingFormValues {
  return { ...createDefaultFormValues(), ...overrides }
}

describe('toSubmitPayload', () => {
  it('emits only the documents the chosen vehicle requires', () => {
    const values = formWith({
      eligibility: { city: 'Berlin', vehicleType: 'bicycle' },
      documents: {
        id_document: { number: 'ID-1' },
        drivers_license: { number: 'DL-9' },
        vehicle_insurance: { number: '' },
        vehicle_registration: { number: '' },
      },
    })

    const payload = toSubmitPayload(values, testConfig)

    expect(payload.documents).toEqual([{ type: 'id_document', number: 'ID-1' }])
    expect(payload.eligibility).toEqual({
      city: 'Berlin',
      vehicleType: 'bicycle',
    })
  })

  it('preserves overlapping document numbers across a vehicle change', () => {
    const values = formWith({
      eligibility: { city: 'Berlin', vehicleType: 'car' },
      documents: {
        id_document: { number: 'ID-1' },
        drivers_license: { number: 'DL-9' },
        vehicle_insurance: { number: 'INS-5' },
        vehicle_registration: { number: 'REG-3' },
      },
    })

    expect(toSubmitPayload(values, testConfig).documents).toEqual([
      { type: 'id_document', number: 'ID-1' },
      { type: 'drivers_license', number: 'DL-9' },
      { type: 'vehicle_insurance', number: 'INS-5' },
      { type: 'vehicle_registration', number: 'REG-3' },
    ])
  })

  it('trims whitespace from document numbers', () => {
    const values = formWith({
      eligibility: { city: 'Berlin', vehicleType: 'bicycle' },
      documents: {
        id_document: { number: '  ID-1  ' },
        drivers_license: { number: '' },
        vehicle_insurance: { number: '' },
        vehicle_registration: { number: '' },
      },
    })

    expect(toSubmitPayload(values, testConfig).documents).toEqual([
      { type: 'id_document', number: 'ID-1' },
    ])
  })
})
