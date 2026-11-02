import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TermDirectoryToolbar from "./TermDirectoryToolbar";
import { DefaultProvider } from "@/providers/DefaultProvider";

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  usePathname: () => "/term-directory",
  useRouter: () => ({ push: jest.fn(), replace: mockReplace }),
}));

const renderComponent = () =>
  render(
    <DefaultProvider>
      <TermDirectoryToolbar />
    </DefaultProvider>,
  );

describe("TermDirectoryToolbar", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSearchParams = new URLSearchParams();
  });

  it("renders the domain filter tabs", () => {
    renderComponent();

    expect(
      screen.getByRole("tablist", { name: "Filter terms by domain" }),
    ).toBeInTheDocument();
  });

  it("renders a search box so users can filter the directory", () => {
    renderComponent();

    expect(
      screen.getByPlaceholderText("Search by term name or OMOP ID..."),
    ).toBeInTheDocument();
  });

  it("renders a sort button with the correct fields", async () => {
    const user = userEvent.setup();

    renderComponent();

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

    renderComponent();

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

    renderComponent();

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
