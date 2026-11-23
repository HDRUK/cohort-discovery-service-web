# Feature flag overrides

Some feature flags can be switched on or off for a single workgroup or user, not just globally. The API decides which flags allow this and how a user's value is worked out. See `docs/ARCHITECTURE/scoped-feature-flags.md` in `project-daphne-api`. This page covers what the web app does with it.

## Two kinds of flag value

| Value | Endpoint | Loaded by | Used for |
|---|---|---|---|
| **Effective** (for the signed-in user) | `GET /api/v1/features` | `getFeatureFlags` → `loadSession` → `featureFlagsStore` → `useFeatures` | Showing or hiding features anywhere in the app |
| **Global** | `GET /api/v1/features/global` | `getGlobalFeatureFlags` → `AdminSection` → `useAdminGlobalFeatureFlags` | The admin **Feature flags** table |

The admin table must show global values. Otherwise an admin who has an override of their own would see their own value and think they were editing the global one.

`useFeatures` needs no special handling. The API already returns each user's effective value with the same response shape.

## Admin UI

Configuration → **Flag overrides** (`FeatureOverridesManager`) shows one card per flag that can be overridden. The list comes from `GET /api/v1/features/overrides`, so the web app doesn't keep its own copy of which flags those are.

Each card shows:
- the flag's global value
- workgroup overrides and user overrides, each with an on/off switch and a clear button
- "Add a workgroup" and "Add a user" pickers. These list only workgroups and users without an override, and add the override with the opposite of the global value, since an override that matches the global value does nothing.

The pickers use the admin section's existing users list and the workgroups list from `AdminSection`.

Changes go through the `setFeatureOverride` and `clearFeatureOverride` server actions. Both call `updateTag(CACHE_TAGS.features)`, which refreshes the admin section data, and a card shows a spinner until that refresh finishes. A failed save shows an error notification.

## Cache lag

`getFeatureFlags` uses `"use cache: private"`, cached per session for `USER_DATA_CACHE_LIFE`. `updateTag` refreshes the admin's own session straight away. Other users see an override change once their cached copy expires, within about five minutes. The API checks the user's effective value whenever a query is submitted, so the delay only affects what the UI shows, never what a user can actually run.
