# liferando_tech_assignment

Courier onboarding exercise. React + TypeScript + Vite.

## Requirements

- Node.js 20+
- npm (project uses `package-lock.json` — do not use yarn/pnpm)

## Setup

```bash
npm install
```

## Scripts

Start Vite dev server (HMR):

```bash
npm run dev
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

### Editor formatting

`.vscode/settings.json` turns on format-on-save (Prettier + ESLint autofix) and
`.vscode/extensions.json` recommends the extensions. Both are committed so
everyone gets the same setup.

## Tooling

- **Oxlint** + **ESLint** for linting (see [Setup config](#setup-config))
- **Prettier** for formatting (single quotes, no semicolons)
- **TypeScript** strict mode
