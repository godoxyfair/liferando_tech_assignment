# liferando_tech_assignment

Courier onboarding exercise. React + TypeScript + Vite.

## Tech choices

A wizard has two kinds of state. There is the form you are filling in right now,
and there is the whole application that has to survive while you move between
steps. I keep those two things separate.

**React Hook Form** runs each step's form. It is the usual choice for forms in
React and it handles the fiddly parts for me: validation, tracking which fields
were touched, keeping renders cheap, and moving focus to the first error. It
also lets me set an error on a field by its name, which fits this task well,
because the server replies with names like `documents.drivers_license.number`
that point straight at a field.

**Zustand** holds everything that lives above a single step: the data from all
three steps, the step you are on, and the submit status. I like it here because
it is a global store with almost no setup and no providers to wrap the app in.
Keeping this state outside the form is what makes two things simple. When the
server returns a 503 the user can just retry and nothing is lost, and resuming a
saved application is only a matter of filling the store and jumping to the first
unfinished step. Redux would be too much for this. Zustand is the right size.

**Yup** (through `@hookform/resolvers`) says what a valid step looks like:
required fields, a real email, at least 18 years old. The rules live in a schema
instead of inside the components, and the document step builds its schema from the
vehicle you picked, so the validation always matches what is on screen.

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
- `GET  /onboarding/applications/:id` (try id `resume-demo`)
- `POST /onboarding/applications/:id/submit`

The Vite dev server proxies `/api/*` to this mock (see `vite.config.ts`), so from
the app you can call `fetch('/api/onboarding/config')` without hardcoding the host.

## Path alias

`@/` resolves to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`):

```ts
import App from '@/App'
```

## Setup config

### Why both Oxlint and ESLint

We use Oxlint for speed and ESLint for depth, not the same job twice.

Oxlint is super fast, so it's great for the quick checks while you code (on-save,
pre-commit). ESLint is slower but understands TypeScript types, so it catches
things Oxlint can't yet (like unhandled promises).We lean on it in CI.

`eslint-plugin-oxlint` turns off the ESLint rules Oxlint already handles, so
nothing runs twice. Prettier owns formatting (`eslint-config-prettier` is last,
so lint rules stay out of its way).

## Tooling

- **Oxlint** + **ESLint** for linting (see [Setup config](#setup-config))
- **Prettier** for formatting (single quotes, no semicolons)
- **TypeScript** strict mode
