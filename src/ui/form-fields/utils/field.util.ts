/** util for taking a real value from PIE not a tag */
export function readControlValue(event: Event): string {
  const { target } = event

  return target && 'value' in target ? String(target.value) : ''
}
