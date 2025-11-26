import Table from "@/components/Table";
import { useTable } from "@/hooks/useTable";
import { User } from "@/types/api";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";

const AdminUserTable = ({ users }: { users: User[] }) => {
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "created_at",
        header: "Created",
        accessorFn: (row) =>
          row.created_at
            ? dayjs(row.created_at).format("MMM D, YYYY HH:mm")
            : "—",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
    ],
    []
  );

  const table = useTable<User>({
    columns,
    data: users,
  });

  return (
    <Box>
      <Table table={table} />
    </Box>
  );
};

export default AdminUserTable;
