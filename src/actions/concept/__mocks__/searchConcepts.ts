import { ApiResponse, Concept, Paginated } from "@/types/api";

interface SearchConceptsBody {
  concept_name?: string[];
  concept_id?: string[];
  domain?: string;
  collections?: string[];
  page?: number;
  per_page?: number;
  include_ancestors?: boolean;
}

const searchConcepts = async (
  body: SearchConceptsBody = {},
): Promise<ApiResponse<Paginated<Partial<Concept>>>> => {
  const searchTerms = [...(body.concept_name ?? []), ...(body.concept_id ?? [])]
    .filter(Boolean)
    .map((term) => term.toLowerCase());

  const domain = body.domain?.toLowerCase();
  const page = body.page ?? 1;
  const perPage = body.per_page ?? 20;

  const concepts: Partial<Concept>[] = [
    {
      concept_id: 262,
      name: "Emergency Room and Inpatient Visit",
      category: "Condition",
    },
    {
      concept_id: 192279,
      name: "Disorder of kidney due to diabetes mellitus",
      category: "Condition",
    },
    {
      concept_id: 192671,
      name: "Gastrointestinal hemorrhage",
      category: "Condition",
    },
    {
      concept_id: 193782,
      name: "End-stage renal disease",
      category: "Condition",
    },
    {
      concept_id: 195771,
      name: "Secondary diabetes mellitus",
      category: "Condition",
    },
    {
      concept_id: 198185,
      name: "Chronic renal failure",
      category: "Condition",
    },
    {
      concept_id: 201826,
      name: "Type 2 diabetes mellitus",
      category: "Condition",
    },
    { concept_id: 254761, name: "Cough", category: "Condition" },
    {
      concept_id: 255573,
      name: "Chronic obstructive pulmonary disease",
      category: "Condition",
    },
    {
      concept_id: 316866,
      name: "Hypertensive disorder",
      category: "Condition",
    },
    { concept_id: 317009, name: "Asthma", category: "Condition" },
    {
      concept_id: 319049,
      name: "Acute respiratory failure",
      category: "Condition",
    },
    {
      concept_id: 319835,
      name: "Congestive heart failure",
      category: "Condition",
    },
    { concept_id: 321588, name: "Heart disease", category: "Condition" },
    { concept_id: 375557, name: "Cerebral embolism", category: "Condition" },
    { concept_id: 433736, name: "Obesity", category: "Condition" },
    { concept_id: 436409, name: "Abnormal pupil", category: "Condition" },
    { concept_id: 441840, name: "Clinical finding", category: "Condition" },
    {
      concept_id: 443597,
      name: "Chronic kidney disease stage 3",
      category: "Condition",
    },
    {
      concept_id: 443611,
      name: "Chronic kidney disease stage 5",
      category: "Condition",
    },
    {
      concept_id: 443612,
      name: "Chronic kidney disease stage 4",
      category: "Condition",
    },
    { concept_id: 443883, name: "Acute disease", category: "Condition" },
    {
      concept_id: 443961,
      name: "Anemia of chronic renal failure",
      category: "Condition",
    },
    { concept_id: 444100, name: "Mood disorder", category: "Condition" },
    {
      concept_id: 4013072,
      name: "O/E: inspection of blood NOS",
      category: "Condition",
    },
    {
      concept_id: 4112349,
      name: "Acute ulcerative laryngitis",
      category: "Condition",
    },
    {
      concept_id: 443601,
      name: "Chronic kidney disease stage 2",
      category: "Condition",
    },
    { concept_id: 4182210, name: "Dementia", category: "Condition" },
    {
      concept_id: 36684857,
      name: "Metastatic non-small cell lung cancer",
      category: "Condition",
    },
    {
      concept_id: 443614,
      name: "Chronic kidney disease stage 1",
      category: "Condition",
    },
    {
      concept_id: 601163,
      name: "Chronic kidney disease stage 3 due to drug induced diabetes mellitus",
      category: "Condition",
    },
    {
      concept_id: 762001,
      name: "Benign hypertensive heart disease and chronic renal disease stage 3",
      category: "Condition",
    },
    {
      concept_id: 36712854,
      name: "Down syndrome detected by multiple marker screening",
      category: "Condition",
    },
    {
      concept_id: 762033,
      name: "Malignant hypertensive heart disease and chronic renal disease stage 3",
      category: "Condition",
    },
    { concept_id: 40480290, name: "Goldendoodle", category: "Condition" },
    {
      concept_id: 1075888,
      name: "Hypertension in chronic kidney disease stage 3 due to type 1 diabetes mellitus",
      category: "Condition",
    },
    {
      concept_id: 40484648,
      name: "Uncontrolled type 1 diabetes mellitus",
      category: "Condition",
    },
    {
      concept_id: 45757363,
      name: "Hypoglycemia due to type 2 diabetes mellitus",
      category: "Condition",
    },
    { concept_id: 8507, name: "MALE", category: "Gender" },
    { concept_id: 8532, name: "FEMALE", category: "Gender" },
    {
      concept_id: 1075908,
      name: "Chronic kidney disease stage 3B due to type 2 diabetes mellitus",
      category: "Condition",
    },
    {
      concept_id: 1075909,
      name: "Chronic kidney disease stage 3A due to type 2 diabetes mellitus",
      category: "Condition",
    },
    {
      concept_id: 1075910,
      name: "Chronic kidney disease stage 3B due to type 1 diabetes mellitus",
      category: "Condition",
    },
    {
      concept_id: 1075911,
      name: "Chronic kidney disease stage 3A due to type 1 diabetes mellitus",
      category: "Condition",
    },
    {
      concept_id: 36716184,
      name: "Chronic kidney disease following donor nephrectomy",
      category: "Condition",
    },
    {
      concept_id: 36716455,
      name: "Chronic kidney disease due to traumatic loss of kidney",
      category: "Condition",
    },
    {
      concept_id: 36716947,
      name: "Chronic renal insufficiency",
      category: "Condition",
    },
    {
      concept_id: 36717349,
      name: "Chronic kidney disease due to systemic infection",
      category: "Condition",
    },
    {
      concept_id: 36717534,
      name: "Chronic kidney disease due to and following excision of neoplasm of kidney",
      category: "Condition",
    },
    {
      concept_id: 37017104,
      name: "Chronic kidney disease mineral and bone disorder",
      category: "Condition",
    },
  ];

  const filtered = concepts.filter((c) => {
    const name = (c.name ?? "").toLowerCase();
    const conceptId = String(c.concept_id ?? "");
    const category = (c.category ?? "").toLowerCase();

    const matchesSearch =
      searchTerms.length === 0 ||
      searchTerms.some(
        (term) => name.includes(term) || conceptId.includes(term),
      );

    const matchesDomain = domain ? category === domain : true;

    return matchesSearch && matchesDomain;
  });

  const start = (page - 1) * perPage;
  const data = filtered.slice(start, start + perPage);

  return {
    message: "success",
    data: {
      data,
      from: filtered.length ? start + 1 : 0,
      to: start + data.length,
      current_page: page,
      per_page: perPage,
      total: filtered.length,
      last_page: Math.max(1, Math.ceil(filtered.length / perPage)),
    },
  };
};

export default searchConcepts;
