import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { StepperProvider } from '@/ui/stepper'
import { STEP_COUNT } from '../../onboarding.constants'
import { createDefaultFormValues } from '../../onboarding.form-model'
import type { OnboardingFormValues } from '../../onboarding.form-model'
import { buildOnboardingSchema } from '../../validation'
import { FormContent } from './form-content.component'
import type { WizardProps } from './onboarding-wizard.types'

export function OnboardingWizard({ config }: WizardProps) {
  const resolver = useMemo(
    () =>
      yupResolver(
        buildOnboardingSchema(config),
      ) as Resolver<OnboardingFormValues>,
    [config],
  )

  const methods = useForm<OnboardingFormValues>({
    defaultValues: createDefaultFormValues(),
    resolver,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  return (
    <FormProvider {...methods}>
      <StepperProvider count={STEP_COUNT}>
        <FormContent config={config} />
      </StepperProvider>
    </FormProvider>
  )
}
