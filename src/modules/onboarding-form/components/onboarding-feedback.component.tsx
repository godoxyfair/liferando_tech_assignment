import { useEffect, useRef } from 'react'
import { PieButton } from '@justeattakeaway/pie-webc/react/button'

export function OnboardingLoading() {
  return (
    <p className="onboarding__status" role="status" aria-live="polite">
      Loading the onboarding form…
    </p>
  )
}

interface ConfigErrorProps {
  message: string | null
  onRetry: () => void
}

export function ConfigError({ message, onRetry }: ConfigErrorProps) {
  return (
    <div className="onboarding__status" role="alert">
      <p>{message ?? 'Something went wrong while loading the form.'}</p>
      <PieButton type="button" variant="primary" onClick={onRetry}>
        Try again
      </PieButton>
    </div>
  )
}

interface OnboardingSuccessProps {
  applicationId: string
}

export function OnboardingSuccess({ applicationId }: OnboardingSuccessProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="onboarding__success" role="status" aria-live="polite">
      <h1 className="onboarding__title" ref={headingRef} tabIndex={-1}>
        Application submitted
      </h1>
      <p>
        Thanks for applying to ride with us. Your reference is{' '}
        <strong>{applicationId}</strong> — we'll be in touch by email.
      </p>
    </div>
  )
}
