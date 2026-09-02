# `GET /collections/{id}/task-history` — notes for the API

**The frontend works against the endpoint as it stands.** Nothing here blocks
it. This records one field-name mismatch worth fixing, and one optimisation
worth doing if the endpoint ever has to serve busy collections.

## What the frontend does today

The collection health page plots **concurrency** (runs in flight over time) and
**duration** (p50/p95 over time). The endpoint returns a paginated task list and
one whole-range summary — neither is a time series, so the frontend bins the
task list itself: each task's `runs[]` carries `claimed_at`, `finished_at` and
`duration_ms`, which is everything the bins need.

It pages through the list at `per_page=100` (up to 10 pages) and bins what it
gets, telling the user when a range held more tasks than that.

Its nearest-rank percentiles reproduce the summary's `CUME_DIST()` figures
exactly — for the three-task hour we tested against, both give min 2132, avg
2339, p50 2334, p95 2552, max 2552.

## One thing to fix

`duration_ms` in the summary uses `runs_measured` for the sample size. Please
keep that name if the shape below is ever added, so the two agree. (The
frontend types already use it.)

**Confirmed, no change needed.** `runs_measured` is the name in the aggregate
SQL, in the serialised response and in the Swagger annotation. Noted as the name
to reuse if a `series` block is ever added.

## The one accuracy limit

`claimed_at` and `finished_at` carry whole seconds, while `duration_ms` is
millisecond-accurate. Concurrency is derived from the timestamps, so for
sub-second runs it is quantised to the second — two 300ms runs in the same
second are indistinguishable from one. This is fine at the resolution the plots
are read at; it only becomes wrong if a collection starts running very short
tasks at high rate.

**Correction, from the API side:** this is not a serialisation choice, so
emitting milliseconds would not remove the limit. `create_task_runs_table`
declares all three timestamps with `$table->dateTime(...)`, which is MySQL
`DATETIME(0)`, so the fractional part is discarded **at write time** — a
millisecond-precision serialiser would only ever emit `.000`.

Removing the limit means migrating `task_runs.claimed_at`, `started_at` and
`finished_at` to `DATETIME(3)`, then checking the write paths in
`TaskController`, `TaskCleanupJob` and `TaskFailureRecorder` preserve the
fractions. That is an `ALTER TABLE` on a table other code already writes to, so
it is deliberately deferred until a collection actually runs short tasks at a
high enough rate for the quantisation to matter.

## The optimisation: a `series` block

Only worth doing when a collection is busy enough that a range holds more than
~1,000 tasks — at that point the frontend is truncating, and shipping the full
list to bin it in the browser is wasteful anyway.

```json
{
  "collection_id": 12,
  "from": "2026-09-02T09:00:00Z",
  "to": "2026-09-02T11:00:00Z",
  "bin": "10m",
  "summary": { "...": "unchanged" },
  "tasks": { "...": "unchanged" },
  "series": [
    {
      "bin": "2026-09-02T10:00:00Z",
      "minutes": 10,
      "started": 4,
      "finished": 3,
      "succeeded": 2,
      "failed": 1,
      "concurrency_avg": 1.4,
      "concurrency_max": 3,
      "duration_ms": {
        "runs_measured": 3,
        "min": 900,
        "avg": 2100,
        "p50": 1800,
        "p95": 4200,
        "max": 4400
      },
      "queued_for_ms_avg": 400
    }
  ]
}
```

It would take a `bin` query parameter using the same width grammar as
`/collections/{id}/health` (`1m`, `10m`, `6h`, `2d`, `4w`, plus the named
`minute`/`hour`/`day`/`week`/`month`) and the same `MAX_BINS` ceiling and 422.

Constraints, all of which the frontend's own binning already follows — so the
switch-over should be invisible:

- `from` inclusive, `to` **exclusive**. ISO-8601 Zulu throughout.
- Zero-filled and ascending. A silent collection returns a full series of zeros,
  not a short one.
- `minutes` is the bin's *elapsed* length: the last bin is usually still
  filling, and a bin wholly in the future has `minutes: 0`,
  `concurrency_*: null` and `duration_ms.runs_measured: 0`.
- The `task_type` and `status` filters apply to the series too. If they only
  filtered the list, the charts would contradict the table above them.

### Attribution — the part that must be spelled out

The two plots count different things and are attributed differently. Getting
this wrong gives plots that look plausible and disagree with each other.

- **Concurrency** is attributed by **overlap**: a run contributes to every bin
  its `[claimed_at, finished_at)` intersects. `concurrency_avg` is summed
  overlap-milliseconds ÷ the bin's length — a cheap `SUM(LEAST(finished,
  bin_end) - GREATEST(claimed, bin_start))`. `concurrency_max` is the peak
  simultaneous count and needs an event sweep; if that is expensive, send `null`
  and the frontend hides the dashed peak line.
- **Duration** is attributed by **`finished_at`**, so a bin's `duration_ms`
  covers exactly the runs its `finished` count covers. A long run therefore
  shows in the duration plot well after it shows in the concurrency plot. That
  is intended and the UI captions it.

### Timed-out runs

`TaskCleanupJob` records a timed-out run with `error_class = 'Timeout'` but
leaves `result_status` and `duration_ms` null — it has no end. So:

- **Concurrency**: count it, running to the timeout deadline (`claimed_at +
  timeout`), not to `now` and not to zero. Dropping it makes a stuck worker
  invisible in exactly the window where it matters. (The frontend currently
  holds such a run open to `now`, since it cannot see the timeout setting — one
  more reason to move this server-side eventually.)
- **Duration**: exclude it. Imputing the timeout value would put a false spike
  in `p95`.
- **Outcome counts**: `failed`, matching the timestamp-derived status that
  `statusPredicate()` already uses.
