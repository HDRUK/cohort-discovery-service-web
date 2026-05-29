import { CombinatorType, RuleGroupType } from "@/types/rules";
import { v4 as uuidv4 } from "uuid";

import query1 from "@/data/examples/query_1.json";
import query2 from "@/data/examples/query_2.json";
import query3 from "@/data/examples/query_3.json";

export const EXAMPLES: Record<string, RuleGroupType> = {
  "E.g. Women over 18 with Covid": query1 as RuleGroupType,
  "E.g. Adults with diabetes on insulin (glargine or detemir)":
    query2 as RuleGroupType,
  "E.g. Covid and moderna or pfizer": query3 as RuleGroupType,
};

export const NO_QUERY: RuleGroupType = {
  id: uuidv4(),
  rules: [
    /*{
      id: uuidv4(),
      exclude: true,
      rule: {
        concept: {
          concept_id: 3955322,
          name:
            "Oxford, AstraZeneca - SARS-CoV-2 (COVID-19) vaccine AZD1222",
          category: "Drug",
          children: [],
        },
      },
      timeConstraint: [null, "2024-11-10T00:00:00.000Z"],
      ageConstraint: [60, 90],
    },*/
  ],
};

export const EXAMPLE_1: RuleGroupType = {
  id: uuidv4(),
  rules: [
    {
      id: uuidv4(),
      exclude: false,
      rules: [
        {
          id: uuidv4(),
          exclude: false,
          rule: {
            concept: {
              concept_id: 3955320,
              name: "Moderna - SARS-CoV-2 (COVID-19) vaccine",
              category: "Drug",
              children: [],
            },
          },
          timeConstraint: ["2020-11-10T00:00:00.000Z", null],
        },
        {
          id: uuidv4(),
          combinator: CombinatorType.OR,
          exclude: false,
        },
        {
          id: uuidv4(),
          exclude: false,
          rule: {
            concept: {
              concept_id: 3955321,
              name: "Pfizer - SARS-CoV-2 (COVID-19) vaccine",
              category: "Drug",
              children: [],
            },
          },
          ageConstraint: [null, 55],
        },
      ],
    },
    {
      id: uuidv4(),
      combinator: CombinatorType.AND,
      exclude: false,
    },
    {
      id: uuidv4(),
      exclude: true,
      rule: {
        concept: {
          concept_id: 3955322,
          name: "Oxford, AstraZeneca - SARS-CoV-2 (COVID-19) vaccine AZD1222",
          category: "Drug",
          children: [],
        },
      },
      timeConstraint: [null, "2024-11-10T00:00:00.000Z"],
      ageConstraint: [60, null],
    },
    {
      id: uuidv4(),
      combinator: CombinatorType.AND,
    },
    {
      id: uuidv4(),
      rule: {
        concept: {
          concept_id: 3959231,
          name: "Close contact with confirmed COVID-19 case person/patient",
          category: "Observation",
          children: [],
        },
      },
      timeConstraint: [null, null],
      ageConstraint: [null, null],
    },
    {
      id: uuidv4(),
      combinator: CombinatorType.AND,
    },
    {
      id: uuidv4(),
      exclude: false,
      rule: {
        concept: {
          concept_id: 3955313,
          name: "SARS-CoV-2 antibody to nucleocapsid (N) protein present",
          category: "Measurement",
          children: [],
        },
      },
    },
    {
      id: uuidv4(),
      combinator: CombinatorType.AND,
    },
    {
      id: uuidv4(),
      exclude: false,
      rule: {
        concept: {
          concept_id: 443597,
          name: "Chronic kidney disease stage 3",
          category: "Condition",
          children: [
            {
              concept_id: 601163,
              name: "Chronic kidney disease stage 3 due to drug induced diabetes mellitus",
              category: "Condition",
            },
            {
              concept_id: 37019193,
              name: "Anemia co-occurrent and due to chronic kidney disease stage 3",
              category: "Condition",
            },
            {
              concept_id: 43531653,
              name: "Chronic kidney disease stage 3 due to type 2 diabetes mellitus",
              category: "Condition",
            },
            {
              concept_id: 44782691,
              name: "Chronic kidney disease stage 3 due to hypertension",
              category: "Condition",
            },
            {
              concept_id: 44792230,
              name: "Chronic kidney disease stage 3 with proteinuria",
              category: "Condition",
            },
            {
              concept_id: 44792231,
              name: "Chronic kidney disease stage 3 without proteinuria",
              category: "Condition",
            },
            {
              concept_id: 45763854,
              name: "Chronic kidney disease stage 3A",
              category: "Condition",
            },
            {
              concept_id: 45763855,
              name: "Chronic kidney disease stage 3B",
              category: "Condition",
            },
            {
              concept_id: 45771075,
              name: "Chronic kidney disease stage 3 due to type 1 diabetes mellitus",
              category: "Condition",
            },
          ],
        },
      },
    },
  ],
};

export const EXAMPLE_WITH_ALTERNATIVES: RuleGroupType = {
  id: uuidv4(),
  rules: [
    {
      id: uuidv4(),
      exclude: false,
      rule: {
        concept: {
          concept_id: 37311061,
          name: "COVID-19",
          description: "COVID-19",
          category: "Condition",
          children: [],
          ncollections: 2,
          all_synthetic: 0,
          alternatives: [
            {
              concept_id: 605554,
              name: "Acute COVID-19",
              description: "Acute COVID-19",
              category: "Condition",
              children: [],
              ncollections: 2,
              all_synthetic: 0,
            },
            {
              concept_id: 37311060,
              name: "Suspected COVID-19",
              description: "Suspected COVID-19",
              category: "Observation",
              children: [],
              ncollections: 2,
              all_synthetic: 0,
            },
          ],
        },
      },
      valid: false,
      invalidReason: [
        "The term has alternatives, please select the intended concept in the rule block(s) below.",
      ],
    },
  ],
};

export const EXAMPLE_2 = {
  id: "board",
  rules: [
    {
      id: "group-1",
      exclude: false,
      rules: [
        {
          id: "rule-1-in-group-1",
          exclude: false,
          rule: {
            concept: {
              concept_id: 3955320,
              name: "Moderna - SARS-CoV-2 (COVID-19) vaccine",
              category: "Drug",
              children: [],
            },
          },
        },
        {
          id: "connector-1-in-group-1",
          combinator: CombinatorType.AND,
          exclude: false,
        },
        {
          id: "rule-2-in-group-1",
          exclude: false,
          rule: {
            concept: {
              concept_id: 3955320,
              name: "Moderna - SARS-CoV-2 (COVID-19) vaccine",
              category: "Drug",
              children: [],
            },
          },
        },
      ],
    },
    {
      id: "connector-1",
      combinator: CombinatorType.AND,
      exclude: false,
    },
    {
      id: "rule-2",
      exclude: true,
      rule: {
        concept: {
          concept_id: 3955322,
          name: "Oxford, AstraZeneca - SARS-CoV-2 (COVID-19) vaccine AZD1222",
          category: "Drug",
          children: [],
        },
      },
    },
    {
      id: "connector-2",
      combinator: CombinatorType.AND,
      exclude: false,
    },
    {
      id: "rule-3",
      exclude: true,
      rule: {
        concept: {
          concept_id: 3955322,
          name: "Oxford, AstraZeneca - SARS-CoV-2 (COVID-19) vaccine AZD1222",
          category: "Drug",
          children: [],
        },
      },
    },
  ],
};
