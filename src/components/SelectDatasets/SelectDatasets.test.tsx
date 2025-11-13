import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import getCollections from "@/actions/getCollections";
import SelectDatasets from "./SelectDatasets";
import MockDaphneStore from "@/store/MockDaphneStore";
jest.mock("@/actions/getCollections");

const setSelectedDatasets = jest.fn();

describe("SelectDatasets", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays datasets", async () => {
    const collections = await getCollections();
    const initialSelection = collections.data.map((c) => c.pid);

    render(
      <MockDaphneStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
          },
        }}
      >
        <SelectDatasets
          collections={collections.data}
          initialSelection={initialSelection}
        />
      </MockDaphneStore>
    );

    collections.data.forEach((collection) => {
      expect(screen.getByText(collection.name)).toBeInTheDocument();
    });
  });

  it("can select datasets on click", async () => {
    const collections = await getCollections();
    const initialSelection = collections.data.map((c) => c.pid);
    const user = userEvent.setup();
    render(
      <MockDaphneStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
            setSelectedDatasets,
          },
        }}
      >
        <SelectDatasets
          collections={collections.data}
          initialSelection={initialSelection}
        />
      </MockDaphneStore>
    );
    expect(setSelectedDatasets).toHaveBeenLastCalledWith(initialSelection);

    const { pid, name } = collections.data[0];
    const row = screen.getByText(name).closest("div")!;
    const radio = within(row).getByRole("radio");

    expect(radio).not.toBeChecked();

    await user.click(radio);
    expect(setSelectedDatasets).toHaveBeenLastCalledWith([pid]);
  });
});
