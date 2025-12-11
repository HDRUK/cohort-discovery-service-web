import { CombinatorType, RuleGroupType } from "@/types/rules";
import { v4 as uuidv4 } from "uuid";

export const NO_QUERY = {
  id: uuidv4(),
  rules: [],
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
              description: "Moderna - SARS-CoV-2 (COVID-19) vaccine",
              category: "Drug",
              children: [],
            },
          },
          timeConstraint: ["2020-11-10T00:00:00.000Z", null],
          ageConstraint: [0, 55],
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
              description: "Pfizer - SARS-CoV-2 (COVID-19) vaccine",
              category: "Drug",
              children: [],
            },
          },
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
          description:
            "Oxford, AstraZeneca - SARS-CoV-2 (COVID-19) vaccine AZD1222",
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
          description:
            "Close contact with confirmed COVID-19 case person/patient",
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
          description:
            "SARS-CoV-2 antibody to nucleocapsid (N) protein present",
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
          description: "Chronic kidney disease stage 3",
          category: "Condition",
          children: [
            {
              concept_id: 601163,
              description:
                "Chronic kidney disease stage 3 due to drug induced diabetes mellitus",
              category: "Condition",
            },
            {
              concept_id: 37019193,
              description:
                "Anemia co-occurrent and due to chronic kidney disease stage 3",
              category: "Condition",
            },
            {
              concept_id: 43531653,
              description:
                "Chronic kidney disease stage 3 due to type 2 diabetes mellitus",
              category: "Condition",
            },
            {
              concept_id: 44782691,
              description: "Chronic kidney disease stage 3 due to hypertension",
              category: "Condition",
            },
            {
              concept_id: 44792230,
              description: "Chronic kidney disease stage 3 with proteinuria",
              category: "Condition",
            },
            {
              concept_id: 44792231,
              description: "Chronic kidney disease stage 3 without proteinuria",
              category: "Condition",
            },
            {
              concept_id: 45763854,
              description: "Chronic kidney disease stage 3A",
              category: "Condition",
            },
            {
              concept_id: 45763855,
              description: "Chronic kidney disease stage 3B",
              category: "Condition",
            },
            {
              concept_id: 45771075,
              description:
                "Chronic kidney disease stage 3 due to type 1 diabetes mellitus",
              category: "Condition",
            },
          ],
        },
      },
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
              description: "Moderna - SARS-CoV-2 (COVID-19) vaccine",
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
              description: "Moderna - SARS-CoV-2 (COVID-19) vaccine",
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
          description:
            "Oxford, AstraZeneca - SARS-CoV-2 (COVID-19) vaccine AZD1222",
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
          description:
            "Oxford, AstraZeneca - SARS-CoV-2 (COVID-19) vaccine AZD1222",
          category: "Drug",
          children: [],
        },
      },
    },
  ],
};
