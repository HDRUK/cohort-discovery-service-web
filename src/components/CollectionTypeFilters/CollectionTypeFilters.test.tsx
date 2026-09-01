import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  getMockCollection,
  getMockCollections,
} from "@/actions/collection/__mocks__/getCollections";
import CollectionTypeFilters from "./CollectionTypeFilters";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";

const getMixedCollections = () => [
  getMockCollection({ id: 1, name: "Plain Dataset" }),
  getMockCollection({ id: 2, name: "Death Dataset", death_enabled: true }),
  getMockCollection({
    id: 3,
    name: "Location Dataset",
    location_enabled: true,
  }),
];

describe("CollectionTypeFilters", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("selects synthetic datasets when the synthetic filter is checked", async () => {
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
            selectedDatasets: [],
            setSelectedDatasets,
          },
          user: {
            userCollections: mockCollections,
          },
        }}
      >
        <CollectionTypeFilters />
      </MockCohortDiscoveryServiceStore>,
    );

    await user.click(screen.getByRole("checkbox", { name: "synthetic" }));

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
            selectedDatasets: syntheticPids,
            setSelectedDatasets,
          },
          user: {
            userCollections: mockCollections,
          },
        }}
      >
        <CollectionTypeFilters />
      </MockCohortDiscoveryServiceStore>,
    );

    const synthetic = screen.getByRole("checkbox", { name: "synthetic" });
    expect(synthetic).toBeChecked();

    await user.click(synthetic);

    expect(setSelectedDatasets).toHaveBeenCalledWith([]);
  });

  it("hides the death and location filters when their feature flags are off", async () => {
    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          user: {
            userCollections: getMixedCollections(),
          },
        }}
      >
        <CollectionTypeFilters />
      </MockCohortDiscoveryServiceStore>,
    );

    expect(
      screen.getByRole("checkbox", { name: "synthetic" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "includes death data" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "includes location data" }),
    ).not.toBeInTheDocument();
  });

  it("selects collections with death data when the death filter is checked", async () => {
    const mockCollections = getMixedCollections();
    const deathPid = mockCollections[1].pid;

    const setSelectedDatasets = jest.fn();
    const user = userEvent.setup();

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            selectedDatasets: [],
            setSelectedDatasets,
          },
          user: {
            userCollections: mockCollections,
          },
          featureFlags: {
            flags: {
              "query-builder-use-death": true,
              "query-builder-use-location": true,
            },
          },
        }}
      >
        <CollectionTypeFilters />
      </MockCohortDiscoveryServiceStore>,
    );

    expect(
      screen.getByRole("checkbox", { name: "includes location data" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("checkbox", { name: "includes death data" }),
    );

    expect(setSelectedDatasets).toHaveBeenCalledWith([deathPid]);
  });

  it("shows an indeterminate filter when only some matching collections are selected", async () => {
    const mockCollections = getMockCollections(10, [1, 2, 3, 4]);
    const syntheticPids = mockCollections
      .filter((c) => c.is_synthetic)
      .map((c) => c.pid);

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            selectedDatasets: syntheticPids.slice(0, 2),
          },
          user: {
            userCollections: mockCollections,
          },
        }}
      >
        <CollectionTypeFilters />
      </MockCohortDiscoveryServiceStore>,
    );

    const synthetic = screen.getByRole("checkbox", { name: "synthetic" });
    expect(synthetic).not.toBeChecked();
    expect(synthetic).toHaveAttribute("data-indeterminate", "true");
  });

  it("disables a filter when no collection matches it", async () => {
    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          user: {
            userCollections: getMockCollections(5, false),
          },
        }}
      >
        <CollectionTypeFilters />
      </MockCohortDiscoveryServiceStore>,
    );

    expect(screen.getByRole("checkbox", { name: "synthetic" })).toBeDisabled();
  });

  // The E2E spec drives these filters via their test ids
  it("exposes a clickable test id for each filter", async () => {
    const setSelectedDatasets = jest.fn();
    const user = userEvent.setup();

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            selectedDatasets: [],
            setSelectedDatasets,
          },
          user: {
            userCollections: getMockCollections(10, [1, 2, 3, 4]),
          },
        }}
      >
        <CollectionTypeFilters />
      </MockCohortDiscoveryServiceStore>,
    );

    await user.click(screen.getByTestId("collection-type-synthetic"));

    expect(setSelectedDatasets).toHaveBeenCalledTimes(1);
  });
});
