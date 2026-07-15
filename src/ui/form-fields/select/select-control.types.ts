import type { SelectOption } from '../field.types'

export interface SelectControlProps {
  id: string
  name: string
  value: string
  error?: string
  options: SelectOption[]
  placeholder: string
  onSelect: (value: string) => void
  onBlur: () => void
}
