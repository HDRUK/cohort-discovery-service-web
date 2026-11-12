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
| `API_BASE_URL` | Yes | Backend API base URL, used only by server code (`src/server/api.ts`). |
| `NEXT_PUBLIC_LOGIN_URL` | Yes | Integrated mode: the full Gateway sign-in URL, used as is by the sign-in button and by logout, including the return param, e.g. `https://gateway.example.org?redirect_cohort_discovery_upon_signin=https://cds.example.org`. Its origin is the base for outbound organisation links; falls back to `links.organisation` in the branding config. |
| `APPLICATION_MODE` | Yes | `integrated` or `standalone`. Controls auth/access behaviour. |
| `NEXT_PUBLIC_TASK_URL` | Yes | API URL used for the task endpoints and the API docs footer link. |
| `NEXT_PUBLIC_USE_EXAMPLE_QUERY` | No | Enables example query UX/debug helpers when `true`. |
| `NEXT_PUBLIC_USE_DEBUG_LOGS` | No | Enables extra client-side debug logging when `true`. |
| `NEXT_PUBLIC_SUPPORT_URL` | No | Base URL for the support centre link. Defaults to the organisation URL. |
| `COOKIE_TOKEN_NAME` | No | Name of the session cookie. Defaults to `token`. |
| `HIDE_NAV` | No | Set to `1` to hide the header and top menu, for embedding the app in an iframe. |
| `CONFIG_SUPPORT_URL` | No | Support site used by the support pop-out. |
| `CONFIG_SERVICE_DESK_URL` | No | Service desk base URL. |
| `CONFIG_SERVICE_DESK_SUPPORT_SUFFIX` | No | Path appended to the service desk URL for support requests. |
| `CONFIG_SERVICE_DESK_REPORT_BUG_SUFFIX` | No | Path appended to the service desk URL for bug reports. |
| `DEFAULT_TABLE_REFRESH_INTERVAL` | No | Table auto-refresh interval, in milliseconds. |
| `DEFAULT_MAX_INVALID_REASONS` | No | Maximum invalid-reason messages shown at once. |
| `DEFAULT_SEARCH_PREFETCH` | No | Search prefetch threshold. |
| `DEFAULT_SEARCH_WAIT_TIME` | No | Search debounce, in milliseconds. |
| `DEFAULT_SEARCH_SUGGESTION_ROTATION` | No | Search suggestion rotation interval, in milliseconds. |
| `DEFAULT_LOCATION_MIN_RADIUS` | No | Minimum location search radius, in metres. |

`CONFIG_*` and `DEFAULT_*` are server-only and read per request in `src/providers/ServerDefaultProvider.tsx`, so they can be changed without a rebuild. Every `NEXT_PUBLIC_*` value is inlined into the client bundle at build time and needs a rebuild to change.

## Customising for your deployment

Everything specific to the organisation running this app lives in one top-level directory:

```
branding/
├── branding.config.ts        # product and organisation names, URLs, legal metadata
├── theme.ts                  # MUI palette and font overrides
├── assets/
│   └── logo.svg              # header logo
└── legal/
    ├── termsAndConditions.mdx
    └── privacyPolicy.mdx
```

Replace the contents of `branding/` and the app is yours. It ships with HDR UK's values so existing deployments are unchanged.

> **Replace the legal text before you deploy.** `branding/legal/` contains HDR UK's own terms and privacy policy, naming HDR UK as the data controller and giving its company number and contact addresses. Serving those unchanged from a deployment HDR UK does not operate is wrong and is very likely a data protection problem. Write your own, and clear the `sourceLabel` fields in `branding.config.ts` so the "this is the Gateway's policy" banner disappears.

### Theme

`branding/theme.ts` exports MUI `ThemeOptions` that are merged over the app's base theme, so anything you set wins — palette, typography, even component overrides. Colours must come from here rather than being hardcoded in components.

Fonts are loaded in `src/app/layout.tsx` through `next/font/google`; swap the font there and update `typography.fontFamily` in `branding/theme.ts` to match.

### Logo and icons

`branding/assets/logo.svg` is the header logo. It sits on the app bar, which uses the theme's `secondary` colour, so the artwork should read against that.

The browser favicon and app icon are `src/app/favicon.ico` and `src/app/icon.svg`. These cannot live under `branding/` because Next.js resolves them by filename from the app directory — replace them in place.

### HDR UK chrome

The shared `@hdruk/ui` header and footer embed the Health Data Research Gateway logo and an HDR UK copyright line that your branding config cannot override. They are used only in `integrated` mode, where the app is served inside the Gateway and that chrome is correct.

