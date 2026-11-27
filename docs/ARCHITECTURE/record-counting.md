# Record counting (DP-1293 spike)

Lets a query return how many specimen records match, alongside how many people. It sits behind the global-only flag `query-record-counting`, which is off by default.

## End to end

1. **API, when BUNNY polls for a task** (`RecordCountUnits`). If the flag is on and the translated cohort has at least one `Specimen` inclusion (`=`) rule, the `nextjob` response includes `count_units: ["Specimen"]`. Any other query is sent as before.
2. **BUNNY** checks `count_units` again. Each counted table needs at least one inclusion rule, must be listed in `OMOP_COUNTABLE_VARCATS`, and needs `OMOP_SPECIMEN_ENABLED` on; otherwise the task fails. BUNNY counts the specimen rows that belong to people in the cohort and match any of the Specimen inclusion rules. A specimen that matches two rules is counted once. It returns `count: { person, specimen }` instead of a plain number.
3. **API, on receiving the result.** `count` is still the person count. The other units go into `result.metadata.record_counts`, e.g. `{ "specimen": 1500 }`. A count object without a `person` key, or with a non-numeric value, is rejected with a 400.
4. **Web.** `GET /queries/{pid}` already returns `tasks[].result.metadata`. `getSpecimenCount` (`src/modules/QueryResultsTable/recordCounts.ts`) reads it without a cast. `QueryResultsTable` adds a **Specimens** column and renames **Total records** to **People** when the flag is on and at least one dataset returned a specimen count. Otherwise the table is unchanged.

## Disclosure control

The specimen count is suppressed to 0 whenever the cohort's person count for those rows falls under BUNNY's low-number threshold. Otherwise it is rounded to `ROUNDING_TARGET`, like the person count. A specimen count is never shown for a dataset whose person count was suppressed.

## Limits of the spike

- Only specimens, and only for a query with at least one specimen inclusion rule.
- The default sort is still by person count.
- The flag is read by both the API (whether BUNNY is asked) and the web (whether the column shows). Results stored while the flag was on stay hidden after it is turned off.
