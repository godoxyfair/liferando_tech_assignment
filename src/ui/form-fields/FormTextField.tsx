import { Controller } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import { PieTextInput } from '@justeattakeaway/pie-webc/react/text-input'
import { PieFormLabel } from '@justeattakeaway/pie-webc/react/form-label'
import { readControlValue } from './utils/field.util'
import type { FormTextFieldProps } from './field.types'
import './field.css'

export function FormTextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  id = `field-${name}`,
  type = 'text',
  autocomplete,
  inputmode,
  placeholder,
}: FormTextFieldProps<TFieldValues>) {
  return (
    <div className="field">
      <PieFormLabel for={id}>{label}</PieFormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <PieTextInput
            id={id}
            name={field.name}
            type={type}
            value={field.value ?? ''}
            autocomplete={autocomplete}
            inputmode={inputmode}
            placeholder={placeholder}
            status={fieldState.error ? 'error' : 'default'}
            assistiveText={fieldState.error?.message}
            onChange={(event) => field.onChange(readControlValue(event))}
            onBlur={field.onBlur}
          />
        )}
      />
    </div>
  )
}
