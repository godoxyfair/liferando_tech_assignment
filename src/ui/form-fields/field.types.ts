import type { Control, FieldPathByValue, FieldValues } from 'react-hook-form'

export interface SelectOption {
  value: string
  label: string
}

export interface FormFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, string>
  label: string
  id?: string
}

export interface FormTextFieldProps<
  TFieldValues extends FieldValues,
> extends FormFieldProps<TFieldValues> {
  type?: 'text' | 'email' | 'tel'
  autocomplete?: string
  inputmode?: 'text' | 'email' | 'tel' | 'numeric'
  placeholder?: string
}

export interface FormSelectFieldProps<
  TFieldValues extends FieldValues,
> extends FormFieldProps<TFieldValues> {
  options: SelectOption[]
  placeholder?: string
}

export interface FormDateFieldProps<
  TFieldValues extends FieldValues,
> extends FormFieldProps<TFieldValues> {
  autocomplete?: string
}
