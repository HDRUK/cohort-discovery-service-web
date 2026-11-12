# `src/actions/` — server actions

Every file here starts with `"use server"`, which turns each export into a **public POST endpoint** the browser can call. Treat each one like an API route: anyone with a session can call it with any arguments.

Overview of all four layers: [README.md](../../README.md#how-the-app-talks-to-the-api).

## What goes here

One file per user intent (`src/actions/<domain>/<intent>.ts`), named after the file, `export default`, with an explicit `Promise<...>` return type. Each action:

1. Calls `requireSession()` (`src/server/session.ts`) to get the token.
2. Makes its API calls through `src/server/api.ts`, with paths from `API_ROUTES` (`src/lib/apiRoutes.ts`). Write steps that another action also needs live in `src/server/mutations/`.
3. Calls `updateTag(CACHE_TAGS.x)` from `next/cache` for each cached read its write changes (tags in `src/config/tags.ts`). An action that changes only uncached data calls `refresh()` instead: `refresh()` does not clear cached reads in the browser, so a list would stay stale for its whole `stale` time.

```ts
"use server";

const restoreCollection = async (
  id: number | string,
): Promise<ApiResponse<Collection>> => {
  const { token } = await requireSession();
  const res = await apiPut<ApiResponse<Collection>, undefined>(
    token,
    API_ROUTES.restoreCollection(id),
    undefined,
    { errorMode: ErrorMode.RESULT },
  );
  updateTag(CACHE_TAGS.collections);
  updateTag(CACHE_TAGS.collectionHosts);
  return res;
};

export default restoreCollection;
```

One user change is one awaited action. If it has several steps, it runs them all on the server and returns which step failed rather than throwing, because production hides thrown messages from the browser (see `saveCollection.ts` and `src/server/mutations/runSaveSteps.ts`).

## What doesn't

- **Reads.** Next runs server actions one at a time per client, so a polling read would queue behind a save, and an action can't be cached. Reads the browser needs go through a Route Handler in `src/app/api/`.
- **Shared helpers.** Any exported helper in a `"use server"` file becomes its own endpoint, with no session check from the action that was meant to wrap it. Put shared write steps in `src/server/mutations/`.
- **Revalidating from the client.** The action expires its own tags; components just `await` it.
