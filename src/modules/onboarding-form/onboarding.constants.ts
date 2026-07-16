export enum Step {
  Personal = 0,
  Eligibility = 1,
  Documents = 2,
  Review = 3,
}

export const STEP_LABELS = [
  'Personal details',
  'Eligibility',
  'Documents',
  'Review',
] as const

export const STEP_COUNT = STEP_LABELS.length

export const NEW_APPLICATION_ID = 'new'
