import { render, screen } from "@testing-library/react";
import UpdateCollection from ".";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { getMockCollection } from "@/actions/collection/__mocks__/getCollections";
import { ThreePaneProvider } from "@/providers/ThreePaneProvider";
import getCollectionHost from "@/actions/collectionHost/__mocks__/getCollectionHost";
import getCustodian from "@/actions/custodian/__mocks__/getCustodian";
import { CloseGuardProvider } from "@/providers/CloseGuardProvider";
import userEvent from "@testing-library/user-event";
import SwimLane from "@/components/SwimLane";
import { revalidateCollections } from "@/actions/revalidate";
import { CollectionWithHosts } from "@/types/api";
jest.mock("@/actions/revalidate", () => ({
  revalidateCollections: jest.fn(),
}));

describe("UpdateCollection", () => {
  const updateCollectionMock = jest.fn();
  const updateCollectionStatusMock = jest.fn();

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
      host: [host1],
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
            updateCollection: updateCollectionMock,
          },
          admin: {
            updateCollectionStatus: updateCollectionStatusMock,
            collectionHosts,
          },
          user: {
            workgroups,
          },
        }}
      >
        <ThreePaneProvider>
          <SwimLane> Another Area </SwimLane>
          <SwimLane>
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
    await user.type(nameInput, "Updated Collection Name");

    await user.click(screen.getByTestId("save-panel-toggle"));

    expect(updateCollectionMock).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        name: "Updated Collection Name",
      }),
      expect.objectContaining({
        frequency_mode: 1,
        run_time_frequency: 1,
        run_time_hour: 1,
        run_time_minute: 1,
      }),
      false,
    );

    expect(revalidateCollections).toHaveBeenCalled();
  });

  it("can change frequency from Weekly to Monthly", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId("edit-panel-toggle"));
    await user.click(screen.getByLabelText("Monthly"));
    expect(screen.getByLabelText("Monthly")).toBeChecked();

    await user.click(screen.getByTestId("save-panel-toggle"));
    expect(updateCollectionMock).toHaveBeenCalledWith(
      1,
      expect.any(Object),
      expect.objectContaining({
        frequency_mode: 2,
        run_time_frequency: 1,
        run_time_hour: 1,
        run_time_minute: 1,
      }),
      false,
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
    expect(updateCollectionMock).toHaveBeenCalledWith(
      1,
      expect.any(Object),
      expect.objectContaining({
        frequency_mode: 4,
        run_time_frequency: 0, // gets reset as this mode has no value of 6
        run_time_hour: 1,
        run_time_minute: 1,
      }),
      false,
    );
  });
});
