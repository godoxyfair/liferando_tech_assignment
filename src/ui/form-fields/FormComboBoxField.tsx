import { Controller, useFormContext } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import { ComboBoxControl } from './combobox/combobox-control.component'
import { fieldControlId } from './field.utils'
import type { FormComboBoxFieldProps } from './field.types'
import './field.css'

export function FormComboBoxField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  id = fieldControlId(name),
  placeholder = 'Search…',
  emptyMessage = 'No matches found',
}: FormComboBoxFieldProps<TFieldValues>) {
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
          <ComboBoxControl
            id={id}
            inputRef={field.ref}
            name={field.name}
            value={field.value ?? ''}
            error={fieldState.error?.message}
            options={options}
            placeholder={placeholder}
            emptyMessage={emptyMessage}
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
