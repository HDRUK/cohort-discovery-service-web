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

The per-user block wins whenever a user is in view; the deployment block is the fallback when it is missing. The per-user answer only ever relaxes the deployment one: a password-only user, a user whose provider doesn't map the subject, and a `first_login` user who has already synced are all `internal`. `membershipEditability(subject, policy, user?)` in `src/lib/membershipEditability.ts` resolves the mode, `editable`, `authoritative` and provider labels.

## Where admins see it

Configuration is an admin tab (`/admin/configuration`, after Networks), laid out like the other admin tabs: a left lane lists Feature flags, Defaults and Access control, and the middle lane shows the chosen table. The choice is the `section` search param (`toConfigurationSection` in `src/lib/configurationSection.ts`, defaulting to feature flags).

Access control is a read-only Field/Value table of the deployment answer: operation mode, providers, and per subject how it syncs, what happens to admin edits, and what comes back at every sign-in. `accessPolicyRows`, `providersSummary` and `operationModeLabel` in `src/lib/accessPolicySummary.ts` build the text. When the policy is `null` the table says the API doesn't report it yet. The policy is set by the deployment, so the panel has no controls.
