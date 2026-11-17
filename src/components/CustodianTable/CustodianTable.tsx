"use client";

import { Custodian } from "@/types/api";
import {
  MRT_RowSelectionState,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo, useState } from "react";
import Table from "@/components/Table";
import { useTable } from "@/hooks/useTable";
import dayjs from "dayjs";
import { TableProps } from "../Table/Table";
import { trueKeys } from "@/utils/numbers";

export interface CustodianTableProps extends TableProps {
  custodians: Custodian[];
  showPid?: boolean;
  refreshRate?: number;
  tableTitle?: string;
  tableSubTitle?: string;
  handleDelete?: (ids: string[]) => Promise<void>;
  emptyMessageOverride?: string;
}

const CustodianTable = ({
  custodians,
  tableTitle,
  tableSubTitle,
  handleDelete,
  emptyMessageOverride,
  ...rest
}: CustodianTableProps) => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const selectedCustodianIds = useMemo(
    () => trueKeys(rowSelection ?? {}),
    [rowSelection],
  );

  const columns: MRT_ColumnDef<Custodian>[] = [
    {
      id: "name",
      header: "Name",
      accessorFn: (row) => row.name,
      size: 200,
      minSize: 200,
      maxSize: 200,
    },
    {
      id: "created_at",
      header: "Created",
      accessorFn: (row) =>
        row.created_at
          ? dayjs(row.created_at).format("MMM D, YYYY HH:mm")
          : "—",
    },
    {
      id: "updated_at",
      header: "Last Updated",
      accessorFn: (row) =>
        row.updated_at
          ? dayjs(row.updated_at).format("MMM D, YYYY HH:mm")
          : "—",
    },
  ];

  const table = useTable({
    columns,
    data: custodians,
    enableSorting: false,
    ...(setRowSelection && { onRowSelectionChange: setRowSelection }),
    ...(rowSelection && { state: { rowSelection } }),
    getRowId: (row) => String(row?.id),
  });

  return (
    <Table
      key="admin-custodian-table"
      emptyMessage={
        emptyMessageOverride ??
        "Custodians will appear here when they are added to this network"
      }
      table={table}
      leftAction={{
        titleProps: {
          title: tableTitle || "Custodians",
          subTitle: tableSubTitle,
        },
      }}
      rightAction={{
        deleteProps: {
          onClick: handleDelete,
          disabled: selectedCustodianIds.length === 0,
        },
      }}
      {...rest}
    />
  );
};

export default CustodianTable;
