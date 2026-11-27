# Admin networks tab

`/admin/networks` lists networks on the left, the selected network's custodians in the middle, and an edit form for that network on the right.

## Data flow

- `NetworksTab` (Server Component) reads `getNetworks()` and the URL's `searchParams` together. It picks the selected network with `selectByIdOrFirst` on `network_filter`, then reads that network's custodians with `getNetworkCustodians(id, buildNetworkCustodianParams(params))`.
- `getNetworkCustodians` calls `GET /api/v1/custodian_networks/{id}/custodians` (API #381), which pages and searches by name. `buildNetworkCustodianParams` sends `page`, a clamped `per_page` and `search_term` as `name[]`, and leaves out `network_filter`.
- The custodians reach `CustodianTable` as a `Paginated<Custodian>` prop, through `NetworksAdmin` and `NetworksMiddlePanel`, never through context (Q11). The networks list goes into `NetworksProvider`, since the left panel, the edit form and `useSelectedNetwork` all share it.

## Caching

Both reads are `'use cache: private'` with `LIST_CACHE_LIFE`. `getNetworks` is tagged `networks`; `getNetworkCustodians` is tagged `networks` and `custodians`. Every action in `src/actions/network/` expires both tags. Searches are cached like any other query (Q22).

## URL state

- `search_term` is set by the search box in the page header and searches the selected network's custodians, not the networks.
- `page` and `per_page` page the custodians table (`usePaginatedTable`).
- Selecting a network sets `network_filter` and clears `page` and `search_term` in one `setSearchParams` call, so a new network starts on page 1 with no search.

## Loading

`networks/page.tsx` has one `SearchParamsTransitionProvider`, and its Suspense fallback is `<NetworksAdmin />` with no data, which renders the custodians table in its loading state (Q21). Param changes show skeleton rows while the transition is pending.

## `CustodianTable`

`src/components/CustodianTable/` knows nothing about networks. It takes `custodians?: Paginated<Custodian>` (`undefined` while loading), a title, subtitle and empty message, and an optional `onDelete(ids) => Promise<boolean>`. The table shows row selection and a delete button only when `onDelete` is given, and clears the selection when `onDelete` returns `true` or when the `custodians` prop changes (network, page or search), so a delete never acts on rows that aren't on screen. The networks panel's `onDelete` asks for confirmation, then removes the custodians from the network.
