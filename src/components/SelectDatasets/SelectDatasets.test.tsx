import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import getCollections from "@/actions/collection/getCollections";
import SelectDatasets from "./SelectDatasets";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";

jest.mock("@/actions/collection/getCollections");

const setSelectedDatasets = jest.fn();
const toggleIncludeSynthetic = jest.fn();
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

  it("calls toggleIncludeSynthetic when synthetic toggle is clicked", async () => {
    const collections = await getCollections();
    const user = userEvent.setup();

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
            includeSynthetic: false,
            toggleIncludeSynthetic,
          },
          user: {
            userCollections: collections.data,
          },
        }}
      >
        <SelectDatasets />
      </MockCohortDiscoveryServiceStore>,
    );

    const toggle = screen.getByTestId("toggle-action-on");
    await user.click(toggle);

    expect(toggleIncludeSynthetic).toHaveBeenCalledTimes(1);
    expect(toggleIncludeSynthetic).toHaveBeenCalledWith(collections.data);
  });

  it("shows including synthetic title when includeSynthetic is true", async () => {
    const collections = await getCollections();

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
            includeSynthetic: true,
          },
          user: {
            userCollections: collections.data,
          },
        }}
      >
        <SelectDatasets />
      </MockCohortDiscoveryServiceStore>,
    );

    expect(screen.getByText("Including")).toBeInTheDocument();
    expect(screen.getByText("Synthetic Data Collections")).toBeInTheDocument();
  });

  it("shows excluding synthetic title when includeSynthetic is false", async () => {
    const collections = await getCollections();

    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
            includeSynthetic: false,
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
});
