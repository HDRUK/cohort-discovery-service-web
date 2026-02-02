"use client";

import { User } from "@/types/api";
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

export interface CollectionsTableProps extends TableProps {
  showPid?: boolean;
  refreshRate?: number;
  tableTitle?: string;
  tableSubTitle?: string;
  handleDelete?: (ids: string[]) => Promise<void>;
}

const UserTable = ({
  tableTitle,
  tableSubTitle,
  handleDelete,
  ...rest
}: CollectionsTableProps) => {
  const { getSearchParam } = useSearchParams("workgroup_filter");
  const wg_filter = getSearchParam();

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const setSelectedUser = useAdminStore((s) => s.setSelectedUser);
  const users = useAdminStore((s) => s.users);

  const selectedUserIds = useMemo(
    () => trueKeys(rowSelection ?? {}),
    [rowSelection],
  );

  const workgroups = useAdminStore((s) => s.workgroups);
  const activeWorkgroup = workgroups.find((wg) => String(wg.id) === wg_filter);

  // may have been better for this to be BE logic
  // - we dont have a workgroup user filter on the BE now, so this will do
  // - noted for future improvement
  const hydratedUsers = useMemo(
    () =>
      users.filter((u) =>
        u.workgroups?.find((wg) => String(wg.id) === String(wg_filter)),
      ),
    [users, wg_filter],
  );

  const columns: MRT_ColumnDef<User>[] = [
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
    data: hydratedUsers,
    enableSorting: false,
    ...(setRowSelection && { onRowSelectionChange: setRowSelection }),
    ...(rowSelection && { state: { rowSelection } }),
    getRowId: (row) => String(row?.id),
  });

  return (
    <Table
      key="admin-users-table"
      emptyMessage=" Users will appear here when they are added to this workgroup"
      table={table}
      leftAction={{
        titleProps: {
          title: tableTitle || "users",
          subTitle:
            tableSubTitle || capitaliseFirstLetter(activeWorkgroup?.name ?? ""),
        },
      }}
      rightAction={{
        deleteProps: {
          onClick: handleDelete,
          disabled: selectedUserIds.length === 0,
        },
      }}
      {...rest}
    />
  );
};

export default UserTable;
