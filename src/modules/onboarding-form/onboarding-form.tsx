import { useEffect } from 'react'
import { useStore } from '@/utils/useStore'
import { onboardingFormService } from './service/onboarding.form-service'
import { ConfigStatus } from './store/onboarding.store'
import { OnboardingWizard } from './components/wizard/onboarding-wizard.component'
import {
  ConfigError,
  OnboardingLoading,
} from './components/onboarding-feedback.component'
import './onboarding.css'

export function OnboardingForm() {
  const { config, configStatus, configError } = useStore(
    onboardingFormService.store,
  )

  useEffect(() => {
    void onboardingFormService.loadConfig()
  }, [])

  if (
    configStatus === ConfigStatus.Idle ||
    configStatus === ConfigStatus.Loading
  ) {
    return <OnboardingLoading />
  }

  if (configStatus === ConfigStatus.Error || !config) {
    return (
      <ConfigError
        message={configError}
        onRetry={() => void onboardingFormService.loadConfig()}
      />
    )
  }

  return <OnboardingWizard config={config} />
}
