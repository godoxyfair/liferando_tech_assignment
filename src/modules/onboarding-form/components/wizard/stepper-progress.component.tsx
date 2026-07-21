import { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Stepper, useStepper } from '@/ui/stepper'
import { STEP_LABELS } from '../../onboarding.constants'
import type { OnboardingFormValues } from '../../onboarding.form-model'
import { STEP_SECTIONS } from '../../validation'
import type { OnboardingSchema } from '../../validation'
import { incompleteSteps } from '../../utils/errors'

interface StepperProgressProps {
  schema: OnboardingSchema
}

export function StepperProgress({ schema }: StepperProgressProps) {
  const { maxReached } = useStepper()
  const { formState } = useFormContext<OnboardingFormValues>()

  const formValues = useWatch<OnboardingFormValues>()
  const incomplete = useMemo(
    () => incompleteSteps(schema, formValues as OnboardingFormValues),
    [schema, formValues],
  )

  const completedSteps = STEP_LABELS.map((_, index) => {
    const section = STEP_SECTIONS[index]

    return (
      index < maxReached &&
      (!section || (!incomplete.has(index) && !formState.errors[section]))
    )
  })

  const invalidSteps = STEP_LABELS.map((_, index) => {
    const section = STEP_SECTIONS[index]

    return index <= maxReached && !!section && !!formState.errors[section]
  })

  return (
    <Stepper
      labels={[...STEP_LABELS]}
      completed={completedSteps}
      invalid={invalidSteps}
    />
  )
}
