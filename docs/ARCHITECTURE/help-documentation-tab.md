# Help: Documentation tab

The Help section (`/help`) has a **Documentation** tab at `/help/documentation` that links to the two external Cohort Discovery documentation sites. Ticket DP-992.

## What it shows

| Heading | Link |
| --- | --- |
| Onboarding to Cohort Discovery | [Cohort Discovery Implementation Documentation](https://hdruk.github.io/cohort-discovery-service-docs/) |
| Running your own Cohort Discovery Service | [Cohort Discovery Service Stack Documentation](https://hdruk.github.io/cohort-discovery-service-stack/) |

The first section uses the same heading and wording as the Gateway's [Cohort Discovery support page](https://healthdatagateway.org/en/data-custodian/support/cohort-discovery), so custodians see consistent guidance in both places. The second covers the open-source stack docs (running locally, customising, deploying to Kubernetes).

## Where the code lives

- `src/app/(protected)/help/layout.tsx`: the `HELP_TABS` entry (`documentation`).
- `src/app/(protected)/help/documentation/documentation.mdx`: the content. Edit this to change the wording or links.
- `src/app/(protected)/help/documentation/page.tsx`: renders the MDX with the shared `baseComponents` (`src/modules/Guidance/Guidance.tsx`), so links open in a new tab like in the other help tabs.

It follows the same pattern as the Overview tab (`help/overview/`): an MDX file plus a `"use client"` page that passes it components. The page overrides `h2` to use the `overline` variant in `text.secondary`, matching the section titles in the Overview tab (`ActionMenuSection` uses `overline` because `boldTitle` defaults to `true`), and overrides `p` to add spacing between paragraphs. The theme's `h6` was tried first but is weight 200, which was too faint to read.

The URLs are written in the MDX like the other help content (e.g. `collection-admin-tutorials/data-onboarding.mdx`), not in `src/config/routes.ts`. No MDX file in the repo imports modules, and in MDX a markdown link can't take a variable as its URL.

There is no unit test: none of the help tabs have one, and Jest only runs `.mdx` files through `ts-jest`, which can't compile MDX.

## Why a Help tab and not a nav icon

An icon button in the top nav was tried first, but product preferred a tab under Help, next to the tutorials, because two links (each with context) are needed. This is a stop-gap: the plan is to merge content between the two sites and eventually host the docs inside the app, visible without signing in.
