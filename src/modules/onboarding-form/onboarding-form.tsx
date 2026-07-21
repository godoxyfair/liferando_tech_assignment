import { useEffect } from 'react'
import { useStore } from 'zustand'
import { onboardingFormService } from './service/onboarding.form-service'
import { ConfigStatus, ResumeStatus } from './store/onboarding.store'
import { OnboardingWizard } from './components/wizard/onboarding-wizard.component'
import {
  ConfigError,
  OnboardingLoading,
} from './components/onboarding-feedback.component'
import './onboarding.css'

export function OnboardingForm() {
  const {
    config,
    configStatus,
    configError,
    resumeStatus,
    resumeError,
    prefillApplication,
  } = useStore(onboardingFormService.store)

  const resumeApplicationId = new URLSearchParams(window.location.search).get(
    'resume',
  )

  useEffect(() => {
    void onboardingFormService.loadConfig()

    if (resumeApplicationId) {
      void onboardingFormService.loadResume(resumeApplicationId)
    }
  }, [resumeApplicationId])

  if (
    configStatus === ConfigStatus.Idle ||
    configStatus === ConfigStatus.Loading ||
    resumeStatus === ResumeStatus.Loading
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

  return (
    <OnboardingWizard
      config={config}
      prefillApplication={
        resumeStatus === ResumeStatus.Ready ? prefillApplication : null
      }
      resumeError={resumeStatus === ResumeStatus.Error ? resumeError : null}
    />
  )
}
