import { CombinatorType } from "@/types/rules";
import { v4 as uuidv4 } from "uuid";

export const NO_QUERY = {
  id: uuidv4(),
  rules: [],
};

export const EXAMPLE_1 = {
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
    },
    {
      id: uuidv4(),
      combinator: CombinatorType.AND,
      exclude: false,
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
    },
  ],
};
