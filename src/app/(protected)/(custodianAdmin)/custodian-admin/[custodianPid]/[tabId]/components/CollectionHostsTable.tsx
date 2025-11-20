import { CollectionHost } from "@/types/api";
import { useTable } from "@/hooks/useTable";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowSelectionState,
} from "material-react-table";
import { Box } from "@mui/material";
import { Dispatch, SetStateAction, useMemo } from "react";

interface CollectionHostsTableProps {
  collectionHosts: CollectionHost[];
  rowSelection: MRT_RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<MRT_RowSelectionState>>;
}

const CollectionHostsTable = ({
  collectionHosts,
  rowSelection,
  setRowSelection,
}: CollectionHostsTableProps) => {
  const columns = useMemo<MRT_ColumnDef<CollectionHost>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
    ],
    []
  );

  const table = useTable<CollectionHost>({
    columns,
    data: collectionHosts,
    getRowId: (row) => row.client_id,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  });

  return (
    <Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default CollectionHostsTable;
