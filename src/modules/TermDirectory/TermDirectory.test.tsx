import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TermDirectory from "./TermDirectory";
import { DefaultProvider } from "@/providers/DefaultProvider";
import { NotifyProvider } from "@/providers/NotifyProvider";
import { mockTermDirectoryEntries } from "@/actions/termDirectory/__mocks__/getTermDirectory";
import { paginateData } from "@/utils/mock";
import { TermDirectoryEntry, Paginated } from "@/types/api";

let mockSearchParams = new URLSearchParams("page=1&per_page=5");

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  usePathname: () => "/term-directory",
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

const renderComponent = (entries: Paginated<TermDirectoryEntry>) =>
  render(
    <DefaultProvider>
      <NotifyProvider>
        <TermDirectory entries={entries} />
      </NotifyProvider>
    </DefaultProvider>,
  );

describe("TermDirectory", () => {
  it("renders the correct column headers", () => {
    renderComponent(paginateData({ data: mockTermDirectoryEntries }));

    const columns = [
      "OMOP Concept ID",
      "Term Name",
      "Domain",
      "Count",
      "Associated Collections",
    ];
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
    expect(within(firstRow).getByText("2 Collections")).toBeInTheDocument();

    const secondRow = screen.getByRole("row", {
      name: /Myocardial infarction/i,
    });
    expect(within(secondRow).getByText("4329847")).toBeInTheDocument();
    expect(within(secondRow).getByText("1 Collection")).toBeInTheDocument();
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

  it("shows a copy OMOP ID action on each row", () => {
    renderComponent(paginateData({ data: mockTermDirectoryEntries }));

    expect(
      screen.getByRole("button", { name: "Copy OMOP Concept ID 201826" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copy OMOP Concept ID 4329847" }),
    ).toBeInTheDocument();
  });

  it("copies the raw OMOP id to the clipboard and confirms, so it can be pasted into rule search", async () => {
    const user = userEvent.setup();
    renderComponent(paginateData({ data: mockTermDirectoryEntries }));
    const writeText = jest.spyOn(navigator.clipboard, "writeText");

    await user.click(
      screen.getByRole("button", { name: "Copy OMOP Concept ID 201826" }),
    );

    expect(writeText).toHaveBeenCalledWith("201826");
    expect(await screen.findByText("Copied to clipboard")).toBeInTheDocument();
  });

  it("renders each term's domain", () => {
    renderComponent(paginateData({ data: mockTermDirectoryEntries }));

    const firstRow = screen.getByRole("row", {
      name: /Type 2 diabetes mellitus/i,
    });
    expect(within(firstRow).getByText("Condition")).toBeInTheDocument();

    const secondRow = screen.getByRole("row", {
      name: /Myocardial infarction/i,
    });
    expect(within(secondRow).getByText("Observation")).toBeInTheDocument();
  });

  it("takes the current page from the URL, so a filter resetting to page 1 is not overridden by the table", () => {
    const entries = {
      ...paginateData({ data: mockTermDirectoryEntries, perPage: 5 }),
      total: 100,
    };

    mockSearchParams = new URLSearchParams("page=3&per_page=5");
    const { rerender } = renderComponent(entries);

    expect(screen.getByText("11-15 of 100")).toBeInTheDocument();

    // a filter (eg the domain tabs) puts the user back on page 1
    mockSearchParams = new URLSearchParams("page=1&per_page=5");
    rerender(
      <DefaultProvider>
        <NotifyProvider>
          <TermDirectory entries={entries} />
        </NotifyProvider>
      </DefaultProvider>,
    );

    expect(screen.getByText("1-5 of 100")).toBeInTheDocument();
  });
});
