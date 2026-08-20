import { Concept } from "@/types/api";
import { formatAgeSummary, formatConceptCountSummary } from "./summary";

const concept = (concept_id: number): Concept =>
  ({ concept_id, name: `c${concept_id}`, category: "Gender" }) as Concept;

describe("demographics summary formatters", () => {
  it("formats age range and Any", () => {
    expect(formatAgeSummary([18, 65])).toBe("Age 18–65");
    expect(formatAgeSummary(null)).toBe("Age Any");
  });

  it("formats concept counts with pluralisation and Any", () => {
    expect(formatConceptCountSummary("Sex", [])).toBe("Sex Any");
    expect(formatConceptCountSummary("Sex", [concept(1)])).toBe("1 Sex concept");
    expect(formatConceptCountSummary("Sex", [concept(1), concept(2)])).toBe(
      "2 Sex concepts",
    );
  });
});
