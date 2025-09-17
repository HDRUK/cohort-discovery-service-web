import { CollectionHost } from "@/types/api";
import { useTable } from "@/hooks/useTable";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { Box } from "@mui/material";
import CodeBlock from "@/components/CodeBlock";
import { useMemo } from "react";

const CollectionHostsTable = ({
  collectionHosts,
}: {
  collectionHosts: CollectionHost[];
}) => {
  const columns = useMemo<MRT_ColumnDef<CollectionHost>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "client_id",
        header: "Client ID",
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return <CodeBlock code={value} />;
        },
      },
      {
        accessorKey: "client_secret",
        header: "Client Secret",
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return <CodeBlock code={value} />;
        },
      },
      {
        accessorKey: "query_context_type",
        header: "Context",
      },
    ],
    []
  );

  const table = useTable<CollectionHost>({
    columns,
    data: collectionHosts,
  });

  return (
    <Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default CollectionHostsTable;
