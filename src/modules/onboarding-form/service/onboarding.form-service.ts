import { NEW_APPLICATION_ID } from '../onboarding.constants'
import {
  isOnboardingApiError,
  onboardingApi,
} from '@/api/onboarding-form/onboarding.service'
import {
  ConfigStatus,
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

  async handleSubmit(payload: SubmitPayload): Promise<SubmitOutcome> {
    const { setSubmitStatus, setApplicationId } = this.store.getState()
    setSubmitStatus(SubmitStatus.Submitting)

    try {
      const result = await onboardingApi.submitApplication(
        NEW_APPLICATION_ID,
        payload,
      )

      setApplicationId(result.applicationId)

      return { status: 'submitted', applicationId: result.applicationId }
    } catch (error) {
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
    this.store.getState().reset()
  }
}

export const onboardingFormService = new OnboardingFormService()
