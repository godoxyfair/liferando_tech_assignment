import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StepperProvider } from './StepperProvider'
import { Stepper } from './Stepper'

const labels = ['Personal', 'Eligibility', 'Documents']

function renderStepper() {
  function wrapper({ children }: { children: ReactNode }) {
    return <StepperProvider count={labels.length}>{children}</StepperProvider>
  }

  return render(<Stepper labels={labels} />, { wrapper })
}

describe('Stepper mobile variant', () => {
  beforeEach(() => {
    vi.stubGlobal('innerWidth', 500)
    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('exposes the numeric position to screen readers', () => {
    renderStepper()

    expect(screen.getByText(/Step 1 of 3/)).toBeInTheDocument()
  })
})
