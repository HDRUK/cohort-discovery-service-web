## Summary

<!-- What changed and why? Keep this concise and outcome-focused. -->

## Jira

<!-- Required: link ticket(s), e.g. https://hdruk.atlassian.net/browse/DP-1234 -->

## PR Type

- [ ] `feat`
- [ ] `fix`
- [ ] `chore`
- [ ] `docs`
- [ ] `refactor`
- [ ] `test`
- [ ] `perf`

## PR Title Check

This repo validates PR titles in CI. Use one of:

- `feat(DP-1234): short description`
- `fix!(DP-5678): short description` (breaking change)
- `RELEASE: vX.Y.Z`

## Changes Included

- [ ] UI changes
- [ ] API integration changes (`src/actions/*`)
- [ ] Routing/navigation changes (`src/config/routes.ts`, app router pages)
- [ ] State management changes (hooks/store)
- [ ] Test updates
- [ ] Documentation updates

## Validation

Run locally before requesting review:

- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] `npm run build` passes
- [ ] `npm run build-storybook` passes (if UI changes)

## Coding Conventions Checklist

- [ ] New components/modules use existing naming conventions (PascalCase component files, `use*` hooks, action files in `src/actions`)
- [ ] Imports follow existing ordering and alias usage (`@/` for internal imports)
- [ ] Routes are built with helpers in `src/config/routes.ts` (no scattered hard-coded dashboard URLs)
- [ ] API calls follow existing patterns (`apiGet/apiPost/...` in server actions, not ad-hoc fetch in client components)
- [ ] Side-effectful endpoints are not cached unintentionally
- [ ] No sensitive values, secrets, or debug-only code left behind

## Screenshots / Evidence

<!-- For UI work, add before/after screenshots or short video. -->

## Risk and Rollback

- Risk level: <!-- low / medium / high -->
- Main risk areas:
  - <!-- e.g. query submission flow, auth redirect, table pagination -->
- Rollback plan:
  - <!-- e.g. revert PR, feature-flag off, deploy previous release tag -->

## Notes for Reviewers

<!-- Anything specific you want reviewers to focus on. -->
