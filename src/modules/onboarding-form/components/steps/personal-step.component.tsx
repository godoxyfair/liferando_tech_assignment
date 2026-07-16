import { useFormContext } from 'react-hook-form'
import { FormTextField, FormDateField } from '@/ui/form-fields'
import type { OnboardingFormValues } from '../../onboarding.form-model'
import './step.css'

export function PersonalStep() {
  const { control } = useFormContext<OnboardingFormValues>()

  return (
    <fieldset className="step">
      <legend className="step__legend">Your details</legend>
      <FormTextField
        control={control}
        name="personal.firstName"
        label="First name"
        autocomplete="given-name"
      />
      <FormTextField
        control={control}
        name="personal.lastName"
        label="Last name"
        autocomplete="family-name"
      />
      <FormTextField
        control={control}
        name="personal.email"
        label="Email address"
        type="email"
        inputmode="email"
        autocomplete="email"
      />
      <FormDateField
        control={control}
        name="personal.dateOfBirth"
        label="Date of birth"
        autocomplete="bday"
      />
    </fieldset>
  )
}
