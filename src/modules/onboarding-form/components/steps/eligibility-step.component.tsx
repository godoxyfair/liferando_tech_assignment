import { useEffect, useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { FormComboBoxField, FormSelectField } from '@/ui/form-fields'
import type { SelectOption } from '@/ui/form-fields'
import { getRequiredDocuments } from '../../utils/documents'
import type { OnboardingFormValues } from '../../onboarding.form-model'
import type { DocumentTypeId, OnboardingConfig } from '../../onboarding.types'
import './step.css'

interface EligibilityStepProps {
  config: OnboardingConfig
}

export function EligibilityStep({ config }: EligibilityStepProps) {
  const { control, clearErrors } = useFormContext<OnboardingFormValues>()
  const vehicleType = useWatch<OnboardingFormValues, 'eligibility.vehicleType'>(
    {
      name: 'eligibility.vehicleType',
    },
  )

  useEffect(() => {
    const requiredDocuments = getRequiredDocuments(config, vehicleType ?? '')
    const allDocumentTypes = Object.keys(config.documents) as DocumentTypeId[]

    for (const documentType of allDocumentTypes) {
      if (!requiredDocuments.includes(documentType)) {
        clearErrors(`documents.${documentType}.number`)
      }
    }
  }, [vehicleType, config, clearErrors])

  const cityOptions = useMemo<SelectOption[]>(
    () => config.cities.map((city) => ({ value: city, label: city })),
    [config.cities],
  )

  const vehicleOptions: SelectOption[] = config.vehicleTypes.map((vehicle) => ({
    value: vehicle.id,
    label: vehicle.label,
  }))

  return (
    <fieldset className="step">
      <legend className="step__legend">Where and how you'll ride</legend>
      <FormComboBoxField
        control={control}
        name="eligibility.city"
        label="City"
        options={cityOptions}
        placeholder="Search your city…"
        emptyMessage="No city matches your search"
      />
      <FormSelectField
        control={control}
        name="eligibility.vehicleType"
        label="Vehicle type"
        options={vehicleOptions}
        placeholder="Select a vehicle…"
      />
    </fieldset>
  )
}
