import {
  MEMBERSHIP_SUBJECT_LABELS,
  NO_PROVIDERS_LABEL,
  OPERATION_MODE_LABELS,
  RESTORED_WHEN_SUFFIXES,
  SYNC_TIMING_LABELS,
} from "@/config/accessPolicy";
import { joinLabels, membershipEditability } from "@/lib/membershipEditability";
import {
  AccessPolicy,
  MembershipMode,
  MembershipSubject,
} from "@/types/accessPolicy";
import { capitaliseFirstLetter } from "@/utils/string";

export interface AccessPolicyRow {
  subject: string;
  sync: string;
  adminEdits: string;
  restored: string | null;
}

interface AdminEditParts {
  authoritative: boolean;
  providers: string;
}

const ADMIN_EDITS: Record<MembershipMode, (parts: AdminEditParts) => string> = {
  [MembershipMode.Internal]: () => "Kept",
  [MembershipMode.FirstLogin]: ({ authoritative }) =>
    authoritative
      ? "Replaced at the user's first sign-in, then kept"
      : "Kept; the provider adds to them at the user's first sign-in",
  [MembershipMode.Additive]: () =>
    "Kept, but removing one the provider sends is undone at the user's next sign-in",
  [MembershipMode.Authoritative]: ({ providers }) =>
    `Blocked — managed by ${providers}`,
};

export const accessPolicyRows = (policy: AccessPolicy): AccessPolicyRow[] =>
  Object.values(MembershipSubject).map((subject) => {
    const { mode, authoritative, providerLabels } = membershipEditability(
      subject,
      policy,
    );
    const restored = policy[subject].restored_on_sync;
    const syncTiming = SYNC_TIMING_LABELS[mode] ?? mode;

    return {
      subject: capitaliseFirstLetter(MEMBERSHIP_SUBJECT_LABELS[subject]),
      sync:
        mode === MembershipMode.Internal
          ? syncTiming
          : `${syncTiming}, ${authoritative ? "replaces" : "adds"}`,
      adminEdits:
        ADMIN_EDITS[mode]?.({
          authoritative,
          providers: joinLabels(providerLabels),
        }) ?? mode,
      restored: restored.length
        ? restored
            .map(
              ({ name, when }) =>
                `${name}${RESTORED_WHEN_SUFFIXES[when] ?? ""}`,
            )
            .join("; ")
        : null,
    };
  });

export const providersSummary = (policy: AccessPolicy): string => {
  const labels = Object.values(policy.providers);
  return labels.length ? labels.join(", ") : NO_PROVIDERS_LABEL;
};

export const operationModeLabel = (policy: AccessPolicy): string =>
  OPERATION_MODE_LABELS[policy.operation_mode] ?? policy.operation_mode;
