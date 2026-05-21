import "@testing-library/jest-dom";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import getCollections from "@/actions/collection/getCollections";
import { getMockCollections } from "@/actions/collection/__mocks__/getCollections";
import SelectDatasets from "./SelectDatasets";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";

jest.mock("@/actions/collection/getCollections");

const setSelectedDatasets = jest.fn();
const setPreviouslySelectedDatasets = jest.fn();
const setOpenSelectDatasetsPanel = jest.fn();

describe("SelectDatasets", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays datasets", async () => {
    const collections = await getCollections();

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
          },
          user: {
            userCollections: collections.data,
          },
        }}
      >
        <SelectDatasets />
      </MockCohortDiscoveryServiceStore>,
    );

    collections.data.forEach((collection) => {
      expect(screen.getByText(collection.name)).toBeInTheDocument();
    });
  });

  it("can select datasets on click", async () => {
    const collections = await getCollections();
    const user = userEvent.setup();

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
            selectedDatasets: [],
            setSelectedDatasets,
          },
          user: {
            userCollections: collections.data,
          },
        }}
      >
        <SelectDatasets />
      </MockCohortDiscoveryServiceStore>,
    );

    const { pid, name } = collections.data[0];
    const row = screen.getByText(name).closest("div")!;
    const check = within(row).getByRole("checkbox");

    expect(check).not.toBeChecked();

    await user.click(check);
    expect(setSelectedDatasets).toHaveBeenLastCalledWith([pid]);
  });

  it("shows selected dataset count", async () => {
    const collections = await getCollections();
    const selected = collections.data.slice(0, 2).map((c) => c.pid);

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
            selectedDatasets: selected,
          },
          user: {
            userCollections: collections.data,
          },
        }}
      >
        <SelectDatasets />
      </MockCohortDiscoveryServiceStore>,
    );

    const matches = screen.queryAllByText(
      `${selected.length}/${collections.data.length} Collections Selected`,
    );

    expect(matches).not.toHaveLength(0);
  });

  it("selected synthetic datasets when toggle is clicked", async () => {
    const mockCollections = getMockCollections(10, [1, 2, 3, 4]);
    const syntheticPids = mockCollections
      .filter((c) => c.is_synthetic)
      .map((c) => c.pid);

    const setSelectedDatasets = jest.fn();
    const user = userEvent.setup();

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
            selectedDatasets: [],
            setSelectedDatasets,
          },
          user: {
            userCollections: mockCollections,
          },
        }}
      >
        <SelectDatasets />
      </MockCohortDiscoveryServiceStore>,
    );

    const toggle = screen.getByTestId("toggle-action-on");
    await user.click(toggle);

    expect(setSelectedDatasets).toHaveBeenCalledWith(
      expect.arrayContaining(syntheticPids),
    );
    expect(setSelectedDatasets).toHaveBeenCalledTimes(1);
    expect(setSelectedDatasets.mock.calls[0][0]).toHaveLength(
      syntheticPids.length,
    );
  });

  it("removes synthetic datasets when all synthetic are already selected", async () => {
    const mockCollections = getMockCollections(10, [1, 2, 3, 4]);
    const syntheticPids = mockCollections
      .filter((c) => c.is_synthetic)
      .map((c) => c.pid);

    const setSelectedDatasets = jest.fn();

    const user = userEvent.setup();

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
            selectedDatasets: syntheticPids,
            setSelectedDatasets,
            hasSelectedSyntheticDatasets: syntheticPids.length > 0,
          },
          user: {
            userCollections: mockCollections,
          },
        }}
      >
        <SelectDatasets />
      </MockCohortDiscoveryServiceStore>,
    );

    expect(screen.getByText("Including")).toBeInTheDocument();
    expect(screen.getByText("Synthetic Data Collections")).toBeInTheDocument();

    const toggle = screen.getByTestId("toggle-action-on");
    await user.click(toggle);

    expect(setSelectedDatasets).toHaveBeenCalledWith([]);
  });

  it("shows excluding synthetic title when includeSynthetic is false", async () => {
    const collections = await getCollections();

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
          },
          user: {
            userCollections: collections.data,
          },
        }}
      >
        <SelectDatasets />
      </MockCohortDiscoveryServiceStore>,
    );

    expect(screen.getByText("Excluding")).toBeInTheDocument();
    expect(screen.getByText("Synthetic Data Collections")).toBeInTheDocument();
  });

  it("restores previous selection and closes on cancel", async () => {
    const collections = await getCollections();
    const user = userEvent.setup();
    const previous = collections.data.slice(0, 1).map((c) => c.pid);

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
            selectedDatasets: collections.data.slice(0, 2).map((c) => c.pid),
            previouslySelectedDatasets: previous,
            setSelectedDatasets,
            setOpenSelectDatasetsPanel,
          },
          user: {
            userCollections: collections.data,
          },
        }}
      >
        <SelectDatasets />
      </MockCohortDiscoveryServiceStore>,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(setSelectedDatasets).toHaveBeenLastCalledWith(previous);
    expect(setOpenSelectDatasetsPanel).toHaveBeenLastCalledWith(false);
  });

  it("saves current selection and closes on save", async () => {
    const collections = await getCollections();
    const user = userEvent.setup();
    const selected = collections.data.slice(0, 2).map((c) => c.pid);

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
            selectedDatasets: selected,
            setPreviouslySelectedDatasets,
            setOpenSelectDatasetsPanel,
          },
          user: {
            userCollections: collections.data,
          },
        }}
      >
        <SelectDatasets />
      </MockCohortDiscoveryServiceStore>,
    );

    await user.click(screen.getByRole("button", { name: "Save and Close" }));

    expect(setPreviouslySelectedDatasets).toHaveBeenLastCalledWith(selected);
    expect(setOpenSelectDatasetsPanel).toHaveBeenLastCalledWith(false);
  });

  it("disables save and close when no datasets are selected", async () => {
    const collections = await getCollections();

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
            selectedDatasets: [],
          },
          user: {
            userCollections: collections.data,
          },
        }}
      >
        <SelectDatasets />
      </MockCohortDiscoveryServiceStore>,
    );

    expect(
      screen.getByRole("button", { name: "Save and Close" }),
    ).toBeDisabled();
  });

  it("enables save and close when datasets are selected", async () => {
    const collections = await getCollections();

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
            selectedDatasets: [collections.data[0].pid],
          },
          user: {
            userCollections: collections.data,
          },
        }}
      >
        <SelectDatasets />
      </MockCohortDiscoveryServiceStore>,
    );

    expect(
      screen.getByRole("button", { name: "Save and Close" }),
    ).toBeEnabled();
  });

  it("filters datasets by search term", async () => {
    const collections = await getCollections();
    const user = userEvent.setup();

    const visibleCollection = collections.data[0];
    const hiddenCollection = collections.data.find(
      (c) => c.pid !== visibleCollection.pid,
    )!;

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
          },
          user: {
            userCollections: collections.data,
          },
        }}
      >
        <SelectDatasets />
      </MockCohortDiscoveryServiceStore>,
    );

    expect(screen.getByText(visibleCollection.name)).toBeInTheDocument();
    expect(screen.getByText(hiddenCollection.name)).toBeInTheDocument();

    await user.type(
      screen.getByPlaceholderText("I'm looking for..."),
      visibleCollection.name,
    );

    await waitFor(() => {
      expect(screen.getByText(visibleCollection.name)).toBeInTheDocument();
      expect(screen.queryByText(hiddenCollection.name)).not.toBeInTheDocument();
    });
  });
});
