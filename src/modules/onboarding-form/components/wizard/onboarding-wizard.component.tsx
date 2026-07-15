import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { StepperProvider } from '@/ui/stepper'
import { STEP_COUNT, Step } from '../../onboarding.constants'
import { createDefaultFormValues } from '../../onboarding.form-model'
import type { OnboardingFormValues } from '../../onboarding.form-model'
import { buildOnboardingSchema } from '../../validation'
import { firstIncompleteStep } from '../../utils/errors'
import { toFormValues } from '../../utils/payload'
import { FormContent } from './form-content.component'
import type { WizardProps } from './onboarding-wizard.types'

export function OnboardingWizard({
  config,
  prefillApplication,
  resumeError,
}: WizardProps) {
  const schema = useMemo(() => buildOnboardingSchema(config), [config])
  const resolver = useMemo(() => yupResolver(schema), [schema])

  const defaultValues = useMemo(
    () =>
      prefillApplication
        ? toFormValues(prefillApplication)
        : createDefaultFormValues(),
    [prefillApplication],
  )

  const initialStep = prefillApplication
    ? firstIncompleteStep(schema, defaultValues)
    : Step.Personal

  const methods = useForm<OnboardingFormValues>({
    defaultValues,
    resolver,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  return (
    <FormProvider {...methods}>
      <StepperProvider count={STEP_COUNT} initialStep={initialStep}>
        <FormContent config={config} resumeError={resumeError} />
      </StepperProvider>
    </FormProvider>
  )
}
