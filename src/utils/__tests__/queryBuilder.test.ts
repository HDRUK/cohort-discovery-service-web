import { CombinatorType, RuleGroupType } from "@/types/rules";
import { queryToText } from "@/utils/queryBuilder";
import { v4 as uuidv4 } from "uuid";

describe("queryToText", () => {
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

    expect(queryToText(query)).toBe(
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

    expect(queryToText(query)).toBe(
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

    expect(queryToText(query)).toBe(
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

    expect(queryToText(query)).toBe(
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

    expect(queryToText(query)).toBe(
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

    expect(queryToText(query, { includeBrackets: true })).toBe(
      "People who received COVID-19 vaccine, and (were measured with Rubella IgG level or Anti GA1 antibody level)",
    );
  });
});
