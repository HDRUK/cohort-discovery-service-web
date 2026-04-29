# Contributing to Cohort Discovery Service - Web

This document describes the expected workflow and standards for contributions to `cohort-discovery-service-web`.

## Prerequisites

- Node.js (use a current LTS locally; CI runs Node 22)
- npm
- Access to the Cohort Discovery Service API for local testing

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Start the app:

```bash
npm run dev
```

## Branch and PR Flow

- Open feature/fix branches from `dev` unless your team process says otherwise.
- Merge into `dev` for DEV deployment pipeline.
- `main` is used for release automation (`semantic-release`).

## Pull Request Standards

Use the PR template at `.github/pull_request_template.md`.

### PR title format (enforced in CI)

Use one of:

- `feat(DP-1234): short description`
- `fix!(DP-5678): short description`
- `RELEASE: vX.Y.Z`

Accepted types include:

- `feat`
- `fix`
- `chore`
- `docs`
- `style`
- `refactor`
- `test`
- `perf`

## Required Checks Before Review

Run locally before requesting review:

```bash
npm run lint
npm run test
npm run build
npm run lint:workflows
```

For UI-heavy changes, also run:

```bash
npm run build-storybook
```

CI also runs lint, tests, build, and Storybook build.

`lint:workflows` requires `actionlint` on your machine (for example: `brew install actionlint`).

## Coding Patterns in This Repo

- Use `@/` aliases for internal imports.
- Keep routing URL construction in `src/config/routes.ts`.
- Put backend calls in server actions under `src/actions` using shared API helpers (`apiGet`, `apiPost`, etc.).
- Avoid ad-hoc fetch calls in client components when a server action pattern exists.
- Be careful with caching:
  - Use `cacheOptions: { useCache: false }` for side-effectful endpoints.
  - Use cached fetches for read-only data where appropriate.
- Follow existing naming conventions:
  - Components/modules: PascalCase
  - Hooks: `use*`
  - Utility files: lower camel/snake style used in folder

## Testing Guidance

- Add or update tests when behavior changes.
- Prefer focused tests around changed logic (hooks, actions, and UI behavior).
- Include manual validation notes in your PR for flows that are hard to automate.

## Documentation

Update docs when relevant:

- `README.md` for setup/runtime changes
- `CONTRIBUTING.md` for workflow/policy changes
- Inline comments only where logic is non-obvious

## Release Notes and Commits

This repo uses `semantic-release` on `main`.

- Conventional commit types drive changelog categories.
- Jira-style issue prefixes are configured (`DP`, `TPD`, `GAT`).
- Keep commit messages and PR summaries clear and scoped.
