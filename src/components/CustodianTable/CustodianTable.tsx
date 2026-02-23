"use client";

import { Custodian } from "@/types/api";
import {
  MRT_RowSelectionState,
  type MRT_ColumnDef,
} from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import Table from "@/components/Table";
import useSearchParams from "@/hooks/useSearchParams";
import { capitaliseFirstLetter } from "@/utils/string";
import useAdminStore from "@/hooks/useAdminStore";
import { useTable } from "@/hooks/useTable";
import dayjs from "dayjs";
import { TableProps } from "../Table/Table";
import { trueKeys } from "@/utils/numbers";
import { useUserDataStore } from "@/hooks/userDataStore";

export interface CustodianTableProps extends TableProps {
  showPid?: boolean;
  refreshRate?: number;
  tableTitle?: string;
  tableSubTitle?: string;
  handleDelete?: (ids: string[]) => Promise<void>;
}

const CustodianTable = ({
  tableTitle,
  tableSubTitle,
  handleDelete,
  ...rest
}: CustodianTableProps) => {
  const { getSearchParam } = useSearchParams("network_filter");
  const nw_filter = getSearchParam();

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const custodians = useUserDataStore((s) => s.custodians);

  const selectedCustodianIds = useMemo(
    () => trueKeys(rowSelection ?? {}),
    [rowSelection],
  );

  const networks = useAdminStore((s) => s.networks);
  const activeNetwork = useMemo(
    () => networks.find((nw) => String(nw.id) === nw_filter),
    [networks, nw_filter],
  );

  const hydratedCustodians = useMemo(
    () => custodians.filter((c) => c.network?.id === activeNetwork?.id),
    [custodians, activeNetwork],
  );

  useEffect(() => {
    console.log({ hydratedCustodians }, "hydratedCustodians changed");
  }, [hydratedCustodians]);

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
    data: hydratedCustodians,
    enableSorting: false,
    ...(setRowSelection && { onRowSelectionChange: setRowSelection }),
    ...(rowSelection && { state: { rowSelection } }),
    getRowId: (row) => String(row?.id),
  });

  return (
    <Table
      key="admin-custodian-table"
      emptyMessage="Custodians will appear here when they are added to this network"
      table={table}
      leftAction={{
        titleProps: {
          title: tableTitle || "Custodians",
          subTitle:
            tableSubTitle || capitaliseFirstLetter(activeNetwork?.name ?? ""),
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
