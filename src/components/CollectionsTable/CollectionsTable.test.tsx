import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CollectionsTable from "./CollectionsTable";
import getCustodianCollections from "@/actions/getCustodianCollections";
jest.mock("@/actions/getCustodianCollections");

describe("CollectionsTable", () => {
  it("renders the correct column headers", async () => {
    const collections = await getCustodianCollections("abc");

    render(<CollectionsTable collections={collections.data} />);

    const columns = ["Name", "Last Active", "Status"];
    for (const column of columns) {
      expect(
        screen.getByRole("columnheader", { name: column })
      ).toBeInTheDocument();
    }
  });

  it("displays data when collections exist", async () => {
    const collections = await getCustodianCollections("abc");

    render(<CollectionsTable collections={collections.data} />);

    expect(screen.getByText("Test Dataset #1")).toBeInTheDocument();
    expect(screen.getByText("Test Dataset #2")).toBeInTheDocument();
  });

  it("it can change selected rows", async () => {
    const collections = await getCustodianCollections("abc");

    const setRowSelection = jest.fn();
    const rowSelection = {};

    render(
      <CollectionsTable
        collections={collections.data}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    );

    const row = screen.getByRole("row", { name: /Test Dataset #1/i });

    const checkbox = within(row).getByRole("checkbox", {
      name: /toggle select row/i,
    });

    await userEvent.click(checkbox);

    const id = collections.data.data[0].id;
    expect(setRowSelection).toHaveBeenCalledTimes(1);
    const updater = (setRowSelection as jest.Mock).mock.calls[0][0];
    expect(updater).toEqual(expect.any(Function));

    const nextState = updater(rowSelection);
    expect(nextState).toEqual({ [id]: true });
  });
});
