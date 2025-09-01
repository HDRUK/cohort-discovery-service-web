import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import getCollections from "@/actions/getCollections";
import SelectDatasets from "./SelectDatasets";
jest.mock("@/actions/getCollections");

describe("SelectDatasets", () => {
  it("displays datasets", async () => {
    const collections = await getCollections();
    const initialSelection = collections.data.map((c) => c.pid);

    render(
      <SelectDatasets
        collections={collections.data}
        initialSelection={initialSelection}
      />
    );
    collections.data.forEach((collection) => {
      expect(screen.getByText(collection.name)).toBeInTheDocument();
    });

    const dropdownButton = screen.getByRole("button", { name: /open/i });
    await userEvent.click(dropdownButton);

    collections.data.forEach((collection) => {
      expect(screen.getAllByText(collection.name).length).toBeGreaterThan(0);
    });
  });

  it("shows no selected datasets when initialSelection is empty", async () => {
    const collections = await getCollections();

    render(
      <SelectDatasets collections={collections.data} initialSelection={[]} />
    );

    collections.data.forEach((collection) => {
      expect(screen.queryByText(collection.name)).not.toBeInTheDocument();
    });

    const dropdownButton = screen.getByRole("button", { name: /open/i });
    await userEvent.click(dropdownButton);

    collections.data.forEach((collection) => {
      expect(screen.getByText(collection.name)).toBeInTheDocument();
    });
  });
});
