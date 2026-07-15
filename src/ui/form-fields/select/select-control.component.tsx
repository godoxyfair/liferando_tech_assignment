import { useMemo } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { PieAssistiveText } from '@justeattakeaway/pie-webc/react/assistive-text'
import { findOption } from '../field.utils'
import type { SelectControlProps } from './select-control.types'

export function SelectControl({
  id,
  name,
  value,
  error,
  options,
  placeholder,
  onSelect,
  onBlur,
}: SelectControlProps) {
  const selectedOption = useMemo(
    () => findOption(options, value),
    [options, value],
  )

  const errorId = error ? `${id}-error` : undefined

  return (
    <>
      <Listbox value={value} onChange={onSelect}>
        <div className="combobox">
          <ListboxButton
            id={id}
            name={name}
            className="field__native-input combobox__input select__button"
            aria-invalid={Boolean(error)}
            aria-describedby={errorId}
            data-status={error ? 'error' : undefined}
            onBlur={onBlur}
          >
            <span className={selectedOption ? undefined : 'select__placeholder'}>
              {selectedOption?.label ?? placeholder}
            </span>
          </ListboxButton>
          <span className="combobox__toggle" aria-hidden="true" />
          <ListboxOptions className="combobox__listbox" anchor="bottom start" modal={false}>
            {options.map((option) => (
              <ListboxOption key={option.value} value={option.value} className="combobox__option">
                {option.label}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
      {error && <PieAssistiveText id={errorId} variant="error" message={error} />}
    </>
  )
}
