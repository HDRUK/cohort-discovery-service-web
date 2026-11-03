import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CollectionFilter from "./CollectionFilter";
import { DefaultProvider } from "@/providers/DefaultProvider";
import { getMockCollection } from "@/actions/collection/__mocks__/getCollections";
import { useUserDataStore } from "@/hooks/userDataStore";
import { HdrukUiProvider } from "@hdruk/ui";
import { themeOptions } from "@/config/theme";
import { ThemeOptions } from "@mui/material";
import { createPendingNavigation } from "@/utils/pendingNavigation";

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
      <HdrukUiProvider themeOptions={themeOptions as ThemeOptions}>
        <CollectionFilter />
      </HdrukUiProvider>
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

  it("ticks the collection straight away, before the filtered terms have loaded", async () => {
    const navigation = createPendingNavigation();
    mockReplace.mockImplementationOnce(() => navigation.start());
    render(
      <DefaultProvider>
        <HdrukUiProvider themeOptions={themeOptions as ThemeOptions}>
          <CollectionFilter />
          <navigation.PendingRouter />
        </HdrukUiProvider>
      </DefaultProvider>,
    );

    await openPopover();
    await act(async () =>
      fireEvent.click(
        screen.getByRole("checkbox", { name: "Test Dataset Beta" }),
      ),
    );

    expect(
      screen.getByRole("checkbox", { name: "Test Dataset Beta" }),
    ).toBeChecked();
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
