import {
  membershipEditability,
  membershipNotice,
  membershipStatus,
  describeMembershipFailures,
  managedUsersWarning,
  selectedManagedUsers,
  workgroupUserOptions,
  firstLoginReplacementNotices,
  removalSummary,
  restoredOnSync,
  workgroupRemovalWarning,
} from "@/lib/membershipEditability";
import { MembershipMode, MembershipSubject } from "@/types/accessPolicy";
import {
  DEFAULT_WORKGROUP,
  SDE_WORKGROUP,
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

const ADDITIVE_POLICY = getMockAccessPolicy({
  workgroups: getMockSubjectPolicy({
    mode: MembershipMode.Additive,
    restored_on_sync: [DEFAULT_WORKGROUP, SDE_WORKGROUP],
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
const ADDITIVE_USER = userWithWorkgroups(MembershipMode.Additive);
const PENDING_FIRST_LOGIN_USER = userWithWorkgroups(MembershipMode.FirstLogin);
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

describe("restoredOnSync", () => {
  it("ignores restored entries for an internal user", () => {
    expect(
      restoredOnSync(
        MembershipSubject.Workgroups,
        ADDITIVE_POLICY,
        PASSWORD_USER,
        DEFAULT_WORKGROUP.id,
      ),
    ).toBeNull();
  });

  it("finds the restored entry for a managed user", () => {
    expect(
      restoredOnSync(
        MembershipSubject.Workgroups,
        ADDITIVE_POLICY,
        ADDITIVE_USER,
        SDE_WORKGROUP.id,
      ),
    ).toEqual(SDE_WORKGROUP);
  });

  it("returns null for an entry that is not restored", () => {
    expect(
      restoredOnSync(
        MembershipSubject.Workgroups,
        ADDITIVE_POLICY,
        ADDITIVE_USER,
        999,
      ),
    ).toBeNull();
  });
});

describe("membershipNotice", () => {
  const notice = (
    mode: MembershipMode,
    authoritative = false,
    subject = MembershipSubject.Workgroups,
  ) =>
    membershipNotice(subject, {
      mode,
      authoritative,
      editable: mode !== MembershipMode.Authoritative,
      providerLabels: ["Okta", "Single Sign-On"],
    });

  it("says nothing for an internal subject", () => {
    expect(notice(MembershipMode.Internal)).toBeNull();
  });

  it("says an authoritative subject is managed by its providers", () => {
    expect(
      notice(MembershipMode.Authoritative, true, MembershipSubject.Roles),
    ).toBe(
      "Roles are managed by Okta and Single Sign-On. Changes made there apply the next time this user signs in.",
    );
  });

  it("warns that removals are undone in additive mode", () => {
    expect(notice(MembershipMode.Additive)).toBe(
      "Okta and Single Sign-On add workgroups at each sign-in. Removing one they provide is undone the next time this user signs in.",
    );
  });

  it("agrees the verb with a single provider", () => {
    expect(
      membershipNotice(MembershipSubject.Workgroups, {
        mode: MembershipMode.Additive,
        authoritative: false,
        editable: true,
        providerLabels: ["Okta"],
      }),
    ).toBe(
      "Okta adds workgroups at each sign-in. Removing one it provides is undone the next time this user signs in.",
    );
  });

  it("says an authoritative first login replaces earlier edits", () => {
    expect(notice(MembershipMode.FirstLogin, true)).toBe(
      "Okta and Single Sign-On will replace these workgroups when this user first signs in.",
    );
  });

  it("says a non-authoritative first login only adds", () => {
    expect(notice(MembershipMode.FirstLogin)).toBe(
      "Okta and Single Sign-On will add workgroups when this user first signs in.",
    );
  });
});

describe("workgroupRemovalWarning", () => {
  it("does not warn for an internal user", () => {
    expect(
      workgroupRemovalWarning(
        ADDITIVE_POLICY,
        PASSWORD_USER,
        DEFAULT_WORKGROUP.id,
      ),
    ).toBeNull();
  });

  it("warns that an every-sync workgroup comes back", () => {
    expect(
      workgroupRemovalWarning(
        ADDITIVE_POLICY,
        ADDITIVE_USER,
        DEFAULT_WORKGROUP.id,
      ),
    ).toBe(
      "DEFAULT will be restored the next time Jane Doe signs in through Single Sign-On.",
    );
  });

  it("warns that an SDE workgroup may come back", () => {
    expect(
      workgroupRemovalWarning(ADDITIVE_POLICY, ADDITIVE_USER, SDE_WORKGROUP.id),
    ).toBe(
      "NHS-SDE may be restored the next time Jane Doe signs in, if they are SDE-approved.",
    );
  });

  it("warns that an additive provider may add the workgroup back", () => {
    expect(workgroupRemovalWarning(ADDITIVE_POLICY, ADDITIVE_USER, 999)).toBe(
      "Jane Doe will be added back the next time they sign in if Single Sign-On still provides this workgroup.",
    );
  });

  it("warns that a pending first login may add the workgroup back", () => {
    expect(
      workgroupRemovalWarning(ADDITIVE_POLICY, PENDING_FIRST_LOGIN_USER, 999),
    ).toBe(
      "Jane Doe will be added back when they first sign in if Single Sign-On provides this workgroup.",
    );
  });
});

describe("membershipStatus", () => {
  it("returns null for an internal user", () => {
    expect(
      membershipStatus(
        MembershipSubject.Workgroups,
        AUTHORITATIVE_POLICY,
        PASSWORD_USER,
      ),
    ).toBeNull();
  });

  it("labels an authoritative subject as managed", () => {
    expect(
      membershipStatus(
        MembershipSubject.Workgroups,
        AUTHORITATIVE_POLICY,
        AUTHORITATIVE_USER,
      ),
    ).toEqual({
      label: "Managed by Single Sign-On",
      notice:
        "Workgroups are managed by Single Sign-On. Changes made there apply the next time this user signs in.",
      editable: false,
    });
  });

  it("labels an additive subject as synced", () => {
    expect(
      membershipStatus(
        MembershipSubject.Workgroups,
        ADDITIVE_POLICY,
        ADDITIVE_USER,
      )?.label,
    ).toBe("Synced from Single Sign-On");
  });
});

describe("describeMembershipFailures", () => {
  it("names each user the API refused, with its reason", () => {
    expect(
      describeMembershipFailures(
        [
          { id: 42, message: "Workgroups are managed by Okta" },
          { id: 7, message: "Not found" },
        ],
        [getMockAdminUser()],
      ),
    ).toBe(
      "Couldn't update Jane Doe: Workgroups are managed by Okta. Couldn't update item 7: Not found.",
    );
  });
});

describe("selectedManagedUsers", () => {
  const BILL = { ...AUTHORITATIVE_USER, id: 1, name: "Bill Murray" };
  const TEST = { ...AUTHORITATIVE_USER, id: 2, name: "Test User" };
  const JANE = { ...PASSWORD_USER, id: 3 };

  it("returns only the selected users whose workgroups are managed", () => {
    expect(
      selectedManagedUsers(
        AUTHORITATIVE_POLICY,
        [BILL, TEST, JANE],
        ["1", "3"],
      ),
    ).toEqual([BILL]);
  });

  it("returns nothing when no managed user is selected", () => {
    expect(
      selectedManagedUsers(AUTHORITATIVE_POLICY, [BILL, JANE], ["3"]),
    ).toEqual([]);
  });
});

describe("managedUsersWarning", () => {
  const BILL = { ...AUTHORITATIVE_USER, id: 1, name: "Bill Murray" };
  const TEST = { ...AUTHORITATIVE_USER, id: 2, name: "Test User" };

  it("returns null when no users are given", () => {
    expect(managedUsersWarning(AUTHORITATIVE_POLICY, [])).toBeNull();
  });

  it("names the managed user and says where to change them", () => {
    expect(managedUsersWarning(AUTHORITATIVE_POLICY, [BILL])).toBe(
      "Workgroups for Bill Murray are managed by Single Sign-On, which replaces them every time they sign in, so they can't be changed here. Change them in Single Sign-On instead.",
    );
  });

  it("names several users and every provider once", () => {
    const policy = getMockAccessPolicy({
      providers: { default: "Single Sign-On", okta: "Okta" },
    });
    const oktaUser = {
      ...userWithWorkgroups(MembershipMode.Authoritative, ["okta"]),
      id: 3,
      name: "Okta User",
    };

    expect(managedUsersWarning(policy, [BILL, TEST, oktaUser])).toBe(
      "Workgroups for Bill Murray, Test User and Okta User are managed by Single Sign-On and Okta, which replace them every time they sign in, so they can't be changed here. Change them in Single Sign-On and Okta instead.",
    );
  });
});

describe("workgroupUserOptions", () => {
  it("disables and labels a managed user", () => {
    expect(
      workgroupUserOptions(
        [AUTHORITATIVE_USER, { ...PASSWORD_USER, id: 3 }],
        AUTHORITATIVE_POLICY,
      ),
    ).toEqual([
      {
        value: 42,
        label: "Jane Doe (jane.doe@example.com) — Managed by Single Sign-On",
        disabled: true,
      },
      { value: 3, label: "Jane Doe (jane.doe@example.com)", disabled: false },
    ]);
  });

  it("enables everyone when there is no policy", () => {
    expect(workgroupUserOptions([AUTHORITATIVE_USER], null)).toEqual([
      { value: 42, label: "Jane Doe (jane.doe@example.com)", disabled: false },
    ]);
  });
});

describe("firstLoginReplacementNotices", () => {
  const FIRST_LOGIN_POLICY = getMockAccessPolicy({
    workgroups: getMockSubjectPolicy({
      mode: MembershipMode.FirstLogin,
      authoritative: true,
    }),
  });

  it("notes a selected user whose first sign-in will replace the edit", () => {
    expect(
      firstLoginReplacementNotices(
        [PENDING_FIRST_LOGIN_USER],
        FIRST_LOGIN_POLICY,
        [42],
      ),
    ).toEqual([
      "Jane Doe: Single Sign-On will replace these workgroups when this user first signs in.",
    ]);
  });

  it("ignores unselected users and non-authoritative first logins", () => {
    expect(
      firstLoginReplacementNotices(
        [PENDING_FIRST_LOGIN_USER],
        FIRST_LOGIN_POLICY,
        [],
      ),
    ).toEqual([]);
    expect(
      firstLoginReplacementNotices(
        [PENDING_FIRST_LOGIN_USER],
        ADDITIVE_POLICY,
        [42],
      ),
    ).toEqual([]);
  });
});

describe("removalSummary", () => {
  it("counts the users removed", () => {
    expect(removalSummary(2, [], [], "Admin")).toBe(
      "2 users removed from workgroup Admin.",
    );
  });

  it("says how many were removed and why the rest weren't", () => {
    expect(
      removalSummary(
        3,
        [{ id: 42, message: "Workgroups are managed by Okta" }],
        [getMockAdminUser()],
        "Admin",
      ),
    ).toBe(
      "2 of 3 users removed from workgroup Admin. Couldn't update Jane Doe: Workgroups are managed by Okta.",
    );
  });
});
