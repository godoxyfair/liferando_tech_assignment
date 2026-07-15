import type { SelectOption } from './field.types'

export function fieldControlId(name: string): string {
  return `field-${name.replaceAll('.', '-')}`
}

export function findOption(
  options: SelectOption[],
  value: string,
): SelectOption | null {
  return options.find((option) => option.value === value) ?? null
}
