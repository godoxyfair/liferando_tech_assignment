import { Fragment } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { getRequiredDocuments } from '../../utils/documents'
import { formatDate } from '../../utils/format-date'
import type { OnboardingConfig } from '../../onboarding.types'
import type { OnboardingFormValues } from '../../onboarding.form-model'
import './step.css'

interface ReviewStepProps {
  config: OnboardingConfig
}

export function ReviewStep({ config }: ReviewStepProps) {
  const { control } = useFormContext<OnboardingFormValues>()
  const values = useWatch<OnboardingFormValues>({ control })

  const personal = values.personal
  const eligibility = values.eligibility
  const documents = values.documents

  const vehicleLabel = config.vehicleTypes.find(
    (vehicle) => vehicle.id === eligibility?.vehicleType,
  )?.label

  const requiredDocuments = getRequiredDocuments(
    config,
    eligibility?.vehicleType ?? '',
  )

  return (
    <fieldset className="step">
      <legend className="step__legend">Review your application</legend>

      <dl className="step__summary">
        <dt>First name</dt>
        <dd>{personal?.firstName}</dd>

        <dt>Last name</dt>
        <dd>{personal?.lastName}</dd>

        <dt>Email</dt>
        <dd>{personal?.email}</dd>

        <dt>Date of birth</dt>
        <dd>{personal?.dateOfBirth && formatDate(personal.dateOfBirth)}</dd>

        <dt>City</dt>
        <dd>{eligibility?.city}</dd>

        <dt>Vehicle type</dt>
        <dd>{vehicleLabel}</dd>

        {requiredDocuments.map((documentType) => (
          <Fragment key={documentType}>
            <dt>{config.documents[documentType].label}</dt>
            <dd>{documents?.[documentType]?.number}</dd>
          </Fragment>
        ))}
      </dl>
    </fieldset>
  )
}
