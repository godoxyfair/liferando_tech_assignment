import { describe, expect, it } from 'vitest'
import { testConfig } from '@/test/moks/onboarding-config'
import { getRequiredDocuments } from '../utils/documents'

describe('getRequiredDocuments', () => {
  it('returns the documents the config declares for the vehicle', () => {
    expect(getRequiredDocuments(testConfig, 'bicycle')).toEqual(['id_document'])
    expect(getRequiredDocuments(testConfig, 'car')).toEqual([
      'id_document',
      'drivers_license',
      'vehicle_insurance',
      'vehicle_registration',
    ])
  })

  it('returns an empty list when no vehicle is chosen yet', () => {
    expect(getRequiredDocuments(testConfig, '')).toEqual([])
  })

  it('returns an empty list for an unknown vehicle id', () => {
    // @ts-expect-error deliberately passing an id absent from the config
    expect(getRequiredDocuments(testConfig, 'hovercraft')).toEqual([])
  })
})
