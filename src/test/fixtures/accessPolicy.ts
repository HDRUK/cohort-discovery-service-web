import {
  AccessPolicy,
  MembershipMode,
  MembershipSources,
  RestoredEntry,
  RestoredWhen,
  SubjectPolicy,
  UserMembershipSource,
} from "@/types/accessPolicy";
import { User } from "@/types/api";

export const DEFAULT_WORKGROUP: RestoredEntry = {
  id: 1,
  name: "DEFAULT",
  when: RestoredWhen.EverySync,
};

export const SDE_WORKGROUP: RestoredEntry = {
  id: 7,
  name: "NHS-SDE",
  when: RestoredWhen.SdeApproved,
};

export const getMockSubjectPolicy = (
  overrides: Partial<SubjectPolicy> = {},
): SubjectPolicy => ({
  mode: MembershipMode.Internal,
  authoritative: false,
  editable: true,
  restored_on_sync: [],
  ...overrides,
});

export const getMockAccessPolicy = (
  overrides: Partial<AccessPolicy> = {},
): AccessPolicy => ({
  operation_mode: "standalone",
  providers: { default: "Single Sign-On" },
  workgroups: getMockSubjectPolicy(),
  roles: getMockSubjectPolicy(),
  custodians: getMockSubjectPolicy(),
  ...overrides,
});

export const getMockMembershipSource = (
  overrides: Partial<UserMembershipSource> = {},
): UserMembershipSource => ({
  mode: MembershipMode.Internal,
  editable: true,
  sources: [],
  ...overrides,
});

export const getMockMembershipSources = (
  overrides: Partial<MembershipSources> = {},
): MembershipSources => ({
  workgroups: getMockMembershipSource(),
  roles: getMockMembershipSource(),
  custodians: getMockMembershipSource(),
  ...overrides,
});

export const getMockAdminUser = (overrides: Partial<User> = {}): User => ({
  id: 42,
  email: "jane.doe@example.com",
  name: "Jane Doe",
  email_verified_at: null,
  roles: [],
  custodians: [],
  workgroups: [],
  identities: [],
  query_quota: { limit: 0, used: 0, remaining: null, unlimited: true },
  created_at: "2026-01-01 00:00:00",
  updated_at: "2026-01-01 00:00:00",
  ...overrides,
});
