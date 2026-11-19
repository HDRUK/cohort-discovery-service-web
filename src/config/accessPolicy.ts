import {
  MembershipMode,
  MembershipSubject,
  RestoredWhen,
} from "@/types/accessPolicy";

export const MEMBERSHIP_SUBJECT_LABELS: Record<MembershipSubject, string> = {
  [MembershipSubject.Workgroups]: "workgroups",
  [MembershipSubject.Roles]: "roles",
  [MembershipSubject.Custodians]: "custodians",
};

export const SYNC_TIMING_LABELS: Record<MembershipMode, string> = {
  [MembershipMode.Internal]: "Not synced",
  [MembershipMode.FirstLogin]: "First sign-in",
  [MembershipMode.Additive]: "Every sign-in",
  [MembershipMode.Authoritative]: "Every sign-in",
};

export const RESTORED_WHEN_SUFFIXES: Record<RestoredWhen, string> = {
  [RestoredWhen.EverySync]: "",
  [RestoredWhen.SdeApproved]: " (SDE-approved only)",
};

export const NO_PROVIDERS_LABEL = "None — users sign in with a password only";

export const OPERATION_MODE_LABELS: Record<string, string> = {
  standalone: "Standalone",
  integrated: "Integrated (HDR UK Gateway)",
};

export const ACCESS_POLICY_UNAVAILABLE =
  "This API doesn't report its sign-in sync policy yet. Update the API to see it here.";
