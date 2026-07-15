import { Controller, useFormContext } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import { PieTextInput } from '@justeattakeaway/pie-webc/react/text-input'
import { readControlValue } from './utils/field.util'
import { fieldControlId } from './field.utils'
import type { FormTextFieldProps } from './field.types'
import './field.css'

export function FormTextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  id = fieldControlId(name),
  type = 'text',
  autocomplete,
  inputmode,
  placeholder,
}: FormTextFieldProps<TFieldValues>) {
  const { trigger } = useFormContext<TFieldValues>()

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <PieTextInput
            id={id}
            ref={(element) =>
              field.ref(
                element && {
                  focus: () => (element.focusTarget ?? element).focus(),
                },
              )
            }
            name={field.name}
            type={type}
            required
            value={field.value ?? ''}
            autocomplete={autocomplete}
            inputmode={inputmode}
            placeholder={placeholder}
            status={fieldState.error ? 'error' : 'default'}
            assistiveText={fieldState.error?.message}
            onChange={(event) => {
              field.onChange(readControlValue(event))

              if (fieldState.error) {
                void trigger(name)
              }
            }}
            onBlur={field.onBlur}
          />
        )}
      />
    </div>
  )
}
