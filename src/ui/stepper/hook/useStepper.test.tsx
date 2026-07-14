import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { StepperProvider } from '../StepperProvider'
import { useStepper } from './useStepper'

// Exercises the public stepper API end to end
function wrapper({ children }: { children: ReactNode }) {
  return <StepperProvider count={3}>{children}</StepperProvider>
}

describe('useStepper', () => {
  it('throws when used outside a StepperProvider', () => {
    expect(() => renderHook(() => useStepper())).toThrow(/StepperProvider/)
  })

  it('starts on the first step and gates forward jumps until reached', () => {
    const { result } = renderHook(() => useStepper(), { wrapper })

    expect(result.current.step).toBe(0)
    expect(result.current.isFirst).toBe(true)
    expect(result.current.canGoTo(2)).toBe(false)

    // A raw jump to a step never reached is refused.
    act(() => result.current.goTo(2))
    expect(result.current.step).toBe(0)
  })

  it('unlocks steps as they are reached and tracks first/last', () => {
    const { result } = renderHook(() => useStepper(), { wrapper })

    act(() => result.current.next())
    expect(result.current.step).toBe(1)

    act(() => result.current.next())
    expect(result.current.step).toBe(2)
    expect(result.current.isLast).toBe(true)
  })

  it('keeps reached steps navigable after going back', () => {
    const { result } = renderHook(() => useStepper(), { wrapper })

    act(() => {
      result.current.next() // reach step 1
      result.current.next() // reach step 2
    })
    expect(result.current.maxReached).toBe(2)

    // Going back does not re-lock the steps already reached.
    act(() => result.current.goTo(0))
    expect(result.current.step).toBe(0)
    expect(result.current.canGoTo(2)).toBe(true)

    act(() => result.current.goTo(2))
    expect(result.current.step).toBe(2)
  })
})
