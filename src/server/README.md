# `src/server/` — server-only code

Everything here imports `"server-only"`, so it can never end up in the browser bundle, and none of it is an endpoint. The browser reaches it only through a server action (`src/actions/`) or a Route Handler (`src/app/api/`), both of which check the session first.

**Never put `"use server"` on a file in this folder.** That would turn every export into its own public endpoint and skip the session check of the action or handler that was meant to call it.

Overview of all four layers: [README.md](../../README.md#how-the-app-talks-to-the-api).

## The pieces

| File / folder           | Holds                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api.ts`                | `apiGet`, `apiPost`, `apiPut`, `apiDelete`. Every Laravel call goes through these: token first, paths from `API_ROUTES`, never cached, error handling in one place. `ErrorMode.THROW` (default) sends a 401 to logout, a 404 to `notFound()`, a 403 to the 403 page, and throws anything else; `ErrorMode.RESULT` returns the error in the `ApiResponse`. |
| `session.ts`            | `requireSession()` returns the session (and its token), or redirects when signed out or expired. `getSession()` returns `null` instead, for Route Handlers.                                                                                                                                                                                               |
| `routeHandler.ts`       | `withSession`, `toResponse`, `badRequest` for Route Handlers.                                                                                                                                                                                                                                                                                             |
| `data/<domain>.ts`      | Reads.                                                                                                                                                                                                                                                                                                                                                    |
| `mutations/<domain>.ts` | Write steps shared by more than one action.                                                                                                                                                                                                                                                                                                               |

## `data/` — reads

Readers are shared by two callers: Server Components import them to render a page, and Route Handlers wrap them for reads the browser makes later. Keeping them here, not inside a route file, is what lets both use the same function.

Caching is decided in the reader:

- Per-user data that pages reuse (the current user, layout reads, admin and custodian lists) uses `'use cache: private'` with a profile from `cacheProfiles.ts`. Nothing is stored on the server; the result is kept in the user's browser.
- A cached reader **throws** on error. Whatever it returns is cached, so a returned 500 would stick for the whole cache lifetime.
- Live data (task and query status, collection health) and anything driven by typed search input is never cached.
- Never use shared `'use cache'` for API data: the token would have to be part of the cache key.

## `mutations/` — shared write steps

Only for steps that more than one action needs, e.g. `addCollectionToWorkgroupIds`, used by `saveCollection`, `updateCollections` and `requestCollectionsActive`. The helper takes the token as an argument; the action gets it from `requireSession()` and calls `refresh()`.

An action whose API call isn't shared calls `apiPost` / `apiPut` / `apiDelete` itself; don't move it here just for tidiness.
