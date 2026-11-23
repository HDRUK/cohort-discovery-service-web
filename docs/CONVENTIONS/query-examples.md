# Query examples

The "Query Examples" list in the NLP search dropdown comes from `src/config/queryExamples.ts`.

## How they work

Clicking an example loads its pre-built query JSON straight into the query builder (`SearchOverlay` calls `setQueryBuilderJson`). It does not call the NLP service and does not check any dataset. The label text is display only, so the JSON must be checked by hand to match it.

Examples are dataset-agnostic. OMOP concept ids are shared across datasets, so the query is valid everywhere. A dataset without matching records returns a low or suppressed count, as it would for a typed query. Prefer common concepts so examples are likely to return results.

## Adding or changing an example

1. **Use the exact standard concept.** Check `concept_id`, `name` and `category` against the OMOP `concept` table. For example, Dementia is `4182210` (Condition), not "Dementia test" (Procedure).
2. **Store a clean query.** Do not paste raw NLP output with `valid: false`, `invalidReason` or unresolved `alternatives`. Clicking an example should give a ready-to-run query.
3. **One JSON per feature-flag shape.** When the `query-builder-use-demographic-rule` flag is off, age is an age-filter rule node (`{ "value": [18, 120] }`). When it is on, age goes in a `demographics` block. If an example includes age or sex, add both `src/data/examples/query_N.json` and `src/data/examples/with_demo/query_N.json`. An example with neither can share one file.
4. **No fixed dates for relative timeframes.** JSON can only hold a fixed date, so "in the last ten years" would drift. Leave `timeConstraint` out of the JSON and set it in `queryExamples.ts` when the module loads (see `inLastTenYears`).
5. **Test the intent.** `src/config/__tests__/queryExamples.test.ts` checks the Dementia example's concept, timeframe, validity and age shape for both flag states. Add similar checks for new examples.
