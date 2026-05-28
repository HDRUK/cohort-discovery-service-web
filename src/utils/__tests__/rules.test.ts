import { RuleGroupType, RuleLeafType, RuleNodeType } from "@/types/rules";
import { getAlternativeRuleIds } from "@/utils/rules";

const makeLeaf = (id: string, hasAlts = false): RuleLeafType =>
  ({
    id,
    rule: {
      concept: hasAlts
        ? {
            concept_id: 1,
            name: "COVID-19",
            alternatives: [{ concept_id: 2, name: "Acute COVID-19" }],
          }
        : { concept_id: 1, name: "Diabetes" },
    },
  }) as RuleLeafType;

const makeGroup = (id: string, rules: RuleNodeType[]): RuleGroupType =>
  ({ id, rules }) as RuleGroupType;

describe("getAlternativeRuleIds", () => {
  it("returns empty array when no rules have alternatives", () => {
    const rules: RuleNodeType[] = [makeLeaf("a"), makeLeaf("b")];
    expect(getAlternativeRuleIds(rules)).toEqual([]);
  });

  it("returns the ID of a flat rule with alternatives", () => {
    const rules: RuleNodeType[] = [makeLeaf("a", true), makeLeaf("b")];
    expect(getAlternativeRuleIds(rules)).toEqual(["a"]);
  });

  it("collects multiple alternative rule IDs from a flat list", () => {
    const rules: RuleNodeType[] = [
      makeLeaf("a", true),
      makeLeaf("b"),
      makeLeaf("c", true),
    ];
    expect(getAlternativeRuleIds(rules)).toEqual(["a", "c"]);
  });

  it("recurses into nested groups to find alternative rules", () => {
    const inner = makeGroup("group-inner", [makeLeaf("nested", true)]);
    const rules: RuleNodeType[] = [makeLeaf("top"), inner];
    expect(getAlternativeRuleIds(rules)).toEqual(["nested"]);
  });

  it("collects from both top-level and nested locations", () => {
    const inner = makeGroup("group-inner", [makeLeaf("nested", true)]);
    const rules: RuleNodeType[] = [makeLeaf("top", true), inner];
    expect(getAlternativeRuleIds(rules)).toEqual(["top", "nested"]);
  });
});
