import { FeatureOverrides } from "@/types/features";
import {
  OverrideRule,
  addToRules,
  excludedIds,
  removeRule,
  replaceRule,
  toRules,
  toUpdate,
} from "../overrideRules";

const ON: OverrideRule = { enabled: true, workgroups: [10], users: [] };
const OFF: OverrideRule = { enabled: false, workgroups: [], users: [1] };

const feature: FeatureOverrides = {
  feature: "query-builder-use-location",
  global: false,
  overridable: true,
  users: [{ id: 1, name: "Jane Doe", enabled: false }],
  workgroups: [{ id: 10, name: "UK-RESEARCH", enabled: true }],
};

describe("toRules", () => {
  it("groups overrides into an on rule and an off rule", () => {
    expect(toRules(feature)).toEqual([ON, OFF]);
  });

  it("leaves out a rule with no subjects", () => {
    expect(toRules({ ...feature, users: [] })).toEqual([ON]);
  });
});

describe("toUpdate", () => {
  it("flattens the rules into one entry per subject", () => {
    expect(toUpdate([ON, OFF])).toEqual({
      users: [{ id: 1, enabled: false }],
      workgroups: [{ id: 10, enabled: true }],
    });
  });

  it("is empty when there are no rules", () => {
    expect(toUpdate([])).toEqual({ users: [], workgroups: [] });
  });
});

describe("addToRules", () => {
  it("creates the rule when none has that value", () => {
    expect(
      addToRules([ON], { enabled: false, workgroups: [11], users: [] }),
    ).toEqual([ON, { enabled: false, workgroups: [11], users: [] }]);
  });

  it("merges into the rule with the same value without duplicates", () => {
    expect(
      addToRules([ON], { enabled: true, workgroups: [10, 11], users: [2] }),
    ).toEqual([{ enabled: true, workgroups: [10, 11], users: [2] }]);
  });
});

describe("replaceRule", () => {
  it("replaces the subjects of the rule with that value", () => {
    expect(
      replaceRule([ON, OFF], true, { workgroups: [11], users: [2] }),
    ).toEqual([{ enabled: true, workgroups: [11], users: [2] }, OFF]);
  });

  it("drops the rule when it ends up with no subjects", () => {
    expect(replaceRule([ON, OFF], true, { workgroups: [], users: [] })).toEqual(
      [OFF],
    );
  });
});

describe("removeRule", () => {
  it("drops the rule with that value", () => {
    expect(removeRule([ON, OFF], false)).toEqual([ON]);
  });
});

describe("excludedIds", () => {
  it("lists the subjects already in the other rule", () => {
    expect(excludedIds([ON, OFF], true, "users")).toEqual([1]);
    expect(excludedIds([ON, OFF], false, "workgroups")).toEqual([10]);
  });

  it("is empty when the other rule does not exist", () => {
    expect(excludedIds([ON], true, "users")).toEqual([]);
  });
});
