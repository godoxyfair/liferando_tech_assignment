import { describe, expect, it } from 'vitest'
import { mapServerErrorToStep } from '../utils/errors'

describe('mapServerErrorToStep', () => {
  it('maps each field prefix to the step that owns it', () => {
    expect(mapServerErrorToStep('personal.email')).toBe(0)
    expect(mapServerErrorToStep('personal.dateOfBirth')).toBe(0)
    expect(mapServerErrorToStep('eligibility.city')).toBe(1)
    expect(mapServerErrorToStep('documents.drivers_license.number')).toBe(2)
  })

  it('returns null for a field it cannot attribute to a step', () => {
    expect(mapServerErrorToStep('unknown.field')).toBeNull()
    expect(mapServerErrorToStep('')).toBeNull()
  })
})
