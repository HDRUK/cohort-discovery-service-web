import {
  SEX_CONCEPTS,
  demographicOptionToConcept,
} from "@/config/demographics";

describe("demographics config", () => {
  it("exposes sex options with unique concept ids", () => {
    const ids = SEX_CONCEPTS.map((o) => o.concept_id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(SEX_CONCEPTS.length).toBeGreaterThan(0);
  });

  it("maps an option to a Concept with a Gender category", () => {
    const concept = demographicOptionToConcept({
      concept_id: 8507,
      name: "Male",
    });
    expect(concept).toEqual({
      concept_id: 8507,
      name: "Male",
      category: "Gender",
    });
  });
});
