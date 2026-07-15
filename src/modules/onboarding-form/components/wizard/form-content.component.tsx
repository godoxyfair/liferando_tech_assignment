import type { FormEvent } from 'react'
import { useFormContext } from 'react-hook-form'
import { PieButton } from '@justeattakeaway/pie-webc/react/button'
import { PieNotification } from '@justeattakeaway/pie-webc/react/notification'
import { Stepper, useStepper } from '@/ui/stepper'
import { StepTransition } from '@/ui/step-transition'
import { SubmitStatus } from '../../store/onboarding.store'
import { STEP_LABELS } from '../../onboarding.constants'
import type { OnboardingFormValues } from '../../onboarding.form-model'
import { STEP_FIELDS, STEP_SECTIONS } from '../../validation'
import { useOnboardingSubmit } from '../../hooks/use-onboarding-submit'
import { OnboardingSteps } from '../onboarding-steps.component'
import { OnboardingSuccess } from '../onboarding-feedback.component'
import type { WizardProps } from './onboarding-wizard.types'

export function FormContent({ config }: WizardProps) {
  const { step, isFirst, isLast, maxReached, next, back } = useStepper()
  const { trigger, formState } = useFormContext<OnboardingFormValues>()
  const completedSteps = STEP_LABELS.map((_, index) => {
    const section = STEP_SECTIONS[index]

    return index < maxReached && (!section || !formState.errors[section])
  })

  const invalidSteps = STEP_LABELS.map((_, index) => {
    const section = STEP_SECTIONS[index]

    return index <= maxReached && !!section && !!formState.errors[section]
  })

  const {
    onSubmit,
    status: submitStatus,
    error: submitError,
    applicationId,
  } = useOnboardingSubmit(config)

  const goToNextStep = async () => {
    const stepFields = STEP_FIELDS[step]
    const isStepValid = await trigger(stepFields)
    if (isStepValid) {
      next()
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (isLast) {
      void onSubmit()
    } else {
      void goToNextStep()
    }
  }

  const isSubmitting = submitStatus === SubmitStatus.Submitting

  if (submitStatus === SubmitStatus.Submitted && applicationId) {
    return <OnboardingSuccess applicationId={applicationId} />
  }

  return (
    <form className="onboarding" onSubmit={handleSubmit} noValidate>
      <header className="onboarding__header">
        <h1 className="onboarding__title">Courier onboarding</h1>

        <Stepper
          labels={[...STEP_LABELS]}
          completed={completedSteps}
          invalid={invalidSteps}
        />
      </header>

      <div className="onboarding__body">
        {submitError && (
          <PieNotification
            variant="error"
            isOpen
            heading="We couldn't submit your application"
          >
            {submitError}
          </PieNotification>
        )}

        <StepTransition stepKey={step}>
          <OnboardingSteps config={config} />
        </StepTransition>
      </div>

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
