import { Concept } from "@/types/api";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";
import {
  applyDemographicSubject,
  formatDemographicSubject,
} from "@/utils/demographicsText";

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
      applyDemographicSubject("People who were diagnosed with X", "Males over 85"),
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
