# Collection concept scan panel

`CollectionDetails` (`src/components/CollectionsTable/CollectionDetails.tsx`) is the expanded row on the admin collections table, behind the `adminMoreCollectionDetails` flag.

## Details panel

The panel is headed **Last successful concept scan** and shows the scan the concept count comes from: task ID, result file ID, name, completed at, rows processed and number of concepts. The scan is `latest_successful_concept_result_file` from the details endpoint. The API only treats a `code.distribution` file as successful when it is `done` and produced concepts, so an empty newer scan never replaces it. See `docs/ARCHITECTURE/collection-concept-scan.md` in `project-daphne-api`.

When the newest `code.distribution` file is a different file, a **Latest attempt** chip explains why it was not used (`Task 17800 returned 0 rows`, `Task N failed`, `Task N produced no concepts`, or its in-flight status).

With no successful scan the panel says so instead of showing 0 concepts.

`Collection created` and `Collection updated` are the collection row's own timestamps. They do not move when a scan runs.

## Result Files table

The **Concept scan** column marks the file used for the concept count (`Used for concept count`), done files with 0 rows (`Empty (0 rows)`) and failed scans (`Failed`). Metadata files carry no chip.

`Completed At` is the task's `completed_at`.

## Derivation

`getScanSummary` (`scanSummary.ts`) takes the successful scan from the API and derives the latest attempt as the newest `code.distribution` entry in `result_files`. The FE does not re-decide what is successful, so it cannot drift from the API's `nconcepts`.

The API change must be deployed first. Without `latest_successful_concept_result_file` the panel shows the empty state.
