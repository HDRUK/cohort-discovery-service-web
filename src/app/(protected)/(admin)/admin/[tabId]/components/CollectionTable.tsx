import { CollectionHost, CollectionWithHosts, Paginated } from "@/types/api";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { Box } from "@mui/material";
import CollectionHostChip from "@/components/CollectionHostChip";
import CodeBlock from "@/components/CodeBlock";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { useMemo } from "react";

const CollectionTable = ({
  collections,
}: {
  collections: Paginated<CollectionWithHosts[]>;
}) => {
  const columns = useMemo<MRT_ColumnDef<CollectionWithHosts>[]>(
    () => [
      {
        accessorKey: "pid",
        header: "PID",
        Cell: ({ cell }) => {
          const pid = cell.getValue<string>();
          return <CodeBlock code={pid} />;
        },
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "host",
        header: "Host",
        Cell: ({ cell }) => {
          const [host] = cell.getValue<CollectionHost[]>();
          return <CollectionHostChip ch={host} />;
        },
      },
    ],
    []
  );

  const table = usePaginatedTable<CollectionWithHosts>({
    columns,
    data: collections.data,
    rowCount: collections.total,
    perPageDefault: collections.per_page,
  });

  return (
    <Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default CollectionTable;
