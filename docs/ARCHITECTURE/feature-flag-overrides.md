# Feature flag overrides

Any feature flag can be switched on or off for a single workgroup or user, not just globally. The API decides how a user's value is worked out, and which API behaviour honours overrides. See `docs/ARCHITECTURE/scoped-feature-flags.md` in `project-daphne-api`. This page covers what the web app does with it.

## Two kinds of flag value

| Value | Endpoint | Loaded by | Used for |
|---|---|---|---|
| **Effective** (for the signed-in user) | `GET /api/v1/features` | `getFeatureFlags` → `loadSession` → `featureFlagsStore` → `useFeatures` | Showing or hiding features anywhere in the app |
| **Global, plus overrides** | `GET /api/v1/features/overrides` | `getFeatureOverrides` → `AdminSection` → `useAdminFeatureOverrides` | The admin **Feature flags** table |

The admin table must show global values. Otherwise an admin who has an override of their own would see their own value and think they were editing the global one.

`useFeatures` needs no special handling. The API already returns each user's effective value with the same response shape.

## Admin UI

Configuration → **Feature flags** (`FeatureFlagManager`) lists every flag with three columns:
- **Field:** the flag name.
- **Value:** the global value. Switching it saves straight away through `updateFeatureFlag`, and switches back with an error notification if the save fails.
- **Overrides:** how many workgroups and users have an override.

Each row expands into its override rules (`FeatureOverrideRules`):
- There are at most two rules, **On** and **Off**. Each picks workgroups and users with a multi-select. The API stores one value per workgroup or user, so a workgroup or user can only be in one rule; the other rule's picker shows it as disabled.
- **Add rule** adds the missing rule. A flag's first rule takes the opposite of the global value, since a rule that matches the global value only matters when it outranks another rule.
- A rule's value can be switched only while it is the only rule.
- Edits stay local until **Save**, which sends the whole set to `PUT /api/v1/features/{name}/overrides` through the `replaceFeatureOverrides` server action. Anything not in the rules is cleared. **Reset** discards the edits. Both buttons are disabled until something changes.
- The pickers use the admin section's users and workgroups lists. A workgroup or user with an override that isn't in those lists still shows, using the name from the overrides response.

`replaceFeatureOverrides` calls `updateTag(CACHE_TAGS.features)`, which refreshes the admin section data. The rules panel is keyed on the flag's overrides, so it resets to the saved state once the refreshed data arrives. A failed save shows an error notification and keeps the edits.

## Cache lag

`getFeatureFlags` uses `"use cache: private"`, cached per session for `USER_DATA_CACHE_LIFE`. `updateTag` refreshes the admin's own session straight away. Other users see an override change once their cached copy expires, within about five minutes. Where the API honours overrides, such as query submission, it checks the user's effective value on every request, so the delay only affects what the UI shows.
