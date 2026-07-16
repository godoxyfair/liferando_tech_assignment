import type { SummaryDescriptionProps } from './summary-description.types'
import './summary-description.css'

export function SummaryDescription({
  term,
  description,
}: SummaryDescriptionProps) {
  return (
    <>
      <dt className="summary-description__term">{term}</dt>
      <dd className="summary-description__description">{description}</dd>
    </>
  )
}
