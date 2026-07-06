import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import TermDirectory from "./TermDirectory";
import { DefaultProvider } from "@/providers/DefaultProvider";
import { mockTermDirectoryEntries } from "@/actions/termDirectory/__mocks__/getTermDirectory";
import { paginateData } from "@/utils/mock";
import { TermDirectoryEntry, Paginated } from "@/types/api";

const renderComponent = (entries: Paginated<TermDirectoryEntry>) =>
  render(
    <DefaultProvider>
      <TermDirectory entries={entries} />
    </DefaultProvider>,
  );

describe("TermDirectory", () => {
  it("renders the correct column headers", () => {
    renderComponent(paginateData({ data: mockTermDirectoryEntries }));

    const columns = ["OMOP ID", "Term Name", "Count", "Associated Collections"];
    for (const column of columns) {
      expect(
        screen.getByRole("columnheader", { name: new RegExp(column) }),
      ).toBeInTheDocument();
    }
  });

  it("renders a row per entry with its OMOP id, name and collection count", () => {
    renderComponent(paginateData({ data: mockTermDirectoryEntries }));

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
    renderComponent(paginateData({ data: mockTermDirectoryEntries }));

    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("shows an empty message when no terms are returned", () => {
    renderComponent(paginateData({ data: [] }));

    expect(screen.getByText("No terms found.")).toBeInTheDocument();
  });

  it("renders a search box so users can filter the directory", () => {
    renderComponent(paginateData({ data: mockTermDirectoryEntries }));

    expect(
      screen.getByPlaceholderText("Search by term name or OMOP ID..."),
    ).toBeInTheDocument();
  });
});
