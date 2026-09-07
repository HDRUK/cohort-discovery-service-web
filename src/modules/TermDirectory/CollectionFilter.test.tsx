import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CollectionFilter from "./CollectionFilter";
import { DefaultProvider } from "@/providers/DefaultProvider";
import { getMockCollection } from "@/actions/collection/__mocks__/getCollections";
import { useUserDataStore } from "@/hooks/userDataStore";

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

const collections = [
  getMockCollection({ id: 1, pid: "col-pid-1", name: "Test Dataset Alpha" }),
  getMockCollection({ id: 2, pid: "col-pid-2", name: "Test Dataset Beta" }),
];

const renderComponent = () =>
  render(
    <DefaultProvider>
      <CollectionFilter />
    </DefaultProvider>,
  );

const openPopover = async () =>
  userEvent.click(screen.getByRole("button", { name: "Filter by collection" }));

describe("CollectionFilter", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSearchParams = new URLSearchParams();
    useUserDataStore.setState({ userCollections: collections });
  });

  it("writes a checked collection to the URL and restarts at page 1", async () => {
    renderComponent();

    await openPopover();
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Test Dataset Beta" }),
    );

    expect(mockReplace).toHaveBeenCalledWith("?collections=col-pid-2&page=1");
  });

  it("removes the param when the last collection is unchecked", async () => {
    mockSearchParams = new URLSearchParams("collections=col-pid-1");
    renderComponent();

    await openPopover();
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Test Dataset Alpha" }),
    );

    expect(mockReplace).toHaveBeenCalledWith("?page=1");
  });
});
