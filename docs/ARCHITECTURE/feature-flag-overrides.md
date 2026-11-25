# Feature flag overrides

Any feature flag that isn't global-only can be switched on or off for a single workgroup or user, not just globally. The API decides how a user's value is worked out, and which API behaviour honours overrides. See `docs/ARCHITECTURE/scoped-feature-flags.md` in `project-daphne-api`. This page covers what the web app does with it.

## Two kinds of flag value

| Value | Endpoint | Loaded by | Used for |
|---|---|---|---|
| **Effective** (for the signed-in user) | `GET /api/v1/features` | `getFeatureFlags` → `loadSession` → `featureFlagsStore` → `useFeatures` | Showing or hiding features anywhere in the app |
| **Global, plus overrides** | `GET /api/v1/features/overrides` | `getFeatureOverrides` → `AdminSection` → `useAdminFeatureOverrides` | The admin **Feature flags** table |

The admin table must show global values. Otherwise an admin who has an override of their own would see their own value and think they were editing the global one.

`useFeatures` needs no special handling. The API already returns each user's effective value with the same response shape.

## Admin UI

Configuration → **Feature flags** (`FeatureFlagManager`) shows one paper per group of flags, with the page background between them. `src/config/featureFlags.ts` gives each flag its group and a one-line description. The description says whether the API enforces the flag, or whether it only changes what the web app shows. A flag missing from `FEATURE_FLAGS` goes under **Other** with no description, so add one entry there whenever the API gains a flag. The entry holds the name, group, description and, for a flag the web reads, its default. `FeatureName`, `DEFAULT_FLAGS` and the table groups are all derived from it.

Each table has three columns, in this order:
- **Global value:** a switch for the global value. Switching it saves straight away through `updateFeatureFlag`. The switch (`GlobalValueSwitch`) shows the new value while the save runs, using `useOptimistic`, then the value from the API. If the save fails, it shows an error notification.
- **Status** (narrow, no heading): a warning sign when any workgroup or user has an override; its tooltip gives the count and says that changing the global value doesn't change theirs. A lock instead for a flag the API marks `overridable: false` or sends without the field ("global only"). Those rows don't expand, because `renderDetailPanel` returns nothing for them, and the API rejects overrides on them. The API's `config/features.php` lists them and says why.
- **Flag:** the flag name and its description.

Each other row expands into a tinted panel listing its override rules (`FeatureOverrideRules`):
- There are at most two rules, **On** and **Off**. Each lists its workgroups and users as chips, with edit and remove buttons. The API stores one value per workgroup or user, so a workgroup or user can only be in one rule; the other rule's picker shows it as disabled.
- **Add override** and the edit button open a modal (`FeatureOverrideModal`) with the value switch and the Workgroups and Users pickers. Adding merges into the rule with the chosen value, creating it if needed. A flag's first rule defaults to the opposite of the global value, since a rule that matches the global value only matters when it outranks another rule. Editing replaces that rule's workgroups and users, and flipping the switch moves them into the rule with the other value. Remove asks for confirmation first.
- The help text above the rules explains the precedence. An On workgroup beats an Off workgroup, so switching the flag off for one person in an On workgroup needs a user rule. Deactivated workgroups still count.
- Every change saves immediately: the modal's Save or the confirmed remove sends the whole set to `PUT /api/v1/features/{name}/overrides` through the `replaceFeatureOverrides` server action. Anything not in the rules is cleared. A failed save shows an error notification and keeps the modal open. The pure rule logic is in `overrideRules.ts`.
- The pickers use the admin section's users and workgroups lists. A workgroup or user with an override that isn't in those lists still shows, using the name from the overrides response.

`replaceFeatureOverrides` calls `updateTag(CACHE_TAGS.features)`, which refreshes the admin section data, so the list updates once the save finishes.

## Cache lag

`getFeatureFlags` and `getFeatureOverrides` use `"use cache: private"` with `FEATURE_FLAGS_CACHE_LIFE`, which has a `stale` time of 30 seconds. In production, a private cache isn't stored on the server, so every request reads the API. The delay comes only from each browser's router cache, which reuses a page for its `stale` time while the user moves around the app.

- The admin who makes a change sees it straight away, because `updateTag` clears their router cache. The global switch holds its new value until the refreshed data arrives, so it doesn't flicker back to the old value.
- Other users and admins see it the next time they load a page, or within 30 seconds if they are moving around the app.
- Where the API honours overrides, such as query submission, it checks the user's effective value on every request, so the delay only affects what the UI shows.

The trade-off: a private cache needs a `stale` time of at least 5 minutes to be part of the route's App Shell. Feature flags are left out of it, so the pages that read them can't be served instantly from the shell.
