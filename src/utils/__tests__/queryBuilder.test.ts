import { CombinatorType, RuleGroupType } from "@/types/rules";
import {
  queryRulesToText,
  queryToText,
  formatDemographicSubject,
  applyDemographicSubject,
} from "@/utils/queryBuilder";
import { Concept } from "@/types/api";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";
import { v4 as uuidv4 } from "uuid";

describe("queryRulesToText", () => {
  it("collapses repeated verbs into comma list", async () => {
    const query: RuleGroupType = {
      id: uuidv4(),
      rules: [
        {
          id: uuidv4(),
          rule: {
            concept: {
              concept_id: 102,
              name: "Chronic laryngitis",
              category: "Condition",
            },
          },
        },
        { id: uuidv4(), combinator: CombinatorType.AND },
        {
          id: uuidv4(),
          rule: {
            concept: {
              concept_id: 101,
              name: "Chronic kidney disease",
              category: "Condition",
            },
          },
        },
        { id: uuidv4(), combinator: CombinatorType.AND },
        {
          id: uuidv4(),
          rule: {
            concept: {
              concept_id: 100,
              name: "Sickle cell-hemoglobin C disease",
              category: "Condition",
            },
          },
        },
      ],
    };

    expect(queryRulesToText(query)).toBe(
      "People who were diagnosed with Chronic laryngitis, Chronic kidney disease, and Sickle cell-hemoglobin C disease",
    );
  });

  it("handles age constraints", async () => {
    const query: RuleGroupType = {
      id: uuidv4(),
      rules: [
        {
          id: uuidv4(),
          rule: {
            concept: {
              concept_id: 100,
              name: "Chronic laryngitis",
              category: "Condition",
            },
          },
          ageConstraint: [4, null],
        },
      ],
    };

    expect(queryRulesToText(query)).toBe(
      "People who were diagnosed with Chronic laryngitis when they were aged over 4 years",
    );
  });

  it("handles time constraints", () => {
    const query: RuleGroupType = {
      id: uuidv4(),
      rules: [
        {
          id: uuidv4(),
          rule: {
            concept: {
              concept_id: 100,
              name: "Type 2 diabetes mellitus",
              category: "Condition",
            },
          },
          timeConstraint: ["2026-08-11T23:00:00.000Z", null],
        },
      ],
    };

    expect(queryRulesToText(query)).toBe(
      "People who were diagnosed with Type 2 diabetes mellitus which occurred after 2026-08-11",
    );
  });

  it("handles mixed constraints and punctuation", () => {
    const query: RuleGroupType = {
      id: uuidv4(),
      rules: [
        {
          id: uuidv4(),
          rule: {
            concept: {
              concept_id: 101,
              name: "Chronic laryngitis",
              category: "Condition",
            },
          },
          ageConstraint: [3, null],
        },
        { id: uuidv4(), combinator: CombinatorType.AND },
        {
          id: uuidv4(),
          rule: {
            concept: {
              concept_id: 102,
              name: "Sickle cell-hemoglobin C disease",
              category: "Condition",
            },
          },
          timeConstraint: ["2026-08-11T23:00:00.000Z", null],
        },
        { id: uuidv4(), combinator: CombinatorType.AND },
        {
          id: uuidv4(),
          rule: {
            concept: {
              concept_id: 103,
              name: "Long Covid-19",
              category: "Observation",
            },
          },
        },
      ],
    };

    expect(queryRulesToText(query)).toBe(
      "People who were diagnosed with Chronic laryngitis when they were aged over 3 years, and Sickle cell-hemoglobin C disease which occurred after 2026-08-11, and were observed with Long Covid-19",
    );
  });

  it("handles OR groups", () => {
    const query: RuleGroupType = {
      id: uuidv4(),
      rules: [
        {
          id: uuidv4(),
          rules: [
            {
              id: uuidv4(),
              rule: {
                concept: {
                  concept_id: 101,
                  name: "Rubella IgG level",
                  category: "Measurement",
                },
              },
            },
            { id: uuidv4(), combinator: CombinatorType.OR },
            {
              id: uuidv4(),
              rule: {
                concept: {
                  concept_id: 102,
                  name: "Anti GA1 antibody level",
                  category: "Measurement",
                },
              },
            },
          ],
        },
      ],
    };

    expect(queryRulesToText(query)).toBe(
      "People who were measured with Rubella IgG level or Anti GA1 antibody level",
    );
  });

  test("renders brackets when includeBrackets=true", () => {
    const query: RuleGroupType = {
      id: uuidv4(),
      rules: [
        {
          id: uuidv4(),
          rule: {
            concept: {
              concept_id: 99,
              name: "COVID-19 vaccine",
              category: "Drug",
            },
          },
        },
        { id: uuidv4(), combinator: CombinatorType.AND },
        {
          id: uuidv4(),
          rules: [
            {
              id: uuidv4(),
              rule: {
                concept: {
                  concept_id: 101,
                  name: "Rubella IgG level",
                  category: "Measurement",
                },
              },
            },
            {
              id: uuidv4(),
              combinator: CombinatorType.OR,
            },
            {
              id: uuidv4(),
              rule: {
                concept: {
                  concept_id: 102,
                  name: "Anti GA1 antibody level",
                  category: "Measurement",
                },
              },
            },
          ],
        },
      ],
    };

    expect(queryRulesToText(query, { includeBrackets: true })).toBe(
      "People who received COVID-19 vaccine, and (were measured with Rubella IgG level or Anti GA1 antibody level)",
    );
  });
});

