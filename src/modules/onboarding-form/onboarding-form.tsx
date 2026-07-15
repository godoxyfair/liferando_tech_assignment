import { useEffect } from 'react'
import { useStore } from '@/utils/useStore'
import { onboardingFormService } from './service/onboarding.form-service'
import { ConfigStatus, ResumeStatus } from './store/onboarding.store'
import { RESUME_APPLICATION_ID } from './onboarding.constants'
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

  useEffect(() => {
    void onboardingFormService.loadConfig()
    void onboardingFormService.loadResume(RESUME_APPLICATION_ID)
  }, [])

  if (
    configStatus === ConfigStatus.Idle ||
    configStatus === ConfigStatus.Loading ||
    resumeStatus === ResumeStatus.Idle ||
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
