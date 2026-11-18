import {
  accessPolicyRows,
  operationModeLabel,
  providersSummary,
} from "@/lib/accessPolicySummary";
import { MembershipMode } from "@/types/accessPolicy";
import {
  DEFAULT_WORKGROUP,
  SDE_WORKGROUP,
  getMockAccessPolicy,
  getMockSubjectPolicy,
} from "@/test/fixtures/accessPolicy";

const FULL_IDP_CONTROL = getMockAccessPolicy({
  workgroups: getMockSubjectPolicy({
    mode: MembershipMode.Authoritative,
    authoritative: true,
    editable: false,
    restored_on_sync: [DEFAULT_WORKGROUP, SDE_WORKGROUP],
  }),
  roles: getMockSubjectPolicy({
    mode: MembershipMode.Additive,
  }),
  custodians: getMockSubjectPolicy({
    mode: MembershipMode.FirstLogin,
    authoritative: true,
  }),
});

describe("accessPolicyRows", () => {
  it("describes an unsynced subject as kept", () => {
    expect(accessPolicyRows(getMockAccessPolicy())[0]).toEqual({
      subject: "Workgroups",
      sync: "Not synced",
      adminEdits: "Kept",
      restored: null,
    });
  });

  it("says an authoritative subject is blocked and lists what comes back", () => {
    expect(accessPolicyRows(FULL_IDP_CONTROL)[0]).toEqual({
      subject: "Workgroups",
      sync: "Every sign-in, replaces",
      adminEdits: "Blocked — managed by Single Sign-On",
      restored: "DEFAULT; NHS-SDE (SDE-approved only)",
    });
  });

  it("warns that additive removals come back", () => {
    expect(accessPolicyRows(FULL_IDP_CONTROL)[1]).toMatchObject({
      subject: "Roles",
      sync: "Every sign-in, adds",
      adminEdits:
        "Kept, but removing one the provider sends is undone at the user's next sign-in",
    });
  });

  it("says an authoritative first login replaces earlier edits once", () => {
    expect(accessPolicyRows(FULL_IDP_CONTROL)[2]).toMatchObject({
      subject: "Custodians",
      sync: "First sign-in, replaces",
      adminEdits: "Replaced at the user's first sign-in, then kept",
    });
  });

  it("says a non-authoritative first login only adds", () => {
    const policy = getMockAccessPolicy({
      workgroups: getMockSubjectPolicy({ mode: MembershipMode.FirstLogin }),
    });

    expect(accessPolicyRows(policy)[0]).toMatchObject({
      sync: "First sign-in, adds",
      adminEdits: "Kept; the provider adds to them at the user's first sign-in",
    });
  });
});

describe("providersSummary", () => {
  it("lists every provider label", () => {
    expect(
      providersSummary(
        getMockAccessPolicy({
          providers: { default: "Single Sign-On", okta: "Okta" },
        }),
      ),
    ).toBe("Single Sign-On, Okta");
  });

  it("says password sign-in only when there are no providers", () => {
    expect(providersSummary(getMockAccessPolicy({ providers: {} }))).toBe(
      "None — users sign in with a password only",
    );
  });
});

describe("operationModeLabel", () => {
  it.each([
    ["standalone", "Standalone"],
    ["integrated", "Integrated (HDR UK Gateway)"],
  ])("labels %p", (mode, label) => {
    expect(
      operationModeLabel(getMockAccessPolicy({ operation_mode: mode })),
    ).toBe(label);
  });

  it("shows an unknown mode as it is", () => {
    expect(
      operationModeLabel(getMockAccessPolicy({ operation_mode: "hybrid" })),
    ).toBe("hybrid");
  });
});
