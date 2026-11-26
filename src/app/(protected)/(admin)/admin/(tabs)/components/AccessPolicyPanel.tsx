"use client";

import { ReactNode, useMemo } from "react";
import { MRT_ColumnDef } from "material-react-table";
import { Stack, Typography } from "@mui/material";
import Table from "@/components/Table";
import { useTable } from "@/hooks/useTable";
import { ACCESS_POLICY_UNAVAILABLE } from "@/config/accessPolicy";
import {
  AccessPolicyRow,
  accessPolicyRows,
  operationModeLabel,
  providersSummary,
} from "@/lib/accessPolicySummary";
import { AccessPolicy } from "@/types/accessPolicy";

interface PanelRow {
  field: string;
  value: ReactNode;
}

const NO_ROWS: PanelRow[] = [];

const COLUMNS: MRT_ColumnDef<PanelRow>[] = [
  { accessorKey: "field", header: "Field" },
  {
    accessorKey: "value",
    header: "Value",
    Cell: ({ row }) => row.original.value,
  },
];

const SubjectValue = ({ sync, adminEdits, restored }: AccessPolicyRow) => (
  <Stack sx={{ py: 0.5 }}>
    <Typography variant="body2">{sync}</Typography>
    <Typography variant="caption" color="text.secondary">
      Admin edits: {adminEdits}
    </Typography>
    {restored && (
      <Typography variant="caption" color="text.secondary">
        Restored every sign-in: {restored}
      </Typography>
    )}
  </Stack>
);

const toPanelRows = (policy: AccessPolicy): PanelRow[] => [
  { field: "Operation mode", value: operationModeLabel(policy) },
  { field: "Providers", value: providersSummary(policy) },
  ...accessPolicyRows(policy).map((row) => ({
    field: row.subject,
    value: <SubjectValue {...row} />,
  })),
];

interface AccessPolicyPanelProps {
  policy?: AccessPolicy | null;
}

const AccessPolicyPanel = ({ policy }: AccessPolicyPanelProps) => {
  const rows = useMemo(
    () => (policy ? toPanelRows(policy) : NO_ROWS),
    [policy],
  );

  const table = useTable<PanelRow>({
    columns: COLUMNS,
    data: rows,
    enableRowSelection: false,
    state: { isLoading: policy === undefined },
  });

  return (
    <Table
      table={table}
      emptyMessage={ACCESS_POLICY_UNAVAILABLE}
      leftAction={{
        titleProps: {
          title: "Access control",
          subTitle: "Sign-in sync",
        },
      }}
    />
  );
};

export default AccessPolicyPanel;
