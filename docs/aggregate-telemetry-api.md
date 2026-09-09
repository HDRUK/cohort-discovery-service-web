# Bulk collection-telemetry endpoints (follow-up to DP-1120)

> **AI disclosure:** Drafted with AI (Claude Code) while building the aggregated
> telemetry tab. Verified against source in both repos; line references are to
> `project-daphne-api` on `feat/DP-1120-collection-task-history`.

## Why

The admin collection-health section now has a **Telemetry** tab that plots host
polling for several collections on one chart. It fans out one
`GET /v1/collections/{id}/health` per collection, bounded to 8 by the plot's colour
ceiling.

That is affordable for polling and nothing else. Two things are blocked on the API:

1. **Task activity cannot be aggregated at all.** `/v1/collections/{id}/task-history`
   returns _raw tasks_; binning happens in the browser in
   `src/modules/CollectionHealth/taskSeries.ts`. `getCollectionTaskHistory` already
   fans out to `MAX_PAGES = 10` internally, so aggregating 8 collections is up to 88
   requests, each running 3 SQL statements. `docs/perf-followups.md` §1 records this
   exact shape stalling for **8–24 seconds at ~24 concurrent** against the
   single-threaded dev API.
2. **The polling fan-out will not scale past the current ~24 collections.** Every
   request writes an audit row via
   `$activityLogger->viewed('collection_health', …)` (`CollectionHealthController.php:162`),
   and the list view refreshes every 10s (`REFRESH_INTERVAL` in `useCollectionHealth.ts`).

## Proposed endpoints

```
GET /api/v1/admin/collections/health?bin=&from=&to=&collection_ids=
GET /api/v1/admin/collections/task-activity?bin=&from=&to=&collection_ids=&task_type=
```

Both returning one bin skeleton and per-collection series keyed by pid:

```json
{
  "bin": "10m",
  "from": "2026-09-09T09:00:00Z",
  "to": "2026-09-09T10:00:00Z",
  "collections": {
    "<pid>": {
      "summary": { "a": {}, "b": {} },
      "series": { "a": [], "b": [] }
    }
  }
}
```

This compresses well: every collection shares the same zero-filled bin grid, so the
response is one skeleton plus N × 2 arrays of numbers.

### Health is a small change

`CollectionHealthService.php:113-121` is already shaped for it. The aggregate query
filters `WHERE collection_id = ?` and groups by `task_type, bin`; it needs
`WHERE collection_id IN (?)` plus `collection_id` in the `GROUP BY` and in the index
prefix. `cpb_collection_minute_idx` on `(collection_id, bucket_minute)` still serves
the range scan.

### Task activity must bin server-side

This is the whole point — returning raw tasks and binning in the browser is what makes
the current endpoint unusable in aggregate. The client-side shape to mirror is
`TaskSeriesPoint` in `src/modules/CollectionHealth/taskSeries.ts`: per bin, `started`,
`finished`, `succeeded`, `failed`, `concurrency_avg`, `concurrency_max`, `duration_ms`
percentiles and `queued_for_ms_avg`. Note `concurrency_max` needs interval overlap per
bin, not a plain count, so it is a genuine aggregation rather than a `GROUP BY` over
`created_at`.

## Three decisions to make before implementing

1. **The bin ceiling should become `bins × collections ≤ max`.**
   `config/system.php:59` caps bins per request at 2,000
   (`collection_health_max_bins`), enforced at `CollectionHealthService.php:53-60`.
   Under a fan-out that becomes an unguarded `2000 × N`, which no single request
   currently sees. `bins × collections` is the correct invariant, and the frontend
   already mirrors the per-request limit as `MAX_BINS` in
   `src/modules/CollectionHealth/timeRange.ts`.

2. **Authorisation is not the same as the per-collection route.**
   `/v1/collections/{id}/health` gates on `CollectionPolicy::view` — admin **or** a
   member of that collection's custodian (`app/Policies/CollectionPolicy.php:11-22`),
   so custodian users can use it. `/v1/admin/collections` gates admin-only via
   `authorize('viewAnyForAdmin', …)` (`CollectionController.php:197`). A bulk endpoint
   must pick one: admin-only, or filter the requested ids through
   `CollectionPolicy::access` and return only the permitted subset. Silently dropping
   ids the caller cannot see is the safer default, but it needs to be documented so the
   frontend can tell "no data" from "not allowed".

3. **`to` inclusivity differs between the two existing endpoints** — exclusive on
   `/health`, inclusive on `/task-history`, deliberately, and documented in both
   OpenAPI blocks. The bulk pair should agree with each other; if they keep the
   existing split, say so in the annotations, because a client reusing one range object
   across both is otherwise off by one bin.

## Also worth doing

`collection_ping_buckets` has **no pruning job**. At one row per collection × task type
× minute that is ~2,880 rows/day/collection, growing without bound.

## Frontend follow-up once these land

- Replace `useAggregateHealth`'s `useQueries` fan-out
  (`src/modules/CollectionHealth/useAggregateHealth.ts`) with a single action.
- Add a second plot to the Telemetry tab using the existing
  `MultiSeriesLineChart` — the component and its filters are already generic over
  series, so this is mostly a data-shape change.
- The 8-collection colour ceiling is a visualisation limit, not an API one, and stays
  either way.
