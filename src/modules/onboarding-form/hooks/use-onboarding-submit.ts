import { useFormContext } from 'react-hook-form'
import type { FieldErrors, Path } from 'react-hook-form'
import { useStore } from '@/utils/useStore'
import { useStepper } from '@/ui/stepper'
import { onboardingFormService } from '../service/onboarding.form-service'
import { Step } from '../onboarding.constants'
import { mapServerErrorToStep } from '../utils/errors'
import { toSubmitPayload } from '../utils/payload'
import type { OnboardingConfig, ServerFieldError } from '../onboarding.types'
import type { OnboardingFormValues } from '../onboarding.form-model'

export function useOnboardingSubmit(config: OnboardingConfig) {
  const { handleSubmit, setError } = useFormContext<OnboardingFormValues>()
  const { goTo } = useStepper()
  const { submitStatus, submitError, applicationId } = useStore(
    onboardingFormService.store,
  )

  const applyFieldErrors = (errors: ServerFieldError[]) => {
    for (const { field, message } of errors) {
      setError(field as Path<OnboardingFormValues>, {
        type: 'server',
        message,
      })
    }

    const steps = errors
      .map(({ field }) => mapServerErrorToStep(field))
      .filter((step): step is Step => step !== null)

    if (steps.length > 0) {
      goTo(Math.min(...steps))
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
    if (errors.personal) {
      goTo(Step.Personal)
    } else if (errors.eligibility) {
      goTo(Step.Eligibility)
    } else if (errors.documents) {
      goTo(Step.Documents)
    }

    onboardingFormService.noteValidationError()
  }

  return {
    onSubmit: handleSubmit(onValid, onInvalid),
    status: submitStatus,
    error: submitError,
    applicationId,
  }
}
