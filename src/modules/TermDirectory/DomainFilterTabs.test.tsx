import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DomainFilterTabs from "./DomainFilterTabs";
import { DOMAIN_TABS } from "@/config/domainFilters";

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  usePathname: () => "/term-directory",
  useRouter: () => ({
    push: jest.fn(),
    replace: mockReplace,
  }),
}));

describe("DomainFilterTabs", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSearchParams = new URLSearchParams();
  });

  it("renders a tab for every domain filter", () => {
    render(<DomainFilterTabs />);

    for (const label of DOMAIN_TABS) {
      expect(screen.getByRole("tab", { name: label })).toBeInTheDocument();
    }
  });

  it("writes the domain to the URL", async () => {
    render(<DomainFilterTabs />);

    await userEvent.click(screen.getByRole("tab", { name: "Observation" }));

    expect(mockReplace).toHaveBeenCalledWith("?domain=Observation&page=1");
  });

  it("marks the tab from the URL as selected", () => {
    mockSearchParams = new URLSearchParams("domain=Measurement");
    render(<DomainFilterTabs />);

    expect(screen.getByRole("tab", { name: "Measurement" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
