import { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { FieldErrors, Path } from 'react-hook-form'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { useStepper } from '@/ui/stepper'
import { onboardingFormService } from '../service/onboarding.form-service'
import { SubmitStatus } from '../store/onboarding.store'
import type { Step } from '../onboarding.constants'
import { STEP_SECTIONS } from '../validation'
import { firstErrorFieldPath, mapServerErrorToStep } from '../utils/errors'
import { toSubmitPayload } from '../utils/payload'
import type { OnboardingConfig, ServerFieldError } from '../onboarding.types'
import type { OnboardingFormValues } from '../onboarding.form-model'

export function useOnboardingSubmit(config: OnboardingConfig) {
  const { handleSubmit, setError, setFocus, watch } =
    useFormContext<OnboardingFormValues>()

  const { goTo, step } = useStepper()

  const { submitStatus, submitError, applicationId } = useStore(
    onboardingFormService.store,
    useShallow((state) => ({
      submitStatus: state.submitStatus,
      submitError: state.submitError,
      applicationId: state.applicationId,
    })),
  )

  const pendingFocusField = useRef<Path<OnboardingFormValues> | null>(null)
  const [isRetryableError, setIsRetryableError] = useState(false)

  useEffect(() => {
    const fieldToFocus = pendingFocusField.current

    if (!fieldToFocus) {
      return
    }

    pendingFocusField.current = null
    setFocus(fieldToFocus)
  }, [step, setFocus])

  useEffect(() => {
    const subscription = watch(() => {
      const { submitStatus: currentStatus } =
        onboardingFormService.store.getState()

      if (currentStatus === SubmitStatus.Error) {
        onboardingFormService.clearSubmitError()
      }
    })

    return () => subscription.unsubscribe()
  }, [watch])

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

    setIsRetryableError(result.status === 'error')

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
    isRetryableError,
    applicationId,
  }
}
