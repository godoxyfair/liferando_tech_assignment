import { useFormContext, useWatch } from 'react-hook-form'
import { FormTextField } from '@/ui/form-fields'
import { getRequiredDocuments } from '../../utils/documents'
import type { OnboardingConfig } from '../../onboarding.types'
import type { OnboardingFormValues } from '../../onboarding.form-model'
import './step.css'

interface DocumentsStepProps {
  config: OnboardingConfig
}

export function DocumentsStep({ config }: DocumentsStepProps) {
  const { control } = useFormContext<OnboardingFormValues>()
  const vehicleType = useWatch<OnboardingFormValues, 'eligibility.vehicleType'>(
    {
      name: 'eligibility.vehicleType',
    },
  )

  const requiredDocuments = getRequiredDocuments(config, vehicleType ?? '')

  if (requiredDocuments.length === 0) {
    return (
      <p className="step__hint">
        Choose a vehicle type in the previous step to see which documents are
        required.
      </p>
    )
  }

  return (
    <fieldset className="step">
      <legend className="step__legend">Required documents</legend>
      {requiredDocuments.map((documentType) => (
        <FormTextField
          control={control}
          key={documentType}
          name={`documents.${documentType}.number`}
          label={`${config.documents[documentType]?.label ?? documentType} number`}
        />
      ))}
    </fieldset>
  )
}
