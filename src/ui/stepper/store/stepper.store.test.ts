import { describe, expect, it } from 'vitest'
import { canReachStep, createStepperStore } from './stepper.store'

describe('canReachStep', () => {
  it('always allows the first step', () => {
    expect(canReachStep(0, 0)).toBe(true)
  })

  it('allows any step up to the furthest reached', () => {
    expect(canReachStep(2, 0)).toBe(true)
    expect(canReachStep(2, 1)).toBe(true)
    expect(canReachStep(2, 2)).toBe(true)
  })

  it('blocks steps beyond the furthest reached', () => {
    expect(canReachStep(0, 1)).toBe(false)
    expect(canReachStep(1, 2)).toBe(false)
  })
})

describe('createStepperStore', () => {
  it('starts at step 0 with nothing reached beyond it', () => {
    const store = createStepperStore(3)
    expect(store.getState().step).toBe(0)
    expect(store.getState().maxReached).toBe(0)
  })

  it('clamps navigation within bounds', () => {
    const store = createStepperStore(3)
    store.getState().backToStep()
    expect(store.getState().step).toBe(0) // cannot go below 0

    store.getState().nextStep()
    store.getState().nextStep()
    store.getState().nextStep()
    expect(store.getState().step).toBe(2) // cannot exceed count - 1
    expect(store.getState().maxReached).toBe(2)
  })

  it('refuses goToStep beyond the furthest reached', () => {
    const store = createStepperStore(3)
    store.getState().goToStep(2)
    expect(store.getState().step).toBe(0) // blocked, never reached
  })

  it('keeps a step reachable after navigating back (maxReached is monotonic)', () => {
    const store = createStepperStore(3)
    store.getState().nextStep() // reach step 1
    store.getState().nextStep() // reach step 2
    store.getState().backToStep() // back to step 1
    expect(store.getState().step).toBe(1)
    expect(store.getState().maxReached).toBe(2) // not lowered

    store.getState().goToStep(2) // still reachable
    expect(store.getState().step).toBe(2)
  })

  it('reset returns to the initial state', () => {
    const store = createStepperStore(3)
    store.getState().nextStep()
    store.getState().reset()
    expect(store.getState().step).toBe(0)
    expect(store.getState().maxReached).toBe(0)
  })
})
