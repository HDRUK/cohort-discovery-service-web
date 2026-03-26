import { CollectionHost } from "@/types/api";
import { useTable } from "@/hooks/useTable";
import { MRT_ColumnDef, MRT_RowSelectionState } from "material-react-table";
import { Box, Chip } from "@mui/material";
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
      {
        accessorFn: (row) => row.collections,
        header: "Associated Collections",
        Cell: ({ row }) => {
          return (
            <Box display="flex" gap={1}>
              {row.original.collections.map((c) => {
                return (
                  <Chip
                    color="secondary"
                    label={c.name}
                    key={`${c.name}-${row.original.id}`}
                  />
                );
              })}
            </Box>
          );
        },
      },
    ],
    [],
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
        leftAction={{
          titleProps: {
            title: "Collection Hosts",
            subTitle: "All",
          },
        }}
        rightAction={{ deleteProps: { onClick: onDelete } }}
      />
    </Box>
  );
};

export default CollectionHostsTable;
