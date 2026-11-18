# Membership editability

Which of a user's workgroups, roles and custodians an admin can usefully edit, and how the web app shows it. Ticket DP-1262; the API side is DP-1261 (`docs/ARCHITECTURE/claims-access-control-editability.md` in the API repo). Deployment configuration is described in the docs site under *Deploying → Access control policy*.

## The problem

An identity provider (or, in integrated mode, the HDR UK Gateway) can rewrite a user's memberships every time they sign in. An admin edit to a membership the IdP manages is then undone at that user's next sign-in. The API does **not** refuse those edits: removing access has to work straight away, and whether a sync will run is only a prediction. The web app is the guard rail.

## What the API sends

| Source | Where it is read | What it says |
|---|---|---|
| `GET /v1/access_policy` | `getAccessPolicy()` in `src/server/data/accessPolicy.ts`, passed into `AdminSectionProvider`, read with `useAdminAccessPolicy()` | Per deployment: operation mode, provider labels, and per subject its `mode`, `authoritative`, `editable` and `restored_on_sync` |
| `membership_sources` on each user | `User.membership_sources` from `GET /v1/users` (`useAdminUsers()`) | Per user: per subject its `mode`, `editable` and the provider slugs (`sources`) that manage it |

`membership_sources` is only on users from `/v1/users` and `/v1/users/{id}`, not on `/v1/user` or users nested in other resources.

`getAccessPolicy()` follows `getCurrentUser()`: the private cached read (`USER_DATA_CACHE_LIFE`, tag `access-policy`) throws on an API error so nothing bad is cached, and the exported reader catches and returns `null`. The policy is advisory, so an API without the endpoint (or any failure) must not take the admin section down; consumers treat `null` as "nothing is managed". The policy changes only on redeploy, so no action expires the tag.

## Precedence

The per-user block wins whenever a user is in view; the deployment block is the fallback when it is missing. The per-user answer only ever relaxes the deployment one: a password-only user, a user whose provider doesn't map the subject, and a `first_login` user who has already synced are all `internal`. All of this lives in `src/lib/membershipEditability.ts`:

| Function | Use |
|---|---|
| `membershipEditability(subject, policy, user?)` | Resolved `mode`, `editable`, `authoritative` and provider labels |
| `membershipNotice(subject, editability)` | The sentence explaining the mode, or `null` for `internal` |
| `membershipStatus(subject, policy, user)` | Chip label ("Managed by …" / "Synced from …") plus the notice |
| `restoredOnSync(subject, policy, user, id)` | The `restored_on_sync` entry for an id, ignored for `internal` users |
| `workgroupRemovalWarning(policy, user, workgroupId)` | The warning shown before removing a user from a workgroup |
| `selectedManagedUsers(policy, users, selectedIds)` | The ticked users whose workgroups are authoritative; `useSelectedManagedUsers` reads the ids from `selectionStore` |
| `managedUsersWarning(policy, managedUsers)` | Names those users and says where to change them; shown at the top of the workgroup panel |
| `workgroupUserOptions(users, policy)` | Add-users picker options, with authoritative users disabled and labelled |
| `firstLoginReplacementNotices(users, policy, selectedIds)` | Notes under the picker for picked users whose first sign-in will replace the edit |
| `describeMembershipFailures(failed, named)` | Error text naming each user or collection the API refused |
| `removalSummary(total, failed, users, workgroupName)` | "2 of 3 users removed from workgroup …", followed by the failures |

## Modes and what the UI does

| Mode | Workgroups tab | User view |
|---|---|---|
| `internal` | Normal editing | Nothing extra |
| `first_login` | Editable. Removing asks for confirmation. Adding shows a note when the provider is authoritative, because the first sign-in will replace the edit | Notice |
| `additive` | Editable. Removing asks for confirmation, because the provider adds back what it asserts | Notice |
| `authoritative` | The user can be ticked. While any ticked user is authoritative, delete is disabled, the workgroup panel's edit toggle is disabled and a warning names them. They are disabled in the add picker, labelled "Managed by …" | Notice |

Entries in `restored_on_sync` (the `DEFAULT` workgroup, SDE workgroups in integrated mode) are warned about, not blocked, in the removal confirmation.

Roles and custodians have no edit UI yet, so their mode is shown in the user view only. Creating, renaming and deleting workgroups, and adding collections to them, are never affected.

## Failed edits

`removeUsersFromWorkgroup` and `updateWorkgroupMembers` call the API with `ErrorMode.RESULT`, one call per user or collection, in parallel. `runMemberEdit` and `editFailures` in `src/server/mutations/workgroupMembers.ts` turn a thrown error into a failed entry and end the session on a 401, so one refusal doesn't hide the others or redirect to `/forbidden`. Both actions always expire the tags, because some calls may have succeeded. On a failure the add panel stays open with only the failed picks left; a partial removal says how many went through.

If the API starts refusing edits to managed memberships, these failures are how it shows.

## Where admins see it

Configuration is an admin tab (`/admin/configuration`, after Networks), laid out like the other admin tabs: a left lane lists Feature flags, Defaults and Access control, and the middle lane shows the chosen table. The choice is the `section` search param (`toConfigurationSection` in `src/lib/configurationSection.ts`, defaulting to feature flags).

Access control is a read-only Field/Value table of the deployment answer: operation mode, providers, and per subject how it syncs, what happens to admin edits, and what comes back at every sign-in. `accessPolicyRows`, `providersSummary` and `operationModeLabel` in `src/lib/accessPolicySummary.ts` build the text. When the policy is `null` the table says the API doesn't report it yet. The policy is set by the deployment, so the panel has no controls.

## Replaced

`manage-workgroups-internally` (`FeatureName.ManageWorkgroupsInternally`, `useFeatures().manageWorkgroupsInternal`) is gone. It was a deployment-wide flag forced on in standalone, so it couldn't express "this user is IdP-managed", and it only gated the remove table, not the add picker.
