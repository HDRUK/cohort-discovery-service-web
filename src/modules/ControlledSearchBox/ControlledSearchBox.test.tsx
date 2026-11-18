import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ControlledSearchBox from "./ControlledSearchBox";
import { DefaultProvider } from "@/providers/DefaultProvider";

jest.mock("@/hooks/useSearchParams", () => ({
  __esModule: true,
  default: () => ({
    getSearchParam: () => "",
    setSearchParam: jest.fn(),
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
});
