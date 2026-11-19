import { Collection, CombinedUser } from "@/types/api";
import {
  hasSyntheticSelection,
  isCustodianMember,
  isOnlyInDefaultWorkgroup,
  isQuotaExhausted,
} from "../user";

const userWith = (overrides: Partial<CombinedUser>) =>
  ({ workgroups: [], ...overrides }) as CombinedUser;

const collection = (pid: string, isSynthetic: boolean) =>
  ({ pid, is_synthetic: isSynthetic }) as Collection;

describe("isOnlyInDefaultWorkgroup", () => {
  it("is true for a user whose only workgroup is the default", () => {
    expect(
      isOnlyInDefaultWorkgroup(
        userWith({
          workgroups: [{ name: "DEFAULT" }],
        } as Partial<CombinedUser>),
      ),
    ).toBe(true);
  });

  it("is false for a user in another workgroup too", () => {
    expect(
      isOnlyInDefaultWorkgroup(
        userWith({
          workgroups: [{ name: "DEFAULT" }, { name: "NHS-SDE" }],
        } as Partial<CombinedUser>),
      ),
    ).toBe(false);
  });

  it("is false without a user", () => {
    expect(isOnlyInDefaultWorkgroup(null)).toBe(false);
  });
});

describe("isQuotaExhausted", () => {
  it("is true when a limited quota has nothing remaining", () => {
    expect(
      isQuotaExhausted(
        userWith({
          query_quota: { unlimited: false, remaining: 0 },
        } as Partial<CombinedUser>),
      ),
    ).toBe(true);
  });

  it("is false for an unlimited quota", () => {
    expect(
      isQuotaExhausted(
        userWith({
          query_quota: { unlimited: true, remaining: 0 },
        } as Partial<CombinedUser>),
      ),
    ).toBe(false);
  });

  it("is false without a quota", () => {
    expect(isQuotaExhausted(userWith({}))).toBe(false);
  });
});

describe("hasSyntheticSelection", () => {
  const collections = [collection("real", false), collection("fake", true)];

  it("is true when a selected collection is synthetic", () => {
    expect(hasSyntheticSelection(["real", "fake"], collections)).toBe(true);
  });

  it("is false when only real collections are selected", () => {
    expect(hasSyntheticSelection(["real"], collections)).toBe(false);
  });
});

describe("isCustodianMember", () => {
  const member = userWith({
    custodians: [{ pid: "custodian-a" }],
  } as Partial<CombinedUser>);

  it("is true for a custodian the user belongs to", () => {
    expect(isCustodianMember(member, "custodian-a")).toBe(true);
  });

  it("is false for any other custodian", () => {
    expect(isCustodianMember(member, "custodian-b")).toBe(false);
  });

  it("is false without a user", () => {
    expect(isCustodianMember(null, "custodian-a")).toBe(false);
  });
});
