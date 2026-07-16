import { useFormContext, useWatch } from 'react-hook-form'
import { SummaryDescription } from '@/ui/summary-description'
import { buildSummaryItems } from '../../utils/summary'
import type { OnboardingConfig } from '../../onboarding.types'
import type { OnboardingFormValues } from '../../onboarding.form-model'
import './step.css'

interface ReviewStepProps {
  config: OnboardingConfig
}

export function ReviewStep({ config }: ReviewStepProps) {
  const { control } = useFormContext<OnboardingFormValues>()
  const values = useWatch<OnboardingFormValues>({ control })
  const items = buildSummaryItems(config, values)

  return (
    <fieldset className="step">
      <legend className="step__legend">Review your application</legend>

      <dl className="summary-description">
        {items.map((item) => (
          <SummaryDescription
            key={item.term}
            term={item.term}
            description={item.description}
          />
        ))}
      </dl>
    </fieldset>
  )
}
