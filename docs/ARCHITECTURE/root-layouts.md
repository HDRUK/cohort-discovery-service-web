# Root layouts and sign-out

Why `src/app/` has no top-level `layout.tsx`, and three route groups that each render their own root layout. Ticket DP-1294 (stack ticket W6).

## The problem

The signed-in and signed-out pages used to share one root layout, `src/app/layout.tsx`. With Cache Components on, the Next 16 router keeps previous route trees mounted but hidden in React `<Activity>` (`next/dist/client/components/layout-router.js`, up to 3 per level). A navigation inside one root layout is always a client-side one, including the redirect a Server Component raises.

So when a session ended while the user was moving around the app (cookie cleared, signed out in another tab, token expired), clicking a header menu item such as Configuration went:

1. `router.push` → the page's read calls `requireSession()` (`src/server/session.ts`) → `redirect()`.
2. Next's redirect boundary turns that into a client-side `router.replace` to `/login` (or `routes.logout`, whose 307 the RSC fetch follows to `/login`, so it is still client-side).
3. `/login` renders, but the previous user's `(protected)` tree stays mounted and hidden: their header, name and role menu, the `SessionDataProvider` promise, Zustand and TanStack state, and their private cached reads.

That breaks the rule that no client state survives a sign-out, and on a shared machine it leaves the previous user's details in the page.

## The fix

Next does a full page load whenever a navigation crosses root layouts (`route-groups.md`, "Full page load"; `layout.md`, "Root layout"). Each group renders the document itself:

| Group | Root layout | Contains |
|---|---|---|
| `(signed-in)` | `(signed-in)/layout.tsx` | `/` (redirects to the dashboard), `forbidden.tsx`, and `(protected)/` with everything behind a session |
| `(public)` | `(public)/layout.tsx` | `/login`, `/auth/*`, `/about`, `/terms-and-conditions` |
| `(error)` | `(error)/layout.tsx` | `/403`, `/user-not-found` |

The shared `<html>`/`<body>`, fonts, theme and providers live in `src/components/RootDocument/`; the shared `metadata` is `ROOT_METADATA` in `src/config/metadata.ts`.

Any route from a signed-in page to `/login` or `/403` is now a full page load, whatever starts it: a server `redirect()`, `router.push` or a `<Link>`. Nothing in the header, the menus or `requireSession` needed to change.

`(protected)` sits one level below `(signed-in)` rather than being the root itself, so `forbidden()` and `notFound()` thrown by `SessionGate` in the `(protected)` layout are still caught by the boundary above it (`(signed-in)/forbidden.tsx`).

Unmatched URLs render Next's default 404 (`/_not-found`); no `global-not-found.tsx` is needed.

## Consequences

- Every move between groups is a full page load: standalone sign-in, the footer's terms and about links, an API 403 redirecting to `/403`, and the HDR UK header links. In-memory state that isn't saved (the query builder) does not survive those moves.
- Navigation inside `(signed-in)` is unchanged, so the caching measurements in `docs/cache-components/` still hold.
- A tab whose session ended elsewhere still shows the old user on pages that make no request, such as `/profile`, until something reaches the server. That is a separate problem.

## Tests

`cypress/e2e/auth/signed-out-navigation.cy.ts` signs in as an admin, ends the session (cookie cleared, or an expired token), clicks Configuration, and checks that `/login` came from a full page load with no user name, avatar or menu left in the page.
