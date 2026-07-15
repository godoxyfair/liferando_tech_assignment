import { useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import type { FieldErrors, Path } from 'react-hook-form'
import { useStore } from '@/utils/useStore'
import { useStepper } from '@/ui/stepper'
import { onboardingFormService } from '../service/onboarding.form-service'
import type { Step } from '../onboarding.constants'
import { STEP_SECTIONS } from '../validation'
import { firstErrorFieldPath, mapServerErrorToStep } from '../utils/errors'
import { toSubmitPayload } from '../utils/payload'
import type { OnboardingConfig, ServerFieldError } from '../onboarding.types'
import type { OnboardingFormValues } from '../onboarding.form-model'

export function useOnboardingSubmit(config: OnboardingConfig) {
  const { handleSubmit, setError, setFocus } =
    useFormContext<OnboardingFormValues>()

  const { goTo, step } = useStepper()

  const { submitStatus, submitError, applicationId } = useStore(
    onboardingFormService.store,
  )

  const pendingFocusField = useRef<Path<OnboardingFormValues> | null>(null)

  useEffect(() => {
    const fieldToFocus = pendingFocusField.current

    if (!fieldToFocus) {
      return
    }

    pendingFocusField.current = null
    setFocus(fieldToFocus)
  }, [step, setFocus])

  const applyFieldErrors = (errors: ServerFieldError[]) => {
    for (const { field, message } of errors) {
      setError(field as Path<OnboardingFormValues>, {
        type: 'server',
        message,
      })
    }

    const mappedErrors = errors
      .map(({ field }) => ({ field, step: mapServerErrorToStep(field) }))
      .filter(
        (mapped): mapped is { field: string; step: Step } =>
          mapped.step !== null,
      )

    if (mappedErrors.length > 0) {
      const targetStep = Math.min(...mappedErrors.map((mapped) => mapped.step))
      const firstFieldOnStep = mappedErrors.find(
        (mapped) => mapped.step === targetStep,
      )

      pendingFocusField.current =
        (firstFieldOnStep?.field as Path<OnboardingFormValues>) ?? null
      goTo(targetStep)
    }
  }

  const onValid = async (values: OnboardingFormValues) => {
    const result = await onboardingFormService.handleSubmit(
      toSubmitPayload(values, config),
    )

    if (result.status === 'field-error') {
      applyFieldErrors(result.errors)
    }
  }

  const onInvalid = (errors: FieldErrors<OnboardingFormValues>) => {
    const invalidSectionIndex = STEP_SECTIONS.findIndex(
      (section) => errors[section],
    )

    if (invalidSectionIndex >= 0) {
      pendingFocusField.current = firstErrorFieldPath(
        errors,
        STEP_SECTIONS[invalidSectionIndex],
      ) as Path<OnboardingFormValues> | null
      goTo(invalidSectionIndex)
    }

    onboardingFormService.clearSubmitError()
  }

  return {
    onSubmit: () => handleSubmit(onValid, onInvalid)(),
    status: submitStatus,
    error: submitError,
    applicationId,
  }
}
