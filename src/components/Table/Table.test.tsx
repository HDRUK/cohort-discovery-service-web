import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { useTable } from "@/hooks/useTable";
import Table from "./Table";
import { MRT_ColumnDef } from "material-react-table";
jest.mock("@/actions/getCustodianCollections");

const handleDeleteRows = jest.fn();

interface Data {
  id: number;
  name: string;
  description: string;
}

const TableWithState = () => {
  const [rowSelection, setRowSelection] = useState({});

  const columns: MRT_ColumnDef<Data>[] = [
    {
      id: "name",
      header: "Name",
      accessorFn: (row) => row.name,
    },
    {
      id: "description",
      header: "Description",
      accessorFn: (row) => row.description,
    },
  ];

  const data = [
    { id: 1, name: "name1", description: "descrition for name1" },
    { id: 2, name: "name2", description: "descrition for name2" },
  ];

  const table = useTable({
    columns,
    data,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    getRowId: (row) => String(row.id),
  });

  return <Table table={table} handleDeleteRows={handleDeleteRows} />;
};

describe("Table", () => {
  it("renders the correct column headers", async () => {
    render(<TableWithState />);

    const columns = ["Name", "Description"];
    for (const column of columns) {
      expect(
        screen.getByRole("columnheader", { name: column })
      ).toBeInTheDocument();
    }
  });

  it("it can delete selected rows", async () => {
    render(<TableWithState />);

    let row = screen.getByRole("row", { name: /name1/i });

    let checkbox = within(row).getByRole("checkbox", {
      name: /toggle select row/i,
    });

    await userEvent.click(checkbox);

    let icon = screen.getByTestId("DeleteIcon");
    let deleteButton = icon.closest("button") as HTMLButtonElement;
    await userEvent.click(deleteButton);

    expect(handleDeleteRows).toHaveBeenLastCalledWith(["1"]);

    row = screen.getByRole("row", { name: /name2/i });
    checkbox = within(row).getByRole("checkbox", {
      name: /toggle select row/i,
    });

    await userEvent.click(checkbox);

    icon = screen.getByTestId("DeleteIcon");
    deleteButton = icon.closest("button") as HTMLButtonElement;
    await userEvent.click(deleteButton);

    expect(handleDeleteRows).toHaveBeenLastCalledWith(["1", "2"]);

    row = screen.getByRole("row", { name: /name1/i });
    checkbox = within(row).getByRole("checkbox", {
      name: /toggle select row/i,
    });

    await userEvent.click(checkbox);

    icon = screen.getByTestId("DeleteIcon");
    deleteButton = icon.closest("button") as HTMLButtonElement;
    await userEvent.click(deleteButton);

    expect(handleDeleteRows).toHaveBeenLastCalledWith(["2"]);
  });
});
