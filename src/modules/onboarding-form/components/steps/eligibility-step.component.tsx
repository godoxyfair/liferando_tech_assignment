import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormComboBoxField, FormSelectField } from '@/ui/form-fields'
import type { SelectOption } from '@/ui/form-fields'
import type { OnboardingFormValues } from '../../onboarding.form-model'
import type { OnboardingConfig } from '../../onboarding.types'
import './step.css'

interface EligibilityStepProps {
  config: OnboardingConfig
}

export function EligibilityStep({ config }: EligibilityStepProps) {
  const { control } = useFormContext<OnboardingFormValues>()

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
