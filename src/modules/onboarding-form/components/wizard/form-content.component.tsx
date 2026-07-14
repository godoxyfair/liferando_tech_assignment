import type { FormEvent } from 'react'
import { useFormContext } from 'react-hook-form'
import { PieButton } from '@justeattakeaway/pie-webc/react/button'
import { PieNotification } from '@justeattakeaway/pie-webc/react/notification'
import { Stepper, useStepper } from '@/ui/stepper'
import { SubmitStatus } from '../../store/onboarding.store'
import { STEP_LABELS } from '../../onboarding.constants'
import type { OnboardingFormValues } from '../../onboarding.form-model'
import { STEP_FIELDS } from '../../validation'
import { useOnboardingSubmit } from '../../hooks/use-onboarding-submit'
import { OnboardingSteps } from '../onboarding-steps.component'
import { OnboardingSuccess } from '../onboarding-feedback.component'
import type { WizardProps } from './onboarding-wizard.types'

const STEP_SECTIONS = ['personal', 'eligibility', 'documents'] as const

export function FormContent({ config }: WizardProps) {
  const { step, isFirst, isLast, maxReached, next, back } = useStepper()
  const { trigger, formState } = useFormContext<OnboardingFormValues>()
  const {
    onSubmit,
    status: submitStatus,
    error: submitError,
    applicationId,
  } = useOnboardingSubmit(config)

  if (submitStatus === SubmitStatus.Submitted && applicationId) {
    return <OnboardingSuccess applicationId={applicationId} />
  }

  const goToNextStep = async () => {
    const stepFields = STEP_FIELDS[step]
    const isStepValid = await trigger(stepFields)
    if (isStepValid) {
      next()
    }
  }

  const completedSteps = STEP_SECTIONS.map(
    (section, index) => index < maxReached && !formState.errors[section],
  )

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (isLast) {
      void onSubmit()
    } else {
      void goToNextStep()
    }
  }

  const isSubmitting = submitStatus === SubmitStatus.Submitting

  return (
    <form className="onboarding" onSubmit={handleSubmit} noValidate>
      <h1 className="onboarding__title">Courier onboarding</h1>

      <Stepper labels={[...STEP_LABELS]} completed={completedSteps} />

      {submitError && (
        <PieNotification
          variant="error"
          isOpen
          heading="We couldn't submit your application"
        >
          {submitError}
        </PieNotification>
      )}

      <OnboardingSteps config={config} />

      <div className="onboarding__nav">
        {!isFirst && (
          <PieButton
            type="button"
            variant="ghost"
            onClick={back}
            disabled={isSubmitting}
          >
            Back
          </PieButton>
        )}
        <PieButton
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isLast ? 'Submit application' : 'Continue'}
        </PieButton>
      </div>
    </form>
  )
}
