import type { Ref } from 'react'
import type { SelectOption } from '../field.types'

export interface ComboBoxControlProps {
  id: string
  inputRef?: Ref<HTMLInputElement>
  name: string
  value: string
  error?: string
  options: SelectOption[]
  placeholder: string
  emptyMessage: string
  onSelect: (value: string) => void
  onBlur: () => void
}
