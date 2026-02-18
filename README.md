# Cohort Discovery Service - Web

Frontend application for the Cohort Discovery Service, built with Next.js (App Router), React, and MUI.

## Prerequisites

- Node.js 24+
- npm 10+
- Cohort Discovery Service API running locally (default: `http://localhost:8100`)

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create and fill local env file:

```bash
cp .env.example .env
```

3. Start development server:

```bash
npm run dev
```

4. Open:

- `http://localhost:3000`

## Environment Variables

Use `.env.example` as the base:

| Variable | Required | Description |
| --- | --- | --- |
| `API_BASE_URL` | Yes | Backend API base URL used by server actions. |
| `NEXT_PUBLIC_LOGIN_URL` | Yes | Login URL used by the app when unauthenticated. |
| `APPLICATION_MODE` | Yes | `integrated` or `standalone`. Controls auth/access behavior. |
| `NEXT_PUBLIC_USE_EXAMPLE_QUERY` | No | Enables example query UX/debug helpers when `true`. |
| `NEXT_PUBLIC_USE_DEBUG_LOGS` | No | Enables extra client-side debug logging when `true`. |

## Available Scripts

- `npm run dev`: Start Next.js dev server (Turbopack) on port 3000.
- `npm run dev-debug`: Start dev server with Node inspector.
- `npm run build`: Create production build.
- `npm run start`: Start production server on port 3001.
- `npm run lint`: Run ESLint.
- `npm run lint:fix`: Run ESLint with fixes.
- `npm run test`: Run Jest tests.
- `npm run test:watch`: Run Jest in watch mode.
- `npm run storybook`: Start Storybook on port 6006.
- `npm run build-storybook`: Build Storybook static output.

## Project Structure

Key directories:

- `src/app`: App Router pages/layouts.
- `src/actions`: Server actions for API access.
- `src/modules`: Feature-level UI modules.
- `src/components`: Reusable UI components.
- `src/hooks`: Shared React hooks.
- `src/lib`: API client/auth/runtime utilities.
- `src/config`: App constants, route builders, tags, defaults.
- `src/types`: Shared TypeScript types.

## Testing and Linting

Run before opening a PR:

```bash
npm run lint
npm run test
```

## Docker

A `Dockerfile` is included for containerized builds.

Build:

```bash
docker build -t daphne-web .
```

Run:

```bash
docker run --rm -p 3001:3001 daphne-web
```

## Troubleshooting

- If auth redirects fail, verify `NEXT_PUBLIC_LOGIN_URL`.
- If queries fail to load, verify `API_BASE_URL` and that the API is reachable.
- If mode-specific routes behave unexpectedly, check `APPLICATION_MODE` is set correctly.