const concept = (concept_id: number, name: string): Concept =>
  ({ concept_id, name, category: "Gender" }) as Concept;

const male = concept(8507, "Male");
const female = concept(8532, "Female");

describe("formatDemographicSubject", () => {
  it("returns null when nothing is set", () => {
    expect(formatDemographicSubject(null, [])).toBeNull();
    expect(
      formatDemographicSubject([MIN_AGE_FILTER, MAX_AGE_FILTER], []),
    ).toBeNull();
  });

  it("pluralises a single sex", () => {
    expect(formatDemographicSubject(null, [male])).toBe("Males");
  });

  it("does not throw when sex is missing (legacy definitions)", () => {
    expect(
      formatDemographicSubject([85, MAX_AGE_FILTER], undefined as never),
    ).toBe("People over 85");
  });

  it("joins multiple sexes with 'or'", () => {
    expect(formatDemographicSubject(null, [female, male])).toBe(
      "Females or Males",
    );
  });

  it("phrases age only against 'People'", () => {
    expect(formatDemographicSubject([85, MAX_AGE_FILTER], [])).toBe(
      "People over 85",
    );
    expect(formatDemographicSubject([MIN_AGE_FILTER, 40], [])).toBe(
      "People under 40",
    );
    expect(formatDemographicSubject([18, 65], [])).toBe(
      "People between 18 and 65",
    );
  });

  it("combines sex and age", () => {
    expect(formatDemographicSubject([85, MAX_AGE_FILTER], [male])).toBe(
      "Males over 85",
    );
  });

  it("phrases location only against 'People'", () => {
    expect(
      formatDemographicSubject(null, [], {
        lat: 51.5,
        lon: -0.1,
        radius: 50000,
        address: "London",
      }),
    ).toBe("People living within 50.0 km of London");
  });

  it("falls back to coordinates when the location has no address", () => {
    expect(
      formatDemographicSubject(null, [], {
        lat: 51.5,
        lon: -0.1,
        radius: 5000,
      }),
    ).toBe("People living within 5.0 km of (51.5000, -0.1000)");
  });

  it("combines sex, age and location", () => {
    expect(
      formatDemographicSubject([85, MAX_AGE_FILTER], [male], {
        lat: 51.5,
        lon: -0.1,
        radius: 50000,
        address: "London",
      }),
    ).toBe("Males over 85 living within 50.0 km of London");
  });
});

