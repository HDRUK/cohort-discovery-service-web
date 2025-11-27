import { CollectionHost } from "@/types/api";
import { useTable } from "@/hooks/useTable";
import { MRT_ColumnDef, MRT_RowSelectionState } from "material-react-table";
import { Box } from "@mui/material";
import { Dispatch, SetStateAction, useMemo } from "react";
import Table from "@/components/Table";

interface CollectionHostsTableProps {
  collectionHosts: CollectionHost[];
  rowSelection: MRT_RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<MRT_RowSelectionState>>;
  onDelete: (ids: string[]) => void;
}

const CollectionHostsTable = ({
  collectionHosts,
  rowSelection,
  setRowSelection,
  onDelete,
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
      <Table
        table={table}
        rightAction={{ deleteProps: { onClick: onDelete } }}
      />
    </Box>
  );
};

export default CollectionHostsTable;
