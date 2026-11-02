import "@testing-library/jest-dom";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

type Entries = Paginated<TermDirectoryEntry>;

const withProviders = (entriesPromise: Promise<Entries>) => (
  <DefaultProvider>
    <NotifyProvider>
      <TermDirectory entriesPromise={entriesPromise} />
    </NotifyProvider>
  </DefaultProvider>
);

const deferredEntries = () => {
  let resolve: (entries: Entries) => void = () => {};
  const promise = new Promise<Entries>((res) => {
    resolve = res;
  });
  return { promise, resolve };
};

const settle = () => act(async () => {});

const renderComponent = async (entries: Entries) => {
  const view = render(withProviders(Promise.resolve(entries)));
  await settle();
  return view;
};

const skeletonCellCount = (container: HTMLElement) =>
  container.querySelectorAll("tbody .MuiSkeleton-root").length;

describe("TermDirectory", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSearchParams = new URLSearchParams();
  });

  it("renders the correct column headers", async () => {
    await renderComponent(paginateData({ data: mockTermDirectoryEntries }));

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

  it("renders a row per entry with its OMOP id, name and collection count", async () => {
    await renderComponent(paginateData({ data: mockTermDirectoryEntries }));

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

  it("renders the count, formatted with thousands separators for readability", async () => {
    await renderComponent(paginateData({ data: mockTermDirectoryEntries }));

    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("shows an empty message when no terms are returned", async () => {
    await renderComponent(paginateData({ data: [] }));

    expect(screen.getByText("No terms found.")).toBeInTheDocument();
  });

  it("shows skeleton rows instead of the empty message while the first terms load", () => {
    const { container } = render(withProviders(deferredEntries().promise));

    expect(screen.queryByText("No terms found.")).not.toBeInTheDocument();
    expect(skeletonCellCount(container)).toBeGreaterThan(0);
  });

  it("keeps the search box, sort and domain tabs usable while the first terms load", () => {
    render(withProviders(deferredEntries().promise));

    expect(
      screen.getByPlaceholderText("Search by term name or OMOP ID..."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Sort")).toBeInTheDocument();
    expect(
      screen.getByRole("tablist", { name: "Filter terms by domain" }),
    ).toBeInTheDocument();
  });

  it("shows the terms once the first load finishes", async () => {
    const first = deferredEntries();
    const { container } = render(withProviders(first.promise));

    await act(async () =>
      first.resolve(paginateData({ data: mockTermDirectoryEntries })),
    );

    expect(screen.getByText("Type 2 diabetes mellitus")).toBeInTheDocument();
    expect(skeletonCellCount(container)).toBe(0);
  });

  it("turns the current rows into skeletons while a new page of terms loads, then shows the new terms", async () => {
    const { container, rerender } = await renderComponent(
      paginateData({ data: mockTermDirectoryEntries }),
    );
    const next = deferredEntries();

    rerender(withProviders(next.promise));

    expect(
      screen.queryByText("Type 2 diabetes mellitus"),
    ).not.toBeInTheDocument();
    expect(skeletonCellCount(container)).toBeGreaterThan(0);

    await act(async () =>
      next.resolve(paginateData({ data: mockTermDirectoryEntries.slice(1) })),
    );

    expect(
      screen.queryByText("Type 2 diabetes mellitus"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Myocardial infarction")).toBeInTheDocument();
    expect(skeletonCellCount(container)).toBe(0);
  });

  it("keeps the search box mounted with its text while new terms load", async () => {
    const { rerender } = await renderComponent(
      paginateData({ data: mockTermDirectoryEntries }),
    );
    const searchBox = screen.getByPlaceholderText(
      "Search by term name or OMOP ID...",
    );
    await userEvent.type(searchBox, "asthma");

    rerender(withProviders(deferredEntries().promise));

    expect(
      screen.getByPlaceholderText("Search by term name or OMOP ID..."),
    ).toBe(searchBox);
    expect(searchBox).toHaveValue("asthma");
  });

  it("does not show the loading overlay spinner on top of the skeleton rows", () => {
    render(withProviders(deferredEntries().promise));

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("renders a search box so users can filter the directory", async () => {
    await renderComponent(paginateData({ data: mockTermDirectoryEntries }));

    expect(
      screen.getByPlaceholderText("Search by term name or OMOP ID..."),
    ).toBeInTheDocument();
  });

  it("shows a copy OMOP ID action on each row", async () => {
    await renderComponent(paginateData({ data: mockTermDirectoryEntries }));

    expect(
      screen.getByRole("button", { name: "Copy OMOP Concept ID 201826" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copy OMOP Concept ID 4329847" }),
    ).toBeInTheDocument();
  });

  it("copies the raw OMOP id to the clipboard and confirms, so it can be pasted into rule search", async () => {
    const user = userEvent.setup();
    await renderComponent(paginateData({ data: mockTermDirectoryEntries }));
    const writeText = jest.spyOn(navigator.clipboard, "writeText");

    await user.click(
      screen.getByRole("button", { name: "Copy OMOP Concept ID 201826" }),
    );

    expect(writeText).toHaveBeenCalledWith("201826");
    expect(await screen.findByText("Copied to clipboard")).toBeInTheDocument();
  });

  it("renders each term's domain", async () => {
    await renderComponent(paginateData({ data: mockTermDirectoryEntries }));

    const firstRow = screen.getByRole("row", {
      name: /Type 2 diabetes mellitus/i,
    });
    expect(within(firstRow).getByText("Condition")).toBeInTheDocument();

    const secondRow = screen.getByRole("row", {
      name: /Myocardial infarction/i,
    });
    expect(within(secondRow).getByText("Observation")).toBeInTheDocument();
  });

  it("takes the current page from the URL, so a filter resetting to page 1 is not overridden by the table", async () => {
    const entries = {
      ...paginateData({ data: mockTermDirectoryEntries, perPage: 5 }),
      total: 100,
    };

    const entriesPromise = Promise.resolve(entries);

    mockSearchParams = new URLSearchParams("page=3&per_page=5");
    const { rerender } = render(withProviders(entriesPromise));
    await settle();

    expect(screen.getByText("11-15 of 100")).toBeInTheDocument();

    // a filter (eg the domain tabs) puts the user back on page 1
    mockSearchParams = new URLSearchParams("page=1&per_page=5");
    rerender(withProviders(entriesPromise));

    expect(screen.getByText("1-5 of 100")).toBeInTheDocument();
  });

  it("renders a sort button with the correct fields", async () => {
    const user = userEvent.setup();

    await renderComponent(paginateData({ data: mockTermDirectoryEntries }));

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

    await renderComponent(paginateData({ data: mockTermDirectoryEntries }));

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

    await renderComponent(paginateData({ data: mockTermDirectoryEntries }));

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