describe("applyDemographicSubject", () => {
  it("replaces the leading People noun", () => {
    expect(
      applyDemographicSubject(
        "People who were diagnosed with X",
        "Males over 85",
      ),
    ).toBe("Males over 85 who were diagnosed with X");
  });

  it("returns the subject alone for empty query text", () => {
    expect(applyDemographicSubject("", "Males over 85")).toBe("Males over 85");
  });

  it("leaves text unchanged when it does not start with People", () => {
    expect(applyDemographicSubject("Something else", "Males")).toBe(
      "Something else",
    );
  });
});

describe("queryToText", () => {
  const condition = (name: string): Concept =>
    ({ concept_id: 1, name, category: "Condition" }) as Concept;
  const covid = condition("Covid");
  const flu = condition("Flu");
  const asthma = condition("Asthma");

  const conditionRule: RuleGroupType["rules"][number] = {
    id: "rule-1",
    rule: {
      concept: {
        concept_id: 100,
        name: "Chronic laryngitis",
        category: "Condition",
      },
    },
  };

  it("renders a demographics-only query using the subject alone", () => {
    const definition: RuleGroupType = {
      id: "group-1",
      rules: [],
      demographics: {
        age: [85, MAX_AGE_FILTER],
        sex: [male],
        race: [],
        location: null,
      },
    };

    expect(queryToText(definition)).toBe("Males over 85");
  });

  it("folds demographics into the concept-rule text", () => {
    const definition: RuleGroupType = {
      id: "group-1",
      rules: [conditionRule],
      demographics: {
        age: [85, MAX_AGE_FILTER],
        sex: [male],
        race: [],
        location: null,
      },
    };

    expect(queryToText(definition)).toBe(
      "Males over 85 who were diagnosed with Chronic laryngitis",
    );
  });

  it("falls back to the concept-rule text when no demographics are set", () => {
    const definition: RuleGroupType = {
      id: "group-1",
      rules: [conditionRule],
    };

    expect(queryToText(definition)).toBe(
      "People who were diagnosed with Chronic laryngitis",
    );
  });

  it("omits demographics when includeDemographics is false", () => {
    const definition: RuleGroupType = {
      id: "group-1",
      rules: [conditionRule],
      demographics: {
        age: [85, MAX_AGE_FILTER],
        sex: [male],
        race: [],
        location: null,
      },
    };

    expect(queryToText(definition, { includeDemographics: false })).toBe(
      "People who were diagnosed with Chronic laryngitis",
    );
  });

  it("scopes the demographic subject over an OR rule group", () => {
    const definition: RuleGroupType = {
      id: "group-1",
      rules: [
        { id: "a", rule: { concept: covid } },
        { id: "op", combinator: CombinatorType.OR },
        { id: "b", rule: { concept: flu } },
      ],
      demographics: {
        age: [85, MAX_AGE_FILTER],
        sex: [male],
        race: [],
        location: null,
      },
    };

    // (Male AND over-85) AND (Covid OR Flu) — the subject scopes the whole
    // "who ..." clause, so the disjunction stays intersected with demographics.
    expect(queryToText(definition)).toBe(
      "Males over 85 who were diagnosed with Covid or Flu",
    );
  });

  it("scopes the demographic subject over a mixed OR/AND rule group", () => {
    const definition: RuleGroupType = {
      id: "group-1",
      rules: [
        { id: "a", rule: { concept: covid } },
        { id: "op1", combinator: CombinatorType.OR },
        { id: "b", rule: { concept: flu } },
        { id: "op2", combinator: CombinatorType.AND },
        { id: "c", rule: { concept: asthma } },
      ],
      demographics: {
        age: [85, MAX_AGE_FILTER],
        sex: [male],
        race: [],
        location: null,
      },
    };

    expect(queryToText(definition)).toBe(
      "Males over 85 who were diagnosed with Covid or Flu, and were diagnosed with Asthma",
    );
  });
});
