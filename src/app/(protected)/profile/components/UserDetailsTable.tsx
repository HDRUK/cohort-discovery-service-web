"use client";

import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Chip, Tooltip, Stack, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import { useTable } from "@/hooks/useTable";
import dayjs from "dayjs";
import { CombinedUser } from "@/types/api";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

type KVRow = {
  label: string;
  value: React.ReactNode;
};

const UserDetailsTable = ({ user }: { user: CombinedUser }) => {
  console.log(user);
  const data: KVRow[] = [
    { label: "ID", value: user.id },
    { label: "Gateway ID", value: user?.gateway_user?.id },
    { label: "Name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Orcid", value: user.gateway_user?.orcid || "—" },
    {
      label: "Email Verified",
      value: user.email_verified_at ? (
        <Tooltip
          title={`Verified at ${dayjs(user.email_verified_at).format(
            "MMM D, YYYY HH:mm"
          )}`}
        >
          <CheckCircleIcon color="success" fontSize="small" />
        </Tooltip>
      ) : (
        <Tooltip title="Not verified">
          <PendingIcon color="warning" fontSize="small" />
        </Tooltip>
      ),
    },
    {
      label: "Created",
      value: user.created_at
        ? dayjs(user.created_at).format("MMM D, YYYY HH:mm")
        : "—",
    },
    {
      label: "Updated",
      value: user.updated_at
        ? dayjs(user.updated_at).format("MMM D, YYYY HH:mm")
        : "—",
    },

    { label: "Provider", value: user.gateway_user?.provider ?? "—" },
    {
      label: "Admin",
      value: user.gateway_user?.is_admin ? (
        <Chip size="small" color="success" label="Admin" />
      ) : (
        <Chip size="small" variant="outlined" label="User" />
      ),
    },
    {
      label: "NHSE SDE Approved",
      value: user.gateway_user?.is_nhse_sde_approval ? (
        <CheckCircleOutlineIcon color="success" />
      ) : (
        <BlockIcon color="error" />
      ),
    },
    {
      label: "Roles",
      value: user.gateway_user?.rquestroles?.length ? (
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {user.gateway_user.rquestroles.map((r) => (
            <Chip key={r} size="small" label={r} />
          ))}
        </Stack>
      ) : (
        "—"
      ),
    },
    { label: "Organisation", value: user.gateway_user?.organisation || "—" },
  ];

  const columns = useMemo<MRT_ColumnDef<KVRow>[]>(
    () => [
      {
        accessorKey: "label",
        header: "Field",
        size: 220,
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "value",
        header: "Value",
        size: 500,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ cell }) => <>{cell.getValue<React.ReactNode>()}</>,
      },
    ],
    []
  );

  const table = useTable<KVRow>({
    columns,
    data,
    enableRowSelection: false,
  });

  return (
    <Box
      sx={{
        justifyContent: "center",
        maxWidth: 720,
        display: "flex",
      }}
    >
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default UserDetailsTable;
