import { ApiResponse, Concept, Paginated } from "@/types/api";

const getConcepts = async (
  searchTerm: string,
  domain?: string,
): Promise<ApiResponse<Paginated<Concept>>> => {
  const t = (searchTerm ?? "").toLowerCase();

  const concepts = [
    {
      name: "262",
      concept_id: 262,
      name: "Emergency Room and Inpatient Visit",
      category: "Condition",
    },
    {
      name: "192279",
      concept_id: 192279,
      name: "Disorder of kidney due to diabetes mellitus",
      category: "Condition",
    },
    {
      name: "192671",
      concept_id: 192671,
      name: "Gastrointestinal hemorrhage",
      category: "Condition",
    },
    {
      name: "193782",
      concept_id: 193782,
      name: "End-stage renal disease",
      category: "Condition",
    },
    {
      name: "195771",
      concept_id: 195771,
      name: "Secondary diabetes mellitus",
      category: "Condition",
    },
    {
      name: "198185",
      concept_id: 198185,
      name: "Chronic renal failure",
      category: "Condition",
    },
    {
      name: "201826",
      concept_id: 201826,
      name: "Type 2 diabetes mellitus",
      category: "Condition",
    },
    {
      name: "254761",
      concept_id: 254761,
      name: "Cough",
      category: "Condition",
    },
    {
      name: "255573",
      concept_id: 255573,
      name: "Chronic obstructive pulmonary disease",
      category: "Condition",
    },
    {
      name: "316866",
      concept_id: 316866,
      name: "Hypertensive disorder",
      category: "Condition",
    },
    {
      name: "317009",
      concept_id: 317009,
      name: "Asthma",
      category: "Condition",
    },
    {
      name: "319049",
      concept_id: 319049,
      name: "Acute respiratory failure",
      category: "Condition",
    },
    {
      name: "319835",
      concept_id: 319835,
      name: "Congestive heart failure",
      category: "Condition",
    },
    {
      name: "321588",
      concept_id: 321588,
      name: "Heart disease",
      category: "Condition",
    },
    {
      name: "375557",
      concept_id: 375557,
      name: "Cerebral embolism",
      category: "Condition",
    },
    {
      name: "433736",
      concept_id: 433736,
      name: "Obesity",
      category: "Condition",
    },
    {
      name: "436409",
      concept_id: 436409,
      name: "Abnormal pupil",
      category: "Condition",
    },
    {
      name: "441840",
      concept_id: 441840,
      name: "Clinical finding",
      category: "Condition",
    },
    {
      name: "443597",
      concept_id: 443597,
      name: "Chronic kidney disease stage 3",
      category: "Condition",
    },
    {
      name: "443611",
      concept_id: 443611,
      name: "Chronic kidney disease stage 5",
      category: "Condition",
    },
    {
      name: "443612",
      concept_id: 443612,
      name: "Chronic kidney disease stage 4",
      category: "Condition",
    },
    {
      name: "443883",
      concept_id: 443883,
      name: "Acute disease",
      category: "Condition",
    },
    {
      name: "443961",
      concept_id: 443961,
      name: "Anemia of chronic renal failure",
      category: "Condition",
    },
    {
      name: "444100",
      concept_id: 444100,
      name: "Mood disorder",
      category: "Condition",
    },
    {
      name: "4013072",
      concept_id: 4013072,
      name: "O/E: inspection of blood NOS",
      category: "Condition",
    },
    {
      name: "4112349",
      concept_id: 4112349,
      name: "Acute ulcerative laryngitis",
      category: "Condition",
    },
    {
      name: "443601",
      concept_id: 443601,
      name: "Chronic kidney disease stage 2",
      category: "Condition",
    },
    {
      name: "4182210",
      concept_id: 4182210,
      name: "Dementia",
      category: "Condition",
    },
    {
      name: "36684857",
      concept_id: 36684857,
      name: "Metastatic non-small cell lung cancer",
      category: "Condition",
    },
    {
      name: "443614",
      concept_id: 443614,
      name: "Chronic kidney disease stage 1",
      category: "Condition",
    },
    {
      name: "601163",
      concept_id: 601163,
      description:
        "Chronic kidney disease stage 3 due to drug induced diabetes mellitus",
      category: "Condition",
    },
    {
      name: "762001",
      concept_id: 762001,
      description:
        "Benign hypertensive heart disease and chronic renal disease stage 3",
      category: "Condition",
    },
    {
      name: "36712854",
      concept_id: 36712854,
      name: "Down syndrome detected by multiple marker screening",
      category: "Condition",
    },
    {
      name: "762033",
      concept_id: 762033,
      description:
        "Malignant hypertensive heart disease and chronic renal disease stage 3",
      category: "Condition",
    },
    {
      name: "40480290",
      concept_id: 40480290,
      name: "Goldendoodle",
      category: "Condition",
    },
    {
      name: "1075888",
      concept_id: 1075888,
      description:
        "Hypertension in chronic kidney disease stage 3 due to type 1 diabetes mellitus",
      category: "Condition",
    },
    {
      name: "40484648",
      concept_id: 40484648,
      name: "Uncontrolled type 1 diabetes mellitus",
      category: "Condition",
    },
    {
      name: "45757363",
      concept_id: 45757363,
      name: "Hypoglycemia due to type 2 diabetes mellitus",
      category: "Condition",
    },
    {
      name: "8507",
      concept_id: 8507,
      name: "MALE",
      category: "Gender",
    },
    {
      name: "8532",
      concept_id: 8532,
      name: "FEMALE",
      category: "Gender",
    },
    {
      name: "1075908",
      concept_id: 1075908,
      description:
        "Chronic kidney disease stage 3B due to type 2 diabetes mellitus",
      category: "Condition",
    },
    {
      name: "1075909",
      concept_id: 1075909,
      description:
        "Chronic kidney disease stage 3A due to type 2 diabetes mellitus",
      category: "Condition",
    },
    {
      name: "1075910",
      concept_id: 1075910,
      description:
        "Chronic kidney disease stage 3B due to type 1 diabetes mellitus",
      category: "Condition",
    },
    {
      name: "1075911",
      concept_id: 1075911,
      description:
        "Chronic kidney disease stage 3A due to type 1 diabetes mellitus",
      category: "Condition",
    },
    {
      name: "36716184",
      concept_id: 36716184,
      name: "Chronic kidney disease following donor nephrectomy",
      category: "Condition",
    },
    {
      name: "36716455",
      concept_id: 36716455,
      name: "Chronic kidney disease due to traumatic loss of kidney",
      category: "Condition",
    },
    {
      name: "36716947",
      concept_id: 36716947,
      name: "Chronic renal insufficiency",
      category: "Condition",
    },
    {
      name: "36717349",
      concept_id: 36717349,
      name: "Chronic kidney disease due to systemic infection",
      category: "Condition",
    },
    {
      name: "36717534",
      concept_id: 36717534,
      description:
        "Chronic kidney disease due to and following excision of neoplasm of kidney",
      category: "Condition",
    },
    {
      name: "37017104",
      concept_id: 37017104,
      name: "Chronic kidney disease mineral and bone disorder",
      category: "Condition",
    },
  ];

  const data = concepts.filter((c) => {
    const matchesSearch =
      (c.description ?? "").toLowerCase().includes(t) ||
      String(c.concept_id).includes(t);

    const matchesDomain = domain ? c.category === domain : true;

    return matchesSearch && matchesDomain;
  });

  return {
    message: "success",
    data: {
      data,
      from: 1,
      to: 1,
      current_page: 1,
      per_page: data.length,
      total: data.length,
      last_page: 1,
    },
  };
};

export default getConcepts;
