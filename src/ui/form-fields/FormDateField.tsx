import { Controller, useFormContext } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import { PieAssistiveText } from '@justeattakeaway/pie-webc/react/assistive-text'
import { fieldControlId } from './field.utils'
import type { FormDateFieldProps } from './field.types'
import './field.css'

export function FormDateField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  id = fieldControlId(name),
  autocomplete,
}: FormDateFieldProps<TFieldValues>) {
  const { trigger } = useFormContext<TFieldValues>()
  const errorId = `${id}-error`

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="field">
          <label className="field__label" htmlFor={id}>
            {label}
          </label>
          <input
            id={id}
            ref={field.ref}
            name={field.name}
            type="date"
            required
            className="field__native-input"
            data-status={fieldState.error ? 'error' : undefined}
            value={field.value ?? ''}
            autoComplete={autocomplete}
            aria-invalid={fieldState.error ? true : undefined}
            aria-describedby={fieldState.error ? errorId : undefined}
            onChange={(event) => {
              field.onChange(event.target.value)

              if (fieldState.error) {
                void trigger(name)
              }
            }}
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
