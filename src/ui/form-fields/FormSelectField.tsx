import { Controller } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import { PieSelect } from '@justeattakeaway/pie-webc/react/select'
import { PieFormLabel } from '@justeattakeaway/pie-webc/react/form-label'
import { readControlValue } from './utils/field.util'
import type { FormSelectFieldProps } from './field.types'
import './field.css'

export function FormSelectField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  id = `field-${name}`,
  placeholder = 'Please select…',
}: FormSelectFieldProps<TFieldValues>) {
  const pieOptions = [
    { tag: 'option' as const, text: placeholder, value: '' },
    ...options.map((option) => ({
      tag: 'option' as const,
      text: option.label,
      value: option.value,
    })),
  ]

  return (
    <div className="field">
      <PieFormLabel for={id}>{label}</PieFormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <PieSelect
            id={id}
            name={field.name}
            value={field.value ?? ''}
            options={pieOptions}
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
