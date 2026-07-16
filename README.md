# liferando_tech_assignment

Courier onboarding exercise. React + TypeScript + Vite.

## Tech choices

A wizard has three kinds of state, and each lives in its own place.

**React Hook Form** owns the form values for all steps. One `useForm` sits
above the steps and stays mounted while you navigate, so nothing you typed is
ever lost — moving between steps, failing validation, or getting a 503 on
submit all leave your input intact (retry is just pressing the button again).
RHF also lets me set an error on a field by its name, which fits this task
well, because the server replies with names like
`documents.drivers_license.number`

**Zustand** holds the async lifecycle: config loading, resume loading, submit status. Components
only read statuses; the fetching itself lives in a service class
(`onboarding.form-service.ts`) that writes results into the store. Redux would
be too much for this. Zustand is the right size.

**A per-provider stepper store** owns navigation. The current step and the
furthest step reached. Steps you have visited stay clickable in the header,
steps ahead stay locked.

**Yup** says what a valid step looks like: required fields, a real email, at least 18 years old. The rules live in a schema instead of inside the components, and the document step builds its schema from the vehicle you picked, so the validation always matches what is on screen.

## Decisions and tradeoffs

- **Documents are config-driven.** Step 3 renders exactly the chosen vehicle's
  `requiredDocuments` from `/onboarding/config`. The form model keeps a slot
  for every known document type, so a number entered for the shared
  `id_document` survives switching

- **Server errors map to fields, not banners.**
  `mapServerErrorToStep()` turns a dot-path like `personal.email` into a step.
  On 422/409 every error lands on its field via `setError`, the wizard
  navigates to the earliest affected step and focuses the first errored field.
  The notification banner is reserved for 503/network failures, where the fix
  is retrying with all input preserved.

- **City list** The city field is a Headless UI combobox in
  virtual mode: only visible options render, so filtering and typing stay
  smooth.

- **Accessibility.** Native `<label htmlFor>` on every control, errors
  announced via `role="alert"` and tied to inputs with `aria-describedby`,
  focus moves to the step container on navigation and to the first invalid
  field on failed validation or server errors, the stepper exposes
  current/completed/invalid state to screen readers, and animations respect
  `prefers-reduced-motion`. I hope thats covered almost all cases.

- **Resume.** Open `/?resume=resume-demo` to fetch the saved
  application, prefill the wizard and land on the first incomplete step. If the fetch fails you get a warning.

## Tests

Wrote unit test and integrations, no e2e it's no neded for this app

```bash
npm run test:run
```

Three integration tests cover the parts that carry real logic: the
config-driven document step, including the shared `id_document` number
surviving a vehicle change, step validation blocking Continue plus the age-18
rule, and a 422 dot-path error landing on the right field on the right step
with focus. Pure helpers `mapServerErrorToStep`, the schema, the payload
builder and the stepper store have their own unit tests.

## Requirements

- Node.js 20+
- npm (project uses `package-lock.json` — do not use yarn/pnpm)

## Quick start

One command runs the app and the mock API together:

```bash
npm install
npm start
```

- mock API → `http://localhost:4000` (`npm run api`)
- app (Vite dev server) → `http://localhost:5173` (`npm run dev`)

## Scripts

Start app + mock API together (concurrently):

```bash
npm start
```

Start Vite dev server only (HMR):

```bash
npm run dev
```

Start the mock API only:

```bash
npm run api
```

Type-check (`tsc -b`) + production build to `dist/`:

```bash
npm run build
```

Serve the production build locally:

```bash
npm run preview
```

Lint with Oxlint (fast):

```bash
npm run lint
```

Lint with ESLint (typescript-eslint + react-hooks):

```bash
npm run lint:eslint
```

Format all files with Prettier:

```bash
npm run format
```

Run tests once

```bash
npm run test:run
npm run test
```

Check formatting without writing:

```bash
npm run format:check
```

## Mock API

A zero-dependency mock server lives in `public/server.mjs` and serves on
`http://localhost:4000`.

```bash
node public/server.mjs
```

Endpoints:

- `GET  /onboarding/config`
- `GET  /onboarding/applications/:id` (try id `resume-demo`, used by `/?resume=resume-demo`)
- `POST /onboarding/applications/:id/submit`

The Vite dev server proxies `/api/*` to this mock (see `vite.config.ts`), so from
the app you can call `fetch('/api/onboarding/config')` without hardcoding the host.

## Path alias

`@/` resolves to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`):

```ts
import App from '@/App'
```

## Setup config

### Oxlint and ESLint

So I worked primary with eslint and here I tried to combine two
tools.

We use Oxlint for speed and ESLint for depth, not the same job twice. Oxlint is super fast, so it's great for the quick checks while you code (on-save, pre-commit). ESLint is slower but understands TypeScript types, so it catches things Oxlint can't yet (like unhandled promises).We lean on it in CI.

`eslint-plugin-oxlint` turns off the ESLint rules Oxlint already handles, so
nothing runs twice. Prettier owns formatting (`eslint-config-prettier` is last,
so lint rules stay out of its way).

## Tooling

- **Oxlint** + **ESLint** for linting (see [Setup config](#setup-config))
- **Prettier** for formatting (single quotes, no semicolons)
- **TypeScript** strict mode
