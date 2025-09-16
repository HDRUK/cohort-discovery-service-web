import { CollectionHost, CollectionWithHosts } from "@/types/api";
import { useTable } from "@/hooks/useTable";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { Box } from "@mui/material";
import CollectionHostChip from "@/components/CollectionHostChip";
import CodeBlock from "@/components/CodeBlock";

const CollectionTable = ({
  collections,
}: {
  collections: CollectionWithHosts[];
}) => {
  const columns: MRT_ColumnDef<CollectionWithHosts>[] = [
    {
      accessorKey: "pid",
      header: "PID",
      Cell: ({ cell }) => {
        const pid = cell.getValue<string>();
        return <CodeBlock code={pid} language="html" />;
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
  ];

  const table = useTable<CollectionWithHosts>({
    columns,
    data: collections,
  });

  return (
    <Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default CollectionTable;