In `standalone` mode the app renders its own header and footer by default, taking their logo, links and copyright from `branding/`. You do not need to configure anything to opt out.

To bring the Gateway chrome back in standalone — for an HDR UK-run standalone deployment, say — set `hdrukChromeInStandalone: true` in `branding.config.ts`. You then get the HDR UK Gateway logo and your own `branding/assets/logo.svg` side by side in the header, and the HDR UK footer below.

It is all or nothing. The Gateway logo is rendered by the `@hdruk/ui` header itself and there is no prop to show the header without it, so you cannot take the two logos without also taking the HDR UK footer. If you want a single different mark instead, replace `branding/assets/logo.svg` and leave this switch off.

Setting the `hdruk-uk-theme` feature flag to false in the API forces the neutral chrome in both modes.

### Legal pages

In standalone mode `/terms-and-conditions` and `/about/privacy-policy` are served from `branding/legal/*.mdx`. In integrated mode those links point at the Gateway instead. The page title, last-updated date, and optional source banner for each come from the `legal` section of `branding.config.ts`.

## How the app talks to the API

The browser never calls Laravel. Every call goes through `src/server/api.ts` on the server, so the token and the API URL never reach the browser.

Two questions decide where API code goes: **can the browser call it?** and **does it read or write?**

|  | Read | Write |
| --- | --- | --- |
| **Browser can call it** (public endpoint) | [`src/app/api/**/route.ts`](src/app/api/README.md) | [`src/actions/<domain>/<intent>.ts`](src/actions/README.md) |
| **Server only** (`import "server-only"`) | [`src/server/data/<domain>.ts`](src/server/README.md#data--reads) | [`src/server/mutations/<domain>.ts`](src/server/README.md#mutations--shared-write-steps) |

```
Server Component ──────────────────────────────► server/data ──────┐
Browser ── routeGet / routePost ──► app/api ───► server/data ──────┤
Browser ── await the action ──────► actions ───► server/mutations ─┼─► server/api.ts ─► Laravel
                                       └───────────────────────────┘
```

| Situation | Use |
| --- | --- |
| Data a page needs to render | A Server Component that imports a reader from `src/server/data/` |
| Data the browser needs later (polling, typeahead, expand-on-click) | A Route Handler in `src/app/api/`, fetched with `routeGet` / `routePost` from a TanStack `queryFn` |
| The user changes something | A server action in `src/actions/`, which calls `updateTag` for each cached read it changes (`refresh()` when it changes only uncached data) |

Why they are separate:

- **`"use server"` makes every export a public POST endpoint.** So `src/actions/` holds only actions that check the session themselves, and shared helpers live in `src/server/`, where they can't be called from the browser.
- **Server actions run one at a time per client and can't be cached**, so they are for mutations only. Reads the browser makes go through Route Handlers, which run in parallel and answer 401 instead of redirecting.
- **A reader is needed by both pages and Route Handlers**, so it lives in `src/server/data/` rather than inside either.

### Getting server data to client components

| Data | How it reaches the component |
| --- | --- |
| Read by the page for one part of it (a paginated, URL-driven admin table) | Props from the Server Component that read it |
| Shared by many components (the user, the collections they can query, their custodians and workgroups) | `useSessionData()` / `useSessionUser()` |
| Shared across a section (admin users, collections, hosts; the custodian's section) | The section's context, which `use()`s a promise its layout passes in |
| Client state (query builder, UI state, selected ids) | Zustand. Store an id, never a server object |

Signing out is a full page load to `/api/auth/logout` (`useSignOut`), not a client navigation, so every store is dropped and the response's `Clear-Site-Data` applies.

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
- `src/actions`: Server actions, one per user change. See [How the app talks to the API](#how-the-app-talks-to-the-api).
- `src/server`: Server-only code: the API client, session helpers, reads (`data/`) and shared write steps (`mutations/`).
- `src/modules`: Feature-level UI modules.
- `src/components`: Reusable UI components.
- `src/hooks`: Shared React hooks.
- `src/lib`: Auth, route fetch and runtime utilities.
- `src/config`: App constants, route builders, tags, defaults.
- `src/types`: Shared TypeScript types.

## Testing and Linting

Run before opening a PR:

```bash
npm run lint
npm run test
```

## Troubleshooting

- If auth redirects fail, verify `NEXT_PUBLIC_LOGIN_URL`.
- If queries fail to load, verify `API_BASE_URL` and that the API is reachable.
- If mode-specific routes behave unexpectedly, check `APPLICATION_MODE` is set correctly.
