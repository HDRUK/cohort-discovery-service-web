import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense, use, useEffect, useState } from "react";
import TermDirectory from "./TermDirectory";
import { DefaultProvider } from "@/providers/DefaultProvider";
import { NotifyProvider } from "@/providers/NotifyProvider";
import { mockTermDirectoryEntries } from "@/actions/termDirectory/__mocks__/getTermDirectory";
import { paginateData } from "@/utils/mock";
import { TermDirectoryEntry, Paginated } from "@/types/api";

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams("page=1&per_page=5");

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  usePathname: () => "/term-directory",
  useRouter: () => ({ push: jest.fn(), replace: mockReplace }),
}));

const renderComponent = (entries: Paginated<TermDirectoryEntry>) =>
  render(
    <DefaultProvider>
      <NotifyProvider>
        <TermDirectory entries={entries} />
      </NotifyProvider>
    </DefaultProvider>,
  );

const UNRESOLVED_NAVIGATION = new Promise<never>(() => {});
let startNavigation: () => void = () => {};

const PendingNavigation = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  useEffect(() => {
    startNavigation = () => setIsNavigating(true);
  }, []);
  if (isNavigating) use(UNRESOLVED_NAVIGATION);
  return null;
};

const renderWithPendingNavigation = () =>
  render(
    <DefaultProvider>
      <NotifyProvider>
        <TermDirectory
          entries={paginateData({ data: mockTermDirectoryEntries })}
        />
        <Suspense fallback={null}>
          <PendingNavigation />
        </Suspense>
      </NotifyProvider>
    </DefaultProvider>,
  );

describe("TermDirectory", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSearchParams = new URLSearchParams();
  });

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

  it("shows skeleton rows instead of the empty message while entries load", () => {
    mockSearchParams = new URLSearchParams("page=1&per_page=5");
    const { container } = render(
      <DefaultProvider>
        <NotifyProvider>
          <TermDirectory />
        </NotifyProvider>
      </DefaultProvider>,
    );

    expect(screen.queryByText("No terms found.")).not.toBeInTheDocument();
    expect(
      container.querySelectorAll("tbody .MuiSkeleton-root").length,
    ).toBeGreaterThan(0);
  });

  it("keeps the search box, sort and domain tabs usable while entries load", () => {
    render(
      <DefaultProvider>
        <NotifyProvider>
          <TermDirectory />
        </NotifyProvider>
      </DefaultProvider>,
    );

    expect(
      screen.getByPlaceholderText("Search by term name or OMOP ID..."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Sort")).toBeInTheDocument();
    expect(
      screen.getByRole("tablist", { name: "Filter terms by domain" }),
    ).toBeInTheDocument();
  });

  it("moves to the clicked domain tab and shows skeleton rows while the new terms load", async () => {
    mockReplace.mockImplementationOnce(() => startNavigation());
    const { container } = renderWithPendingNavigation();

    await act(async () =>
      fireEvent.click(screen.getByRole("tab", { name: "Observation" })),
    );

    expect(screen.getByRole("tab", { name: "Observation" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.queryByText("Type 2 diabetes mellitus"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelectorAll("tbody .MuiSkeleton-root").length,
    ).toBeGreaterThan(0);
  });

  it("keeps the typed search and shows skeleton rows while the search results load", async () => {
    mockReplace.mockImplementationOnce(() => startNavigation());
    const { container } = renderWithPendingNavigation();
    const searchBox = screen.getByPlaceholderText(
      "Search by term name or OMOP ID...",
    );

    await act(async () => {
      fireEvent.change(searchBox, { target: { value: "asthma" } });
      fireEvent.keyDown(searchBox, { key: "Enter" });
    });

    expect(mockReplace).toHaveBeenCalledWith("?search_term=asthma");
    expect(searchBox).toHaveValue("asthma");
    expect(
      screen.queryByText("Type 2 diabetes mellitus"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelectorAll("tbody .MuiSkeleton-root").length,
    ).toBeGreaterThan(0);
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

  it("renders a sort button with the correct fields", async () => {
    const user = userEvent.setup();

    renderComponent(paginateData({ data: mockTermDirectoryEntries }));

    expect(screen.getByLabelText("Sort")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Sort"));

    // The sort options menu and its items
    expect(await screen.getByRole("tooltip")).toBeInTheDocument();

    expect(
      await screen.getByRole("menuitem", { name: "Clear sorting" }),
    ).toBeInTheDocument();
    expect(
      await screen.getByRole("menuitem", { name: "Sort by Term Name (A-Z)" }),
    ).toBeInTheDocument();
    expect(
      await screen.getByRole("menuitem", { name: "Sort by Term Name (Z-A)" }),
    ).toBeInTheDocument();
    expect(
      await screen.getByRole("menuitem", { name: "Sort by Count (Low-High)" }),
    ).toBeInTheDocument();
    expect(
      await screen.getByRole("menuitem", { name: "Sort by Count (High-Low)" }),
    ).toBeInTheDocument();
  });

  it("updates the URL search params when sort options are clicked", async () => {
    const user = userEvent.setup();

    mockSearchParams = new URLSearchParams("page=1&per_page=5");

    renderComponent(paginateData({ data: mockTermDirectoryEntries }));

    await user.click(screen.getByLabelText("Sort"));
    await user.click(
      screen.getByRole("menuitem", { name: "Sort by Term Name (A-Z)" }),
    );

    expect(mockReplace).toHaveBeenCalledWith(
      "?page=1&per_page=5&sort=concept_name%3Aasc",
    );

    mockReplace.mockClear();

    await user.click(screen.getByLabelText("Sort"));
    await user.click(
      screen.getByRole("menuitem", { name: "Sort by Count (High-Low)" }),
    );

    expect(mockReplace).toHaveBeenCalledWith(
      "?page=1&per_page=5&sort=count%3Adesc",
    );
  });

  it("removes the sort parameter when clear sorting is clicked", async () => {
    const user = userEvent.setup();

    mockSearchParams = new URLSearchParams("page=1&per_page=5");

    renderComponent(paginateData({ data: mockTermDirectoryEntries }));

    await user.click(screen.getByLabelText("Sort"));
    await user.click(
      screen.getByRole("menuitem", { name: "Sort by Term Name (A-Z)" }),
    );

    expect(mockReplace).toHaveBeenCalledWith(
      "?page=1&per_page=5&sort=concept_name%3Aasc",
    );

    mockReplace.mockClear();
    mockSearchParams = new URLSearchParams();

    await user.click(screen.getByLabelText("Sort"));
    await user.click(screen.getByRole("menuitem", { name: "Clear sorting" }));

    expect(mockReplace).toHaveBeenCalledWith("/term-directory");
  });
});
