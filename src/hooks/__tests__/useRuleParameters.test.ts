import { renderHook } from "@testing-library/react";
import useFeatures from "@/hooks/useFeatures";
import { Concept } from "@/types/api";
import { RuleLeafType } from "@/types/rules";
import { createRule } from "@/utils/rules";
import useRuleParameters from "../useRuleParameters";

jest.mock("@/hooks/useFeatures");

const mockFeatures = useFeatures as jest.MockedFunction<typeof useFeatures>;

const makeConcept = (category: string): Concept => ({
  concept_id: 4060130,
  name: "Example concept",
  category,
});

const makeRule = (overrides: Partial<RuleLeafType> = {}): RuleLeafType => ({
  ...createRule({ concept: makeConcept("Measurement") }),
  ...overrides,
});

const setup = (
  rule: RuleLeafType,
  {
    constrainForBunnyV1 = true,
    queryBuilderUseValueAsNumber = true,
  }: {
    constrainForBunnyV1?: boolean;
    queryBuilderUseValueAsNumber?: boolean;
  } = {},
) => {
  mockFeatures.mockReturnValue({
    constrainForBunnyV1,
    queryBuilderUseValueAsNumber,
  } as ReturnType<typeof useFeatures>);
  return renderHook(() => useRuleParameters(rule)).result.current;
};

const PLAIN_RULE = makeRule();
const EMPTY_RULE = createRule();
const GENDER_RULE = createRule({ concept: makeConcept("Gender") });
const CONDITION_RULE = createRule({ concept: makeConcept("Condition") });
const RULE_WITH_TIME = makeRule({ timeConstraint: ["2026-08-01", null] });
const RULE_WITH_AGE = makeRule({ ageConstraint: [4, null] });
const RULE_WITH_BOTH = makeRule({
  timeConstraint: ["2026-08-01", null],
  ageConstraint: [4, null],
});

describe("useRuleParameters", () => {
  it("allows both timeframe and age when neither is set", () => {
    expect(setup(PLAIN_RULE)).toMatchObject({
      canAddTimeframe: true,
      canAddAge: true,
    });
  });

  it("blocks age once a timeframe is set under the Bunny V1 constraint", () => {
    expect(setup(RULE_WITH_TIME)).toMatchObject({
      canAddTimeframe: true,
      canAddAge: false,
    });
  });

  it("blocks timeframe once an age is set under the Bunny V1 constraint", () => {
    expect(setup(RULE_WITH_AGE)).toMatchObject({
      canAddTimeframe: false,
      canAddAge: true,
    });
  });

  it("allows both regardless of existing constraints when the flag is off", () => {
    expect(setup(RULE_WITH_BOTH, { constrainForBunnyV1: false })).toMatchObject(
      { canAddTimeframe: true, canAddAge: true },
    );
  });

  it("hides parameters for an empty rule", () => {
    expect(setup(EMPTY_RULE).hasParameters).toBe(false);
  });

  it("hides parameters for categories without selectors", () => {
    expect(setup(GENDER_RULE).hasParameters).toBe(false);
  });

  it("offers a value only for value domains with the flag on", () => {
    expect(setup(PLAIN_RULE).hasValue).toBe(true);
    expect(setup(CONDITION_RULE).hasValue).toBe(false);
    expect(
      setup(PLAIN_RULE, { queryBuilderUseValueAsNumber: false }).hasValue,
    ).toBe(false);
  });
});
