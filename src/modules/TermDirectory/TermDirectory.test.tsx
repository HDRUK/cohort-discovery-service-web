import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TermDirectory from "./TermDirectory";
import { SearchParamsTransitionProvider } from "@/contexts/SearchParamsTransitionContext";
import { DefaultProvider } from "@/providers/DefaultProvider";
import { NotifyProvider } from "@/providers/NotifyProvider";
import { mockTermDirectoryEntries } from "@/actions/termDirectory/__mocks__/getTermDirectory";
import { paginateData } from "@/utils/mock";
import { createPendingNavigation } from "@/utils/pendingNavigation";
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

const navigation = createPendingNavigation();

const renderWithRouter = (entries: Paginated<TermDirectoryEntry>) => {
  mockReplace.mockImplementationOnce(() => navigation.start());
  return render(
    <DefaultProvider>
      <NotifyProvider>
        <SearchParamsTransitionProvider>
          <TermDirectory entries={entries} />
          <navigation.PendingRouter />
        </SearchParamsTransitionProvider>
      </NotifyProvider>
    </DefaultProvider>,
  );
};

const skeletonCellCount = (container: HTMLElement) =>
  container.querySelectorAll("tbody .MuiSkeleton-root").length;

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

  it("shows an empty message under the column headers when no terms are returned", () => {
    renderComponent(paginateData({ data: [] }));

    expect(screen.getByText("No terms found.")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Term Name/ }),
    ).toBeInTheDocument();
  });

  it("shows skeleton rows instead of the empty message while the terms load", () => {
    const { container } = render(
      <DefaultProvider>
        <NotifyProvider>
          <TermDirectory />
        </NotifyProvider>
      </DefaultProvider>,
    );

    expect(screen.queryByText("No terms found.")).not.toBeInTheDocument();
    expect(skeletonCellCount(container)).toBeGreaterThan(0);
  });

  it("marks the rows as busy while the terms load", () => {
    const { container } = render(
      <DefaultProvider>
        <NotifyProvider>
          <TermDirectory />
        </NotifyProvider>
      </DefaultProvider>,
    );

    expect(container.querySelector("tbody")).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("makes the search, sort and tabs non-interactive until the first terms arrive", () => {
    render(
      <DefaultProvider>
        <NotifyProvider>
          <TermDirectory />
        </NotifyProvider>
      </DefaultProvider>,
    );

    expect(
      screen
        .getByPlaceholderText("Search by term name or OMOP ID...")
        .closest("[inert]"),
    ).not.toBeNull();
  });

  it("keeps the search, sort and tabs interactive once the terms have loaded", () => {
    renderComponent(paginateData({ data: mockTermDirectoryEntries }));

    expect(
      screen
        .getByPlaceholderText("Search by term name or OMOP ID...")
        .closest("[inert]"),
    ).toBeNull();
    expect(screen.getByRole("table").querySelector("tbody")).toHaveAttribute(
      "aria-busy",
      "false",
    );
  });

  it("does not show the loading overlay spinner on top of the skeleton rows", () => {
    render(
      <DefaultProvider>
        <NotifyProvider>
          <TermDirectory />
        </NotifyProvider>
      </DefaultProvider>,
    );

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("shows skeleton rows while a search loads, then the rows once it finishes", async () => {
    const { container } = renderWithRouter(
      paginateData({ data: mockTermDirectoryEntries }),
    );
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
    expect(skeletonCellCount(container)).toBeGreaterThan(0);

    await act(async () => navigation.finish());

    expect(screen.getByText("Type 2 diabetes mellitus")).toBeInTheDocument();
    expect(skeletonCellCount(container)).toBe(0);
  });

  it("shows skeleton rows while a new sort order loads", async () => {
    const user = userEvent.setup();
    const { container } = renderWithRouter(
      paginateData({ data: mockTermDirectoryEntries }),
    );

    await user.click(screen.getByLabelText("Sort"));
    await act(async () =>
      fireEvent.click(
        screen.getByRole("menuitem", { name: "Sort by Count (High-Low)" }),
      ),
    );

    expect(skeletonCellCount(container)).toBeGreaterThan(0);
  });

  it("shows skeleton rows while the next page of terms loads", async () => {
    mockSearchParams = new URLSearchParams("page=1&per_page=5");
    const { container } = renderWithRouter({
      ...paginateData({ data: mockTermDirectoryEntries, perPage: 5 }),
      total: 100,
    });

    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: /next page/i })),
    );

    expect(mockReplace).toHaveBeenCalledWith("?page=2&per_page=5");
    expect(screen.getByText("6-10 of 100")).toBeInTheDocument();
    expect(skeletonCellCount(container)).toBeGreaterThan(0);
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
