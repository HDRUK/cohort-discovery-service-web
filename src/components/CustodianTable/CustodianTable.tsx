"use client";

import { Custodian, Paginated } from "@/types/api";
import {
  MRT_RowSelectionState,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo, useState } from "react";
import Table from "@/components/Table";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import dayjs from "dayjs";
import { TableProps } from "../Table/Table";
import { trueKeys } from "@/utils/numbers";
import { DEFAULT_PER_PAGE } from "@/config/defaults";

const formatTimestamp = (value?: string) =>
  value ? dayjs(value).format("MMM D, YYYY HH:mm") : "—";

const COLUMNS: MRT_ColumnDef<Custodian>[] = [
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
    accessorFn: (row) => formatTimestamp(row.created_at),
  },
  {
    id: "updated_at",
    header: "Last updated",
    accessorFn: (row) => formatTimestamp(row.updated_at),
  },
];

export interface CustodianTableProps extends Omit<
  TableProps,
  "leftAction" | "rightAction" | "emptyMessage"
> {
  custodians?: Paginated<Custodian>;
  tableTitle?: string;
  tableSubTitle?: string;
  emptyMessage?: string;
  onDelete?: (ids: string[]) => Promise<boolean>;
}

const CustodianTable = ({
  custodians,
  tableTitle,
  tableSubTitle,
  emptyMessage = "Custodians will appear here when they are added",
  onDelete,
  ...rest
}: CustodianTableProps) => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const selectedCustodianIds = useMemo(
    () => trueKeys(rowSelection),
    [rowSelection],
  );

  const table = usePaginatedTable<Custodian>({
    columns: COLUMNS,
    data: custodians?.data,
    rowCount: custodians?.total ?? 0,
    perPageDefault: custodians?.per_page ?? DEFAULT_PER_PAGE,
    enableSorting: false,
    enableRowSelection: !!onDelete,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    getRowId: (row) => String(row?.id),
  });

  const handleDelete = async () => {
    if (!onDelete) return;
    const deleted = await onDelete(selectedCustodianIds);
    if (deleted) setRowSelection({});
  };

  return (
    <Table
      {...rest}
      table={table}
      emptyMessage={emptyMessage}
      leftAction={{
        titleProps: {
          title: tableTitle || "Custodians",
          subTitle: tableSubTitle,
        },
      }}
      rightAction={
        onDelete && {
          deleteProps: {
            onClick: handleDelete,
            disabled: selectedCustodianIds.length === 0,
          },
        }
      }
    />
  );
};

export default CustodianTable;
