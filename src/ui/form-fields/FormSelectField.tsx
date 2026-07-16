import { Controller, useFormContext } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import { SelectControl } from './select/select-control.component'
import { fieldControlId } from './field.utils'
import type { FormSelectFieldProps } from './field.types'
import './field.css'

export function FormSelectField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  id = fieldControlId(name),
  placeholder = 'Please select…',
}: FormSelectFieldProps<TFieldValues>) {
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
          <SelectControl
            id={id}
            buttonRef={field.ref}
            name={field.name}
            value={field.value ?? ''}
            error={fieldState.error?.message}
            options={options}
            placeholder={placeholder}
            onSelect={(value) => {
              field.onChange(value)
              void trigger(name)
            }}
            onBlur={field.onBlur}
          />
        )}
      />
    </div>
  )
}
