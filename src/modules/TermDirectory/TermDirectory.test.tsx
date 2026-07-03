import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import TermDirectory from "./TermDirectory";
import { TermDirectoryEntry } from "@/types/api";
import { paginateData } from "@/utils/mock";

const mockEntries: TermDirectoryEntry[] = [
  {
    concept_id: 201826,
    concept_name: "Type 2 diabetes mellitus",
    domain_id: "Condition",
    count: 1234,
    ncollections: 2,
  },
  {
    concept_id: 4329847,
    concept_name: "Myocardial infarction",
    domain_id: "Condition",
    count: 50,
    ncollections: 1,
  },
];

describe("TermDirectory", () => {
  it("renders the correct column headers", () => {
    render(<TermDirectory entries={paginateData({ data: mockEntries })} />);

    const columns = ["OMOP ID", "Term Name", "Count", "Associated Collections"];
    for (const column of columns) {
      expect(
        screen.getByRole("columnheader", { name: new RegExp(column) }),
      ).toBeInTheDocument();
    }
  });

  it("renders a row per entry with its OMOP id, name and collection count", () => {
    render(<TermDirectory entries={paginateData({ data: mockEntries })} />);

    const firstRow = screen.getByRole("row", {
      name: /Type 2 diabetes mellitus/i,
    });
    expect(within(firstRow).getByText("201826")).toBeInTheDocument();
    expect(within(firstRow).getByText("2")).toBeInTheDocument();

    const secondRow = screen.getByRole("row", {
      name: /Myocardial infarction/i,
    });
    expect(within(secondRow).getByText("4329847")).toBeInTheDocument();
    expect(within(secondRow).getByText("1")).toBeInTheDocument();
  });

  it("renders the count, formatted with thousands separators for readability", () => {
    render(<TermDirectory entries={paginateData({ data: mockEntries })} />);

    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("shows an empty message when no terms are returned", () => {
    render(<TermDirectory entries={paginateData({ data: [] })} />);

    expect(screen.getByText("No terms found.")).toBeInTheDocument();
  });
});
