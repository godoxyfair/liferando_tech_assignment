import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError } from 'axios'
import type { AxiosResponse } from 'axios'
import type { ChangeEvent, ReactNode, Ref } from 'react'
import { testConfig } from '@/test/moks/onboarding-config'
import { onboardingApi } from '@/api/onboarding-form/onboarding.service'
import { OnboardingWizard } from '../components/wizard/onboarding-wizard.component'
import { onboardingFormService } from '../service/onboarding.form-service'
import { SubmitStatus } from '../store/onboarding.store'
import type {
  OnboardingApplication,
  ServerErrorBody,
  VehicleTypeId,
} from '../onboarding.types'

interface PieTextInputMockProps {
  id?: string
  name?: string
  type?: string
  value?: string
  placeholder?: string
  status?: string
  assistiveText?: string
  autocomplete?: string
  inputmode?: string
  ref?: Ref<HTMLInputElement>
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
}

vi.mock('@justeattakeaway/pie-webc/react/text-input', () => ({
  PieTextInput: ({
    id,
    name,
    type,
    value,
    placeholder,
    assistiveText,
    ref,
    onChange,
    onBlur,
  }: PieTextInputMockProps) => (
    <>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        ref={ref}
        onChange={onChange}
        onBlur={onBlur}
      />
      {assistiveText && <span role="alert">{assistiveText}</span>}
    </>
  ),
}))

interface PieButtonMockProps {
  children?: ReactNode
  type?: 'button' | 'submit'
  isLoading?: boolean
  disabled?: boolean
  onClick?: () => void
}

vi.mock('@justeattakeaway/pie-webc/react/button', () => ({
  PieButton: ({
    children,
    type,
    isLoading,
    disabled,
    onClick,
  }: PieButtonMockProps) => (
    <button
      type={type}
      disabled={disabled}
      data-loading={isLoading || undefined}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}))

interface PieNotificationMockProps {
  children?: ReactNode
  heading?: string
  isOpen?: boolean
}

vi.mock('@justeattakeaway/pie-webc/react/notification', () => ({
  PieNotification: ({ children, heading, isOpen }: PieNotificationMockProps) =>
    isOpen ? (
      <div role="alert">
        <strong>{heading}</strong>
        <div>{children}</div>
      </div>
    ) : null,
}))

interface PieAssistiveTextMockProps {
  id?: string
  message?: string
}

vi.mock('@justeattakeaway/pie-webc/react/assistive-text', () => ({
  PieAssistiveText: ({ id, message }: PieAssistiveTextMockProps) => (
    <span id={id} role="alert">
      {message}
    </span>
  ),
}))

function applicationWith(
  vehicleType: VehicleTypeId,
  documentNumbers: Partial<Record<string, string>>,
): OnboardingApplication {
  return {
    applicationId: 'app-under-test',
    personal: {
      firstName: 'Mara',
      lastName: 'Voss',
      email: 'mara@example.com',
      dateOfBirth: '1996-04-12',
    },
    eligibility: { city: 'Berlin', vehicleType },
    documents: Object.entries(documentNumbers).map(([type, number]) => ({
      type: type as OnboardingApplication['documents'][number]['type'],
      number: number ?? '',
    })),
  }
}

function renderWizard(prefillApplication: OnboardingApplication | null = null) {
  return render(
    <OnboardingWizard
      config={testConfig}
      prefillApplication={prefillApplication}
      resumeError={null}
    />,
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
  onboardingFormService.store.setState({
    submitStatus: SubmitStatus.Idle,
    submitError: null,
    applicationId: null,
  })
})

describe('OnboardingWizard', () => {
  it('rebuilds the documents step on vehicle change and keeps the shared number', async () => {
    const user = userEvent.setup()
    renderWizard(
      applicationWith('car', {
        id_document: 'ID-1',
        drivers_license: 'DL-9',
        vehicle_insurance: 'INS-5',
        vehicle_registration: 'REG-3',
      }),
    )

    expect(await screen.findByText('Review your application')).toBeVisible()

    await user.click(screen.getByRole('button', { name: /Eligibility/ }))
    await user.click(await screen.findByLabelText('Vehicle type'))
    await user.click(await screen.findByRole('option', { name: 'Bicycle' }))

    await user.click(screen.getByRole('button', { name: /Documents/ }))

    expect(await screen.findByLabelText('ID Document number')).toHaveValue(
      'ID-1',
    )
    expect(
      screen.queryByLabelText("Driver's Licence number"),
    ).not.toBeInTheDocument()
  })

  it('blocks advancing while the step is invalid and enforces the age rule', async () => {
    const user = userEvent.setup()
    renderWizard()

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(await screen.findByText('First name is required.')).toBeVisible()
    expect(screen.getByText('Your details')).toBeVisible()

    await user.type(screen.getByLabelText('First name'), 'Mara')
    await user.type(screen.getByLabelText('Last name'), 'Voss')
    await user.type(screen.getByLabelText('Email address'), 'mara@example.com')
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '2015-06-01' },
    })

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(
      await screen.findByText('You must be at least 18 years old.'),
    ).toBeVisible()
    expect(screen.getByText('Your details')).toBeVisible()
  })

  it('maps a 422 dot-path error onto its field, navigates there and focuses it', async () => {
    const user = userEvent.setup()
    const response = {
      status: 422,
      data: {
        errors: [
          {
            field: 'documents.drivers_license.number',
            message: 'This document number is already on file.',
          },
        ],
      },
    } as AxiosResponse<ServerErrorBody>

    vi.spyOn(onboardingApi, 'submitApplication').mockRejectedValue(
      new AxiosError(
        'Unprocessable Content',
        'ERR_BAD_REQUEST',
        undefined,
        undefined,
        response,
      ),
    )

    renderWizard(
      applicationWith('scooter', {
        id_document: 'ID-1',
        drivers_license: 'DUPLICATE',
        vehicle_insurance: 'INS-5',
      }),
    )

    await user.click(
      await screen.findByRole('button', { name: 'Submit application' }),
    )

    expect(
      await screen.findByText('This document number is already on file.'),
    ).toBeVisible()
    expect(screen.getByText('Required documents')).toBeVisible()
    expect(
      screen.queryByText("We couldn't submit your application"),
    ).not.toBeInTheDocument()

    await waitFor(() =>
      expect(screen.getByLabelText("Driver's Licence number")).toHaveFocus(),
    )
  })
})
