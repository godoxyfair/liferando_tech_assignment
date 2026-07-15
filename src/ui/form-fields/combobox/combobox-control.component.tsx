import { useMemo, useState } from 'react'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import { PieAssistiveText } from '@justeattakeaway/pie-webc/react/assistive-text'
import { findOption } from '../field.utils'
import type { SelectOption } from '../field.types'
import type { ComboBoxControlProps } from './combobox-control.types'

export function ComboBoxControl({
  id,
  name,
  value,
  error,
  options,
  placeholder,
  emptyMessage,
  onSelect,
  onBlur,
}: ComboBoxControlProps) {
  const [query, setQuery] = useState('')

  const filteredOptions = useMemo(() => {
    const optionText = query.trim().toLowerCase()

    return optionText
      ? options.filter((option) =>
          option.label.toLowerCase().includes(optionText),
        )
      : options
  }, [options, query])

  const selectedOption = useMemo(
    () => findOption(options, value),
    [options, value],
  )

  const errorId = error ? `${id}-error` : undefined

  return (
    <>
      <Combobox
        value={selectedOption}
        by="value"
        virtual={
          filteredOptions.length > 0 ? { options: filteredOptions } : undefined
        }
        onChange={(option: SelectOption | null) =>
          onSelect(option ? option.value : '')
        }
        onClose={() => setQuery('')}
      >
        <div className="combobox">
          <ComboboxInput
            id={id}
            name={name}
            className="field__native-input combobox__input"
            autoComplete="off"
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId}
            data-status={error ? 'error' : undefined}
            displayValue={(option: SelectOption | null) => option?.label ?? ''}
            onChange={(event) => setQuery(event.target.value)}
            onBlur={onBlur}
          />
          <ComboboxButton
            className="combobox__toggle"
            aria-label="Toggle options"
          />
          <ComboboxOptions
            className="combobox__listbox"
            anchor="bottom start"
            modal={false}
          >
            {filteredOptions.length === 0 ? (
              <div className="combobox__empty">{emptyMessage}</div>
            ) : (
              ({ option }: { option: SelectOption }) => (
                <ComboboxOption
                  // key={option.value}
                  value={option}
                  className="combobox__option"
                >
                  {option.label}
                </ComboboxOption>
              )
            )}
          </ComboboxOptions>
        </div>
      </Combobox>
      {error && (
        <PieAssistiveText id={errorId} variant="error" message={error} />
      )}
    </>
  )
}
