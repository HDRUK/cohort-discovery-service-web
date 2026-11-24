# Collection concept scan panel

`CollectionDetails` (`src/components/CollectionsTable/CollectionDetails.tsx`) is the expanded row on the admin collections table, behind the `adminMoreCollectionDetails` flag.

## Layout

`CollectionDetails.tsx` only fetches and composes. Each piece has its own file beside it:

| File | Holds |
|------|-------|
| `CollectionMetadataTable.tsx` | The "Details / pid" table of collection metadata, currently created and updated |
| `ConceptScanDetails.tsx` | The "Concepts / pid" table, via `useTransposedTable` and `<Table>` |
| `ResultFilesTable.tsx` | The "Result Files / pid" table |
| `ConceptScanChip.tsx` | The outlined chip both tables use |
| `scanSummary.ts` | Pure logic, tested in `__tests__/scanSummary.test.ts` |

Types are in `src/types/collections.ts`. Labels, chip copy and the `code.distribution` file name are in `src/config/conceptScan.ts`.

## Concepts table

Titled **Concepts / pid**, with a line saying it shows the most recent scan that returned concepts. It lists the task ID, result file ID, name, completed at, rows processed and number of concepts of that scan. The scan is `latest_successful_concept_result_file` from the details endpoint. The API marks a `code.distribution` file with no concepts as `failed` when it is ingested, so only scans that returned concepts are `done` and an empty newer scan never replaces the last good one. See `docs/ARCHITECTURE/collection-concept-scan.md` in `project-daphne-api`.

When the newest `code.distribution` file is a different file, a **Latest attempt** chip explains why it was not used (`Task 17800 failed: No concepts found in file`, `Task N failed`, `Task N returned 0 rows` for an empty file ingested before the API started failing them, `Task N produced no concepts`, or its in-flight status).

With no successful scan the table says so and still shows the concept count.

## Details table

`Collection created` and `Collection updated` are the collection row's own timestamps. They sit in their own table because they do not move when a scan runs, and were being read as scan dates.

## Result Files table

The **Concept scan** column marks the file used for the concept count (`Used for concept count`), failed scans (`Failed`, with the reason in the Latest attempt chip) and done files with 0 rows (`Empty (0 rows)`), which only exist for files ingested before the API started failing empty scans. The API does not backfill them, so such a file stays the last successful scan until a newer scan succeeds. Metadata files carry no chip.

`Completed At` is the task's `completed_at`.

## Derivation

`getScanSummary` takes the successful scan from the API and derives the latest attempt as the newest `code.distribution` entry in `result_files`, ordered by `updated_at` then `id` exactly as the API orders its choice, so the two cannot disagree about which file is newest. The FE does not re-decide what is successful, so it cannot drift from the API's `nconcepts`.

The API change must be deployed first. Without `latest_successful_concept_result_file` the table shows the empty state.
