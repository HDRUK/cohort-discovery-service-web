# `src/app/api/` — Route Handlers

Reads the browser makes **after** a page has rendered: polling task and query status, typeahead search, expanding a row, parsing a query. Each `route.ts` is a public endpoint, so it checks the session and its input itself.

Overview of all four layers: [README.md](../../../README.md#how-the-app-talks-to-the-api).

## What goes here

A thin wrapper around a reader from `src/server/data/`:

```ts
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ pid: string }> },
) {
  return withSession(async () => {
    const { pid } = await params;
    if (!isPid(pid)) return badRequest("Invalid task pid");

    return getTask(pid);
  });
}
```

- `withSession` (`src/server/routeHandler.ts`) answers **401** when there is no session and turns the reader's `ApiResponse` into a `Response`. A Route Handler never redirects; the browser handles a 401 by ending the session.
- Params and bodies are checked field by field by a pure parser in `src/utils/routeParams.ts`, returning **400** when invalid. Never pass caller input straight to the API.
- The reader is called with `ErrorMode.RESULT`, so the API's status passes through instead of turning into a redirect.
- GET by default; POST only when the API takes a body (`concepts/search`, `parse-query`).

### Why concept search and parse-query are POST Route Handlers, not server actions

Both are reads: nothing is stored. They are POST only because the Laravel endpoints they wrap take a JSON body.

- **Not server actions.** Next runs server actions one at a time per client, and they exist for mutations. A typeahead search or a parse would queue behind any save in flight, and results would arrive in order rather than as soon as they are ready. Route Handlers run in parallel, and TanStack can cache, dedupe and cancel them like any other read.
- **Not GET.** `parse-query` takes up to 10,000 characters of free text, which is too long for a URL and would put the user's query text into access and proxy logs. `concepts/search` could be a GET, but it stays POST so the two body-taking reads work the same way.
- Like every handler here they check the session (`withSession`) and parse the body field by field (`parseSearchConceptsBody`, `parseParseQueryBody` in `src/utils/routeParams.ts`) before calling the reader.

The browser calls these with `routeGet` / `routePost` (`src/lib/routeFetch.ts`), usually from a TanStack `queryFn` keyed by `QUERY_KEYS` (`src/config/tags.ts`). Handler URLs live under `routes.api` in `src/config/routes.ts`.

### Handlers that don't use `withSession`

| Handler | Why |
| --- | --- |
| `auth/logout` | Must work without a session; clears the cookie and redirects. |
| `auth/sso/callback` | Runs before there is a session; it creates one. |
| `collection-hosts/[id]` | Returns credentials, so it checks `getSession()` itself and answers `no-store`. |
| `download/[pid]` | Streams a file. It reads the cookie and calls Laravel directly; moving it onto `src/server/api.ts` is a follow-up. |
| `location/boundaries/[region]` | Serves static GeoJSON from the repo; no API call and no user data. |

## What doesn't

- **Data a page needs to render.** A Server Component imports the reader from `src/server/data/` directly; it doesn't fetch its own Route Handler.
- **Mutations.** Use a server action in `src/actions/`.
- **API calls inline.** Put the call in a reader in `src/server/data/` so Server Components can share it.
