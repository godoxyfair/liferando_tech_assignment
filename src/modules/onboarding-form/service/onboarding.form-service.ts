import { NEW_APPLICATION_ID } from '../onboarding.constants'
import {
  isOnboardingApiError,
  onboardingApi,
} from '@/api/onboarding-form/onboarding.service'
import {
  ConfigStatus,
  ResumeStatus,
  SubmitStatus,
  onboardingStore,
} from '../store/onboarding.store'
import type { ServerFieldError, SubmitPayload } from '../onboarding.types'

export type SubmitOutcome =
  | { status: 'submitted'; applicationId: string }
  | { status: 'field-error'; errors: ServerFieldError[] }
  | { status: 'error' }

export class OnboardingFormService {
  readonly store = onboardingStore
  private configController: AbortController | null = null
  private submitController: AbortController | null = null
  private resumeController: AbortController | null = null

  async loadConfig(): Promise<void> {
    this.configController?.abort()
    const controller = new AbortController()
    this.configController = controller

    const { setConfig, setConfigStatus } = this.store.getState()
    setConfigStatus(ConfigStatus.Loading)

    try {
      const config = await onboardingApi.getConfig(controller.signal)
      if (!controller.signal.aborted) {
        setConfig(config)
      }
    } catch {
      if (!controller.signal.aborted) {
        setConfigStatus(
          ConfigStatus.Error,
          'We could not load the onboarding form. Please try again.',
        )
      }
    }
  }

  async loadResume(id: string): Promise<void> {
    this.resumeController?.abort()
    const controller = new AbortController()
    this.resumeController = controller

    const { setResumeStatus, setPrefillApplication } = this.store.getState()
    setResumeStatus(ResumeStatus.Loading)

    try {
      const application = await onboardingApi.getApplication(
        id,
        controller.signal,
      )

      if (!controller.signal.aborted) {
        setPrefillApplication(application)
      }
    } catch {
      if (!controller.signal.aborted) {
        setResumeStatus(
          ResumeStatus.Error,
          'We could not load your saved application. Continuing with a blank form.',
        )
      }
    }
  }

  async handleSubmit(payload: SubmitPayload): Promise<SubmitOutcome> {
    this.submitController?.abort()
    const controller = new AbortController()
    this.submitController = controller

    const { setSubmitStatus, setApplicationId, prefillApplication } =
      this.store.getState()

    setSubmitStatus(SubmitStatus.Submitting)

    try {
      const result = await onboardingApi.submitApplication(
        prefillApplication?.applicationId ?? NEW_APPLICATION_ID,
        payload,
        controller.signal,
      )

      if (controller.signal.aborted) {
        return { status: 'error' }
      }

      setApplicationId(result.applicationId)
      setSubmitStatus(SubmitStatus.Submitted)

      return { status: 'submitted', applicationId: result.applicationId }
    } catch (error) {
      if (controller.signal.aborted) {
        return { status: 'error' }
      }

      if (isOnboardingApiError(error)) {
        const fieldErrors = error.response?.data?.errors

        if (fieldErrors?.length) {
          setSubmitStatus(
            SubmitStatus.Error,
            'Please fix the highlighted fields and try again.',
          )

          return { status: 'field-error', errors: fieldErrors }
        }

        setSubmitStatus(
          SubmitStatus.Error,
          error.response?.data?.message ??
            'Something went wrong. Please try again.',
        )

        return { status: 'error' }
      }

      setSubmitStatus(
        SubmitStatus.Error,
        'Network error. Please check your connection and try again.',
      )

      return { status: 'error' }
    }
  }

  noteValidationError(): void {
    this.store
      .getState()
      .setSubmitStatus(
        SubmitStatus.Error,
        'Please complete the highlighted fields.',
      )
  }

  reset(): void {
    this.configController?.abort()
    this.submitController?.abort()
    this.resumeController?.abort()
    this.store.getState().reset()
  }
}

export const onboardingFormService = new OnboardingFormService()
