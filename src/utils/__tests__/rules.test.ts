import { Concept } from "@/types/api";
import {
  Demographics,
  RuleGroupType,
  RuleLeafType,
  RuleNodeType,
} from "@/types/rules";
import {
  findRulesWithAlternatives,
  hasDemographicsContent,
  RuleErrors,
  validateRuleTree,
  withDefaultAgeWhenEmpty,
} from "@/utils/rules";

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

describe("findRulesWithAlternatives", () => {
  it("returns empty array when no rules have alternatives", () => {
    const rules: RuleNodeType[] = [makeLeaf("a"), makeLeaf("b")];
    expect(findRulesWithAlternatives(rules)).toEqual([]);
  });

  it("returns the ID of a flat rule with alternatives", () => {
    const rules: RuleNodeType[] = [makeLeaf("a", true), makeLeaf("b")];
    expect(findRulesWithAlternatives(rules)).toEqual(["a"]);
  });

  it("collects multiple alternative rule IDs from a flat list", () => {
    const rules: RuleNodeType[] = [
      makeLeaf("a", true),
      makeLeaf("b"),
      makeLeaf("c", true),
    ];
    expect(findRulesWithAlternatives(rules)).toEqual(["a", "c"]);
  });

  it("recurses into nested groups to find alternative rules", () => {
    const inner = makeGroup("group-inner", [makeLeaf("nested", true)]);
    const rules: RuleNodeType[] = [makeLeaf("top"), inner];
    expect(findRulesWithAlternatives(rules)).toEqual(["nested"]);
  });

  it("collects from both top-level and nested locations", () => {
    const inner = makeGroup("group-inner", [makeLeaf("nested", true)]);
    const rules: RuleNodeType[] = [makeLeaf("top", true), inner];
    expect(findRulesWithAlternatives(rules)).toEqual(["top", "nested"]);
  });
});

const EMPTY_BLOCK: Demographics = {
  age: null,
  sex: [],
  race: [],
  location: null,
  death: null,
};

const FEMALE = { concept_id: 8532, name: "Female" } as Concept;

const makeDemographics = (
  overrides: Partial<Demographics> = {},
): Demographics => ({ ...EMPTY_BLOCK, ...overrides });

const PARTIAL_BLOCK = { age: null, race: [] } as unknown as Demographics;

const demographicsOnlyQuery = (demographics?: Demographics): RuleGroupType =>
  ({ id: "root", rules: [], demographics }) as RuleGroupType;

const DEMOGRAPHICS_ONLY_OPTIONS = {
  constrainForBunnyV1: false,
  allowNestedGroups: false,
  allowDemographicsOnly: true,
};

describe("hasDemographicsContent", () => {
  it("reads a block with keys missing rather than throwing", () => {
    expect(() => hasDemographicsContent(PARTIAL_BLOCK)).not.toThrow();
    expect(hasDemographicsContent(PARTIAL_BLOCK)).toBe(false);
  });
});

describe("withDefaultAgeWhenEmpty", () => {
  it("falls back to the full age range when nothing is set", () => {
    expect(withDefaultAgeWhenEmpty(EMPTY_BLOCK).age).toEqual([0, 120]);
  });

  it("leaves a null age alone when another field is set", () => {
    const block = makeDemographics({ sex: [FEMALE] });
    expect(withDefaultAgeWhenEmpty(block)).toBe(block);
  });
});

describe("validateRuleTree — demographics-only queries", () => {
  it("rejects an empty demographics block and says why", () => {
    const result = validateRuleTree(
      demographicsOnlyQuery(EMPTY_BLOCK),
      DEMOGRAPHICS_ONLY_OPTIONS,
    );

    expect(result.valid).toBe(false);
    expect(result.invalidReason).toEqual([
      RuleErrors.DEMOGRAPHICS_BLOCK_IS_EMPTY,
    ]);
  });

  it("stays silent on a blank query with no demographics block", () => {
    const result = validateRuleTree(
      demographicsOnlyQuery(),
      DEMOGRAPHICS_ONLY_OPTIONS,
    );

    expect(result.valid).toBe(false);
    expect(result.invalidReason).toBeUndefined();
  });

  it("accepts a null age when another demographic is set", () => {
    const result = validateRuleTree(
      demographicsOnlyQuery(makeDemographics({ sex: [FEMALE] })),
      DEMOGRAPHICS_ONLY_OPTIONS,
    );

    expect(result.valid).toBe(true);
    expect(result.invalidReason).toBeUndefined();
  });
});
