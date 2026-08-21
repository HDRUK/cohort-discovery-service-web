import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DomainFilterTabs from "./DomainFilterTabs";
import { DOMAIN_TABS } from "@/config/domainFilters";
import { getDomainPhrase } from "@/utils/omop";
import { capitaliseFirstLetter } from "@/utils/string";

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

    for (const domain of DOMAIN_TABS) {
      const label = capitaliseFirstLetter(getDomainPhrase(domain).noun);
      expect(screen.getByRole("tab", { name: label })).toBeInTheDocument();
    }
  });

  it("writes the domain to the URL", async () => {
    render(<DomainFilterTabs />);

    await userEvent.click(screen.getByRole("tab", { name: "Observation" }));

    expect(mockReplace).toHaveBeenCalledWith("?domain=observation&page=1");
  });

  it("marks the tab from the URL as selected", () => {
    mockSearchParams = new URLSearchParams("domain=measurement");
    render(<DomainFilterTabs />);

    expect(screen.getByRole("tab", { name: "Measurement" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("does nothing when clicking the already-selected domain tab", async () => {
    mockSearchParams = new URLSearchParams("domain=observation");
    render(<DomainFilterTabs />);

    await userEvent.click(screen.getByRole("tab", { name: "Observation" }));

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("clears the domain filter when clicking All while a domain is selected", async () => {
    mockSearchParams = new URLSearchParams("domain=observation");
    render(<DomainFilterTabs />);

    await userEvent.click(screen.getByRole("tab", { name: "All" }));

    expect(mockReplace).toHaveBeenCalledWith("?page=1");
  });
});
