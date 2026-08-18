import {
  DEMOGRAPHIC_EXAMPLES,
  EXAMPLES,
  getExamples,
} from "./queryExamples";
import { isAgeFilter, isRuleLeaf, getPrimaryConcept } from "@/utils/rules";

const WOMEN_OVER_18 = "E.g. Women over 18 with Covid";
const ADULTS_DIABETES =
  "E.g. Adults with diabetes on insulin (glargine or detemir)";
const COVID_VACCINES = "E.g. Covid and moderna or pfizer";

const COVID_CONCEPT_ID = 37311061;
const FEMALE_CONCEPT_ID = 8532;

describe("getExamples", () => {
  it("returns the legacy examples when the flag is off", () => {
    expect(getExamples(false)).toBe(EXAMPLES);
  });

  it("returns the demographic-block examples when the flag is on", () => {
    expect(getExamples(true)).toBe(DEMOGRAPHIC_EXAMPLES);
  });

  it("keeps the same placeholder keys across both variants", () => {
    expect(Object.keys(DEMOGRAPHIC_EXAMPLES)).toEqual(Object.keys(EXAMPLES));
  });
});

describe("demographic example fixtures", () => {
  it("'Women over 18 with Covid' puts age and sex in the demographics block", () => {
    const example = DEMOGRAPHIC_EXAMPLES[WOMEN_OVER_18];

    // Age and sex are no longer standalone rule nodes.
    expect(example.rules.some(isAgeFilter)).toBe(false);
    expect(example.rules).toHaveLength(1);
    const [leaf] = example.rules;
    expect(isRuleLeaf(leaf)).toBe(true);
    if (isRuleLeaf(leaf)) {
      expect(getPrimaryConcept(leaf.rule.concept)?.concept_id).toBe(
        COVID_CONCEPT_ID,
      );
    }

    expect(example.demographics).toEqual({
      age: [18, 120],
      sex: [expect.objectContaining({ concept_id: FEMALE_CONCEPT_ID })],
      race: [],
    });
  });

  it("'Adults with diabetes' puts age in the demographics block with no sex", () => {
    const example = DEMOGRAPHIC_EXAMPLES[ADULTS_DIABETES];

    expect(example.rules.some(isAgeFilter)).toBe(false);
    expect(example.demographics).toEqual({
      age: [18, 120],
      sex: [],
      race: [],
    });
  });

  it("'Covid and moderna or pfizer' has no demographics block", () => {
    expect(DEMOGRAPHIC_EXAMPLES[COVID_VACCINES].demographics).toBeUndefined();
  });
});
