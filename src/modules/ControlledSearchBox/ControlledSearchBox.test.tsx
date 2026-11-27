import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ControlledSearchBox from "./ControlledSearchBox";
import { DefaultProvider } from "@/providers/DefaultProvider";

const mockSetSearchParams = jest.fn();

jest.mock("@/hooks/useSearchParams", () => ({
  __esModule: true,
  default: () => ({
    getSearchParam: () => "",
    setSearchParam: jest.fn(),
    setSearchParams: mockSetSearchParams,
  }),
}));

describe("ControlledSearchBox", () => {
  it("shows one search icon, leading, with an arrow to submit", () => {
    render(
      <DefaultProvider>
        <ControlledSearchBox placeholder="Search" />
      </DefaultProvider>,
    );

    expect(screen.getAllByTestId("SearchIcon")).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: "Submit search" }),
    ).toContainElement(screen.getByTestId("ArrowForwardIcon"));
  });

  it("goes back to the first page when a new search is submitted", async () => {
    render(
      <DefaultProvider>
        <ControlledSearchBox placeholder="Search" />
      </DefaultProvider>,
    );

    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "leeds" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() =>
      expect(mockSetSearchParams).toHaveBeenCalledWith({
        search_term: "leeds",
        page: null,
      }),
    );
  });
});
