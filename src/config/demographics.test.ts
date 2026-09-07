import {
  DemographicDomain,
  demographicGuidance,
  demographicOptionToConcept,
} from "@/config/demographics";
import { TermDirectoryEntry } from "@/types/api";

const entry = (
  overrides: Partial<TermDirectoryEntry> = {},
): TermDirectoryEntry => ({
  concept_id: 8507,
  concept_name: "Male",
  domain_id: DemographicDomain.Gender,
  count: 0,
  ncollections: 0,
  ...overrides,
});

describe("demographics config", () => {
  it("maps a term-directory entry to a Concept, deriving category from domain_id", () => {
    expect(demographicOptionToConcept(entry())).toEqual({
      concept_id: 8507,
      name: "Male",
      category: DemographicDomain.Gender,
    });

    expect(
      demographicOptionToConcept(
        entry({
          concept_id: 8527,
          concept_name: "White",
          domain_id: DemographicDomain.Race,
        }),
      ),
    ).toEqual({
      concept_id: 8527,
      name: "White",
      category: DemographicDomain.Race,
    });
  });

  it("builds guidance text for the given demographic", () => {
    expect(demographicGuidance("sex")).toContain("patient sex criteria");
    expect(demographicGuidance("race")).toContain("patient race criteria");
  });
});
