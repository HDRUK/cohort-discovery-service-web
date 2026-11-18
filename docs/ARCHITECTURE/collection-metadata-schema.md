# Collection metadata schema (spike DP-0000)

Status: spike. Branch `spike/DP-0000` in `project-daphne-web` and `project-daphne-api`.

## What it does

A collection used to carry three descriptive fields: `name`, `description` and `url` (an external link). The spike adds a per-deployment JSON Schema that describes all of a collection's metadata, and uses it to:

1. validate the metadata in the API,
2. generate the metadata form in the collection admin panel (`@hdruk/metadata-onboard`),
3. render a collection landing page in standalone mode (`@hdruk/gwdm-view`).

## Data model

| Column | Type | Role |
| --- | --- | --- |
| `metadata` | JSON | Source of truth: the whole document, valid against the schema when saved through the metadata endpoint. |
| `metadata_schema` | string | The schema the document was written against, e.g. `CDS@1.0.0`. |
| `name`, `description`, `url` | existing | Quick-reference copies of `summary.name`, `summary.description`, `summary.url`, kept for search, tables, BUNNY and older clients. |

### Keeping the copies in step

Both directions live in the API.

- **Metadata → columns.** `PUT /v1/collections/{id|pid}/metadata` validates the document against the schema (422 with errors keyed by dotted path), then copies the mapped fields into the columns. A missing `summary.url` clears `url`.
- **Columns → metadata.** A `saving` hook on `Collection` writes `name`, `description` and `url` back into the document whenever one of them changes, or seeds the document when there is none yet. The existing create, update and bulk-update paths keep working without knowing about metadata.

The hook does not validate: a document can be incomplete for fields the schema requires beyond the three columns until someone completes the metadata form.

The column-to-path mapping lives with the schema in the API's `config/collection_schema.php`.

## Where the schema comes from

- The API holds the schema files under `resources/schemas/<Model>/<version>/schema.json` and picks one with `COLLECTION_SCHEMA` (default `CDS@1.0.0`). One schema per deployment.
- `GET /v1/collection-schema` returns `{ id, schema }`.
- The schema is JSON Schema 2020-12, written in the shape `schemata-2` generates (`title`, `description`, `examples`, plus the non-standard `guidance` key the form package reads).
- `personalData: true` on a field keeps it off the landing page (`personalDataPaths` in `src/modules/CollectionMetadata/collectionMetadata.ts`).

## Web

| Piece | Where |
| --- | --- |
| Readers | `getCollectionSchema` / `getCachedCollectionSchema`, `getCollectionMetadata` / `getCachedCollectionMetadata` in `src/server/data/collections.ts` |
| Route Handlers | `GET /api/collection-schema`, `GET /api/collections/[pid]/metadata` |
| Save action | `src/actions/collection/saveCollectionMetadata.ts` (expires `CACHE_TAGS.collections`) |
| Form | `src/modules/CollectionMetadata/CollectionMetadataForm.tsx`, a "Collection Metadata" section in `UpdateCollection`, shown in edit mode |
| Landing page | `src/app/(protected)/collections/[pid]/page.tsx`, `routes.collection(pid)`; `notFound()` outside standalone mode |
| Results link | `getCollectionLink` picks the landing page in standalone mode and the external `url` (with `?ref=<query pid>`) in integrated mode |

The metadata form is a separate form from the collection form because `MetadataFormProvider` renders its own `<form>` and react-hook-form instance, and forms cannot nest. It validates with AJV against the same schema before saving. `src/server/api.ts` reduces API errors to a message, so the API's per-field 422 errors surface as one notification; the client-side check is what marks individual fields.

The landing page reads metadata through `GET /v1/collections/{pid}/metadata`, which uses `Collection::visibleToUser` (workgroup members on active collections, custodian members, admins) and answers 404 otherwise.

## Package verdict

- `@hdruk/metadata-onboard` 0.1.0 and `@hdruk/gwdm-view` 0.2.0 install from npm and render straight from the schema with no per-schema form definition.
- gwdm-view imports `tokens` from `@hdruk/ui/theme`, which `@hdruk/ui` 1.1.1 does not export, so the spike bumps `@hdruk/ui` to 1.11.0. 1.11 changes `HdrukUiProvider` to take `theme={createHdrukTheme(themeOptions)}` instead of `themeOptions`; every call site is migrated. Without that change the provider silently drops Daphne's theme.
- gwdm-view uses only `tokens.radius.small` and `tokens.status.grey`. Inlining those upstream would remove the `@hdruk/ui` peer dependency entirely.

## Moving the schema to schemata-2 later

1. Add `hdr_schemata/models/CDS/v1_0_0/__init__.py` (a Pydantic `Cds100` with `save_schema`) and `models/CDS/__init__.py`, following the CRUK family.
2. Run `python -m hdr_schemata.build`; it writes `models/CDS/1.0.0/schema.json`, docs and `available.json` entries.
3. In the API, either load `${SCHEMA_LOCATION}/hdr_schemata/models/CDS/1.0.0/schema.json` instead of the local file, or call TRASER `GET /get/schema` and `POST /validate`. TRASER discovers new families from `available.json`, so no TRASER change is needed.
4. `traser-mapping-files` only matters if CDS documents are translated, e.g. CDS → GWDM to publish collections to the Gateway.

`personalData` and `guidance` would become `json_schema_extra` entries on the Pydantic fields.

## Data protection

Contact fields in the metadata are personal data under UK GDPR. The spike keeps fields marked `personalData` off the landing page, and the schema's guidance asks for a team mailbox rather than a named person. The metadata is still stored and returned to admins and custodians through the metadata endpoint; agree retention and who may see it with the DPO before this leaves spike status.

## Known gaps

- Name, description and URL are editable in both the collection form and the metadata form.
- The landing page renders against the active schema even if a document was written against an older `metadata_schema`.
- `GET /v1/collection/{pid}` in the API has no visibility check (it predates this spike); the landing page does not use it.
- `actionlint` was not available locally.
