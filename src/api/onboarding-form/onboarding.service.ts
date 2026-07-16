import { apiRequest, isApiError } from '@/utils/apiRequest'
import type { ApiError } from '@/utils/apiRequest'
import type {
  OnboardingApplication,
  OnboardingConfig,
  ServerErrorBody,
  SubmitPayload,
  SubmitResponse,
} from '../../modules/onboarding-form/onboarding.types'

const ENDPOINT = '/onboarding'

export type OnboardingApiError = ApiError<ServerErrorBody>

export function isOnboardingApiError(
  error: unknown,
): error is OnboardingApiError {
  return isApiError<ServerErrorBody>(error)
}

export class OnboardingApi {
  async getConfig(signal?: AbortSignal): Promise<OnboardingConfig> {
    const response = await apiRequest<void, OnboardingConfig>(
      `${ENDPOINT}/config`,
      { method: 'GET', signal },
    )

    return response.data
  }

  async getApplication(
    id: string,
    signal?: AbortSignal,
  ): Promise<OnboardingApplication> {
    const response = await apiRequest<void, OnboardingApplication>(
      `${ENDPOINT}/applications/${encodeURIComponent(id)}`,
      { method: 'GET', signal },
    )

    return response.data
  }

  async submitApplication(
    id: string,
    payload: SubmitPayload,
    signal?: AbortSignal,
  ): Promise<SubmitResponse> {
    const response = await apiRequest<SubmitPayload, SubmitResponse>(
      `${ENDPOINT}/applications/${encodeURIComponent(id)}/submit`,
      { method: 'POST', data: payload, signal },
    )

    return response.data
  }
}

export const onboardingApi = new OnboardingApi()
