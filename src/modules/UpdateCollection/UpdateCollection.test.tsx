import { render, screen, within } from "@testing-library/react";
import UpdateCollection from ".";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { getMockCollection } from "@/actions/collection/__mocks__/getCollections";
import { ThreePaneProvider } from "@/providers/ThreePaneProvider";
import getCollectionHost from "@/actions/collectionHost/__mocks__/getCollectionHost";
import getCustodian from "@/actions/custodian/__mocks__/getCustodian";
import { CloseGuardProvider } from "@/providers/CloseGuardProvider";
import userEvent from "@testing-library/user-event";
import SwimLane from "@/components/SwimLane";
import saveCollection from "@/actions/collection/saveCollection";
import { CollectionWithHosts } from "@/types/api";

jest.mock("@/actions/collection/saveCollection", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    ok: true,
    workgroupsAdded: 0,
    workgroupsRemoved: 0,
    statusChanged: false,
  }),
}));

const saveCollectionMock = saveCollection as jest.MockedFunction<
  typeof saveCollection
>;

describe("UpdateCollection", () => {
  const renderComponent = (
    collectionOverride?: Partial<CollectionWithHosts>,
  ) => {
    const host1 = getCollectionHost();
    const host2 = getCollectionHost();
    const custodian = getCustodian();

    const collection = getMockCollection({
      id: 1,
      name: "Mock Collection #1",
      description: "This is the description of the mock collection #1",
      url: "https://example.com/dataset",
      host: host1,
      config: {
        id: 1,
        enabled: true,
        frequency_mode: 1,
        run_time_frequency: 1,
        run_time_hour: 1,
        run_time_minute: 1,
      },
      ...collectionOverride,
    });

    const workgroups = [
      { id: 1, name: "DEFAULT" },
      { id: 2, name: "WG_ONE" },
    ];

    const collectionHosts = [host1, host2];
    return render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          custodian: {
            current: {
              custodian,
              collectionHosts,
            },
          },
          admin: {
            collectionHosts,
          },
          user: {
            workgroups,
          },
        }}
      >
        <ThreePaneProvider>
          <SwimLane> Another Area </SwimLane>
          <SwimLane enableBlocker>
            <CloseGuardProvider>
              <UpdateCollection collection={collection} />
            </CloseGuardProvider>
          </SwimLane>
        </ThreePaneProvider>
      </MockCohortDiscoveryServiceStore>,
    );
  };

  it("renders the form with existing collection values", () => {
    renderComponent();

    expect(screen.getByDisplayValue("Mock Collection #1")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("https://example.com/dataset"),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(
        "This is the description of the mock collection #1",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Collection Configuration")).toBeInTheDocument();
    expect(screen.getByText("Collection Credentials")).toBeInTheDocument();
    expect(screen.getByText("Collection Info")).toBeInTheDocument();

    expect(screen.getByText("Configuration Frequency")).toBeInTheDocument();

    expect(screen.getByText("Weekly")).toBeInTheDocument(); // frequency_mode:1
    expect(screen.getByText("Tuesday")).toBeInTheDocument(); //run_time_frequency:1
  });

  it("is editable when it opens to the right", async () => {
    const user = userEvent.setup();
    renderComponent();
    const nameInput = screen.getByDisplayValue("Mock Collection #1");
    expect(nameInput).toBeDisabled();

    await user.click(screen.getByTestId("edit-panel-toggle"));
    expect(nameInput).not.toBeDisabled();
  });

  it("can save changes when click the lock button", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByTestId("edit-panel-toggle"));

    const nameInput = screen.getByDisplayValue("Mock Collection #1");
    await user.clear(nameInput);
    await user.paste("Updated Collection Name");

    await user.click(screen.getByTestId("save-panel-toggle"));

    expect(saveCollectionMock).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        collection: expect.objectContaining({
          name: "Updated Collection Name",
        }),
        config: expect.objectContaining({
          frequency_mode: 1,
          run_time_frequency: 1,
          run_time_hour: 1,
          run_time_minute: 1,
        }),
      }),
    );
  });

  it("can change frequency from Weekly to Monthly", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId("edit-panel-toggle"));
    await user.click(screen.getByLabelText("Monthly"));
    expect(screen.getByLabelText("Monthly")).toBeChecked();

    await user.click(screen.getByTestId("save-panel-toggle"));
    expect(saveCollectionMock).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        collection: expect.any(Object),
        config: expect.objectContaining({
          frequency_mode: 2,
          run_time_frequency: 1,
          run_time_hour: 1,
          run_time_minute: 1,
        }),
      }),
    );
  });

  it("can change frequency from Weekly to Biannually", async () => {
    const user = userEvent.setup();
    renderComponent({
      config: {
        id: 1,
        enabled: true,
        frequency_mode: 1,
        run_time_frequency: 6,
        run_time_hour: 1,
        run_time_minute: 1,
      },
    });

    await user.click(screen.getByTestId("edit-panel-toggle"));
    await user.click(screen.getByLabelText("Biannually"));
    expect(screen.getByLabelText("Biannually")).toBeChecked();

    await user.click(screen.getByTestId("save-panel-toggle"));
    expect(saveCollectionMock).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        collection: expect.any(Object),
        config: expect.objectContaining({
          frequency_mode: 4,
          run_time_frequency: 0, // gets reset as this mode has no value of 6
          run_time_hour: 1,
          run_time_minute: 1,
        }),
      }),
    );
  });

  it("lists a run time reset by a frequency change in the unsaved changes summary", async () => {
    const user = userEvent.setup();
    renderComponent({
      config: {
        id: 1,
        enabled: true,
        frequency_mode: 1,
        run_time_frequency: 6,
        run_time_hour: 1,
        run_time_minute: 1,
      },
    });

    await user.click(screen.getByTestId("edit-panel-toggle"));
    await user.click(screen.getByLabelText("Biannually"));
    await user.click(
      document.querySelector(".MuiBackdrop-root") as HTMLElement,
    );

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Run time Frequency")).toBeInTheDocument();
    expect(within(dialog).getByText("Sunday")).toBeInTheDocument();
    expect(within(dialog).getByText("H1")).toBeInTheDocument();
  });

  it("resets a saved run time that the saved frequency does not offer", () => {
    renderComponent({
      config: {
        id: 1,
        enabled: true,
        frequency_mode: 4,
        run_time_frequency: 6,
        run_time_hour: 1,
        run_time_minute: 1,
      },
    });

    expect(screen.getByText("Biannually")).toBeInTheDocument();
    expect(screen.getByText("H1")).toBeInTheDocument();
  });

  describe("host credentials", () => {
    const fetchMock = jest.fn();

    beforeEach(() => {
      fetchMock.mockReset();
      global.fetch = fetchMock;
    });

    it("shows the credentials fetched for the collection's host", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 11,
          client_id: "client-id-11",
          client_secret: "client-secret-11",
        }),
      });

      renderComponent({ host: getCollectionHost({ id: 11 }) });

      expect(
        await screen.findByDisplayValue("client-id-11"),
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue("client-secret-11")).toBeInTheDocument();
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/collection-hosts/11",
        expect.objectContaining({ cache: "no-store" }),
      );
    });

    it("explains when the credentials can't be loaded", async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 403 });

      renderComponent({ host: getCollectionHost({ id: 12 }) });

      expect(
        await screen.findByText(/couldn.t load this host.s credentials/i),
      ).toBeInTheDocument();
    });

    it("explains when the collection has no host", () => {
      renderComponent({ host: null });

      expect(screen.getByText(/has no host yet/i)).toBeInTheDocument();
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
