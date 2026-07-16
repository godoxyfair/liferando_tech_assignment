import type { Ref } from 'react'
import type { SelectOption } from '../field.types'

export interface SelectControlProps {
  id: string
  buttonRef?: Ref<HTMLButtonElement>
  name: string
  value: string
  error?: string
  options: SelectOption[]
  placeholder: string
  onSelect: (value: string) => void
  onBlur: () => void
}
