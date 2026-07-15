import { Controller, useFormContext } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import { PieFormLabel } from '@justeattakeaway/pie-webc/react/form-label'
import { ComboBoxControl } from './combobox/combobox-control.component'
import type { FormComboBoxFieldProps } from './field.types'
import './field.css'

/** Searchable combobox, virtualized for large option lists */
export function FormComboBoxField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  id = `field-${name}`,
  placeholder = 'Search…',
  emptyMessage = 'No matches found',
}: FormComboBoxFieldProps<TFieldValues>) {
  const { trigger } = useFormContext<TFieldValues>()

  return (
    <div className="field">
      <PieFormLabel for={id}>{label}</PieFormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <ComboBoxControl
            id={id}
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
