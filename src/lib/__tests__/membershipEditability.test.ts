import { membershipEditability } from "@/lib/membershipEditability";
import { MembershipMode, MembershipSubject } from "@/types/accessPolicy";
import {
  DEFAULT_WORKGROUP,
  getMockAccessPolicy,
  getMockAdminUser,
  getMockMembershipSource,
  getMockMembershipSources,
  getMockSubjectPolicy,
} from "@/test/fixtures/accessPolicy";

const AUTHORITATIVE_POLICY = getMockAccessPolicy({
  workgroups: getMockSubjectPolicy({
    mode: MembershipMode.Authoritative,
    authoritative: true,
    editable: false,
    restored_on_sync: [DEFAULT_WORKGROUP],
  }),
});

const userWithWorkgroups = (
  mode: MembershipMode,
  sources: string[] = ["default"],
) =>
  getMockAdminUser({
    membership_sources: getMockMembershipSources({
      workgroups: getMockMembershipSource({
        mode,
        editable: mode !== MembershipMode.Authoritative,
        sources,
      }),
    }),
  });

const PASSWORD_USER = userWithWorkgroups(MembershipMode.Internal, []);
const AUTHORITATIVE_USER = userWithWorkgroups(MembershipMode.Authoritative);
const LEGACY_USER = getMockAdminUser();

describe("membershipEditability", () => {
  it("keeps a password-only user editable under an authoritative policy", () => {
    expect(
      membershipEditability(
        MembershipSubject.Workgroups,
        AUTHORITATIVE_POLICY,
        PASSWORD_USER,
      ),
    ).toEqual({
      mode: MembershipMode.Internal,
      editable: true,
      authoritative: false,
      providerLabels: [],
    });
  });

  it("falls back to the deployment policy when the user has no membership sources", () => {
    expect(
      membershipEditability(
        MembershipSubject.Workgroups,
        AUTHORITATIVE_POLICY,
        LEGACY_USER,
      ),
    ).toEqual({
      mode: MembershipMode.Authoritative,
      editable: false,
      authoritative: true,
      providerLabels: ["Single Sign-On"],
    });
  });

  it("uses the deployment policy when no user is given", () => {
    expect(
      membershipEditability(MembershipSubject.Roles, AUTHORITATIVE_POLICY).mode,
    ).toBe(MembershipMode.Internal);
  });

  it("resolves each source to its provider label", () => {
    const policy = getMockAccessPolicy({
      providers: { default: "Single Sign-On", okta: "Okta" },
    });
    const user = userWithWorkgroups(MembershipMode.Authoritative, [
      "okta",
      "default",
    ]);

    expect(
      membershipEditability(MembershipSubject.Workgroups, policy, user)
        .providerLabels,
    ).toEqual(["Okta", "Single Sign-On"]);
  });

  it("shows the slug of a provider the policy does not list", () => {
    const user = userWithWorkgroups(MembershipMode.Authoritative, ["retired"]);

    expect(
      membershipEditability(
        MembershipSubject.Workgroups,
        AUTHORITATIVE_POLICY,
        user,
      ).providerLabels,
    ).toEqual(["retired"]);
  });

  it("takes authoritative from the deployment policy for a managed user", () => {
    expect(
      membershipEditability(
        MembershipSubject.Workgroups,
        AUTHORITATIVE_POLICY,
        AUTHORITATIVE_USER,
      ).authoritative,
    ).toBe(true);
  });
});
