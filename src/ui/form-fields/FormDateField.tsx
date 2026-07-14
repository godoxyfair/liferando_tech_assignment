import { Controller } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import { PieAssistiveText } from '@justeattakeaway/pie-webc/react/assistive-text'
import { PieFormLabel } from '@justeattakeaway/pie-webc/react/form-label'
import type { FormDateFieldProps } from './field.types'
import './field.css'

export function FormDateField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  id = `field-${name}`,
  autocomplete,
}: FormDateFieldProps<TFieldValues>) {
  const errorId = `${id}-error`

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="field">
          <PieFormLabel for={id}>{label}</PieFormLabel>
          <input
            id={id}
            name={field.name}
            type="date"
            className="field__native-input"
            data-status={fieldState.error ? 'error' : undefined}
            value={field.value ?? ''}
            autoComplete={autocomplete}
            aria-invalid={fieldState.error ? true : undefined}
            aria-describedby={fieldState.error ? errorId : undefined}
            onChange={(event) => field.onChange(event.target.value)}
            onBlur={field.onBlur}
          />
          {fieldState.error && (
            <PieAssistiveText
              id={errorId}
              variant="error"
              message={fieldState.error.message}
            />
          )}
        </div>
      )}
    />
  )
}
