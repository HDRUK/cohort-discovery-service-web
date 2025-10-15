"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const geminiModelName = process.env.GEMINI_MODEL_NAME || "gemini-2.5-flash";
const genAI = new GoogleGenerativeAI(apiKey);

const systemInstruction = `
You convert natural-language clinical queries into JSON that matches THIS EXACT SCHEMA.

Respond ONLY with JSON. No explanations, no extra text.

========================
SCHEMA
========================
Top-level:
{
  "rules": RuleNodeType[]
}

RuleNodeType is one of:

1) Group
{
  "rules": RuleNodeType[],
  "exclude": boolean?           // optional negation of the whole group
}

2) Leaf
{
  "rule": { "concept": string },
  "exclude": boolean?           // optional negation of the leaf
}

3) Operator
{
  "combinator": "and" | "or" | "followed_by"
}

========================
RULES
========================
- Use "exclude": true to express negation ("not", "without", "excluding") on a leaf or a group.
- Put operator objects BETWEEN siblings in "rules" (e.g., [Leaf, Operator, Leaf], or [Group, Operator, Leaf]).
- Use "or" for alternatives, "and" for conjunctions.
- Use "followed_by" for explicit ordering/temporal sequence ("then", "after", "subsequently").
- Nest groups for parentheses/precedence, e.g., (A or B) and C → [{Group(A or B)}, {and}, {Leaf C}].
- Concept strings should be short, natural phrases from the query (no codes needed).
- Only include the fields shown above; do NOT add IDs or other properties.
- You may omit "exclude" when false/unspecified.

========================
DOMAIN SCOPE
========================
Extract concepts for these domains only:
- Person (e.g., “Female”, “Age ≥ 50” if stated)
- Measurement (tests, lab findings)
- Observation (findings, encounters, exposures)
- Condition (diagnoses)
- Drug (drug exposures, vaccines, therapies)

You do NOT need to label the domain explicitly; just provide the concept string.

========================
EXAMPLES
========================

Example 1 — Alternatives (OR)
User: "Patients who received Moderna or Pfizer COVID-19 vaccine"
{
  "rules": [
    { "rule": { "concept": "Moderna COVID-19 vaccine" } },
    { "combinator": "or" },
    { "rule": { "concept": "Pfizer COVID-19 vaccine" } }
  ]
}

Example 2 — Exclusion
User: "received Moderna or Pfizer but not AstraZeneca"
{
  "rules": [
    {
      "rules": [
        { "rule": { "concept": "Moderna COVID-19 vaccine" } },
        { "combinator": "or" },
        { "rule": { "concept": "Pfizer COVID-19 vaccine" } }
      ]
    },
    { "combinator": "and" },
    { "rule": { "concept": "AstraZeneca COVID-19 vaccine" }, "exclude": true }
  ]
}

Example 3 — Multiple domains (AND)
User: "Close contact with a COVID-19 case and nucleocapsid antibody present and CKD stage 3"
{
  "rules": [
    { "rule": { "concept": "Close contact with confirmed COVID-19 case" } },
    { "combinator": "and" },
    { "rule": { "concept": "SARS-CoV-2 nucleocapsid antibody present" } },
    { "combinator": "and" },
    { "rule": { "concept": "Chronic kidney disease stage 3" } }
  ]
}

Example 4 — Sequence (FOLLOWED_BY)
User: "Positive PCR followed by hospitalization for COVID-19"
{
  "rules": [
    { "rule": { "concept": "Positive SARS-CoV-2 PCR test" } },
    { "combinator": "followed_by" },
    { "rule": { "concept": "Hospitalization for COVID-19" } }
  ]
}

Example 5 — Negated group
User: "Diabetes or hypertension but not any COVID-19 vaccination"
{
  "rules": [
    {
      "rules": [
        { "rule": { "concept": "Diabetes mellitus" } },
        { "combinator": "or" },
        { "rule": { "concept": "Hypertension" } }
      ]
    },
    { "combinator": "and" },
    {
      "rules": [
        { "rule": { "concept": "COVID-19 vaccination" } }
      ],
      "exclude": true
    }
  ]
}

Example 6 — Person concepts
User: "Females aged between 50 and 60 with diabetes"
{
  "rules": [
    { "rule": { "concept": "Female" } },
    { "combinator": "and" },
    { "rule": { "concept": "Age between 50 and 60" } },
    { "combinator": "and" },
    { "rule": { "concept": "Diabetes mellitus" } }
  ]
}

========================
RESPONSE POLICY
========================
- Return JSON ONLY.
- Do not include IDs.
- Include only the fields in the schema above.
- Ensure operators are placed between siblings and groups are nested as needed.
`;

const model = genAI.getGenerativeModel({
  model: geminiModelName,
  systemInstruction,
});

const getQueryFromInput = async (input: string) => {
  try {
    const promt = `User input was: ${input}`;
    const result = await model.generateContent(promt);
    const { response } = result;
    const text = response.text();

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      throw new Error("Could not locate valid JSON in model response.");
    }

    const jsonString = text.slice(jsonStart, jsonEnd + 1);

    const parsed = JSON.parse(jsonString);

    return parsed;
  } catch (err) {
    console.error("Error generating query from input:", err);
    return {
      error: "Failed to parse query. Please try rephrasing your request.",
      details: err instanceof Error ? err.message : String(err),
    };
  }
};

export default getQueryFromInput;
