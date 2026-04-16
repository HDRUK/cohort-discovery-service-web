"use client";

import { User } from "@/types/api";
import {
  MRT_RowSelectionState,
  MRT_SortingState,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo, useState } from "react";
import Table from "@/components/Table";
import useSearchParams from "@/hooks/useSearchParams";
import { capitaliseFirstLetter } from "@/utils/string";

import useAdminStore from "@/hooks/useAdminStore";

import dayjs from "dayjs";
import { TableProps } from "../Table/Table";
import { trueKeys } from "@/utils/numbers";
import { useUserDataStore } from "@/hooks/userDataStore";
import { useIsAdminSection } from "@/contexts/AdminSectionContext";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { DEFAULT_PER_PAGE, DEFAULT_USERS_PER_PAGE } from "@/config/defaults";
import { TAG_ADMIN_USERS } from "@/config/tags";
import { getTimestamp } from "@/utils/date";
import { getLastName } from "@/utils/user";

const PAGE_PARAM = "users_page";
const PER_PAGE_PARAM = "users_per_page";

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
  const { getSearchParam, searchParams } = useSearchParams("workgroup_filter");
  const wg_filter = getSearchParam();
  const isAdmin = useIsAdminSection();

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const users = useAdminStore((s) => s.users);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const selectedUserIds = useMemo(
    () => trueKeys(rowSelection ?? {}),
    [rowSelection],
  );

  const workgroups = useUserDataStore((s) => s.workgroups);
  const activeWorkgroup = workgroups.find((wg) => String(wg.id) === wg_filter);

  // may have been better for this to be BE logic
  // - we dont have a workgroup user filter on the BE now, so this will do
  // - noted for future improvement
  const hydratedUsers = useMemo(() => {
    const filtered = users.filter((u) =>
      u.workgroups?.find((wg) => String(wg.id) === String(wg_filter)),
    );

    if (!sorting.length) {
      return [...filtered].sort(
        (a, b) => getTimestamp(b.created_at) - getTimestamp(a.created_at),
      );
    }

    const { id, desc } = sorting[0];

    return [...filtered].sort((a, b) => {
      //note - as above - this is manual sorting as we load all users for admin purposes
      // - we will likely switch the BE to do this
      // - we have a small number of users and only we (admins) see this for now
      switch (id) {
        case "name": {
          const aLast = getLastName(a.name);
          const bLast = getLastName(b.name);

          return desc ? bLast.localeCompare(aLast) : aLast.localeCompare(bLast);
        }

        case "email":
          return desc
            ? (b.email ?? "").localeCompare(a.email ?? "")
            : (a.email ?? "").localeCompare(b.email ?? "");

        case "created_at":
          return desc
            ? getTimestamp(b.created_at) - getTimestamp(a.created_at)
            : getTimestamp(a.created_at) - getTimestamp(b.created_at);

        case "updated_at":
          return desc
            ? getTimestamp(b.updated_at) - getTimestamp(a.updated_at)
            : getTimestamp(a.updated_at) - getTimestamp(b.updated_at);

        default:
          return 0;
      }
    });
  }, [users, wg_filter, sorting]);

  const page = Math.max(1, parseInt(searchParams.get(PAGE_PARAM) || "1", 10));

  const perPage = Math.max(
    1,
    parseInt(searchParams.get(PER_PAGE_PARAM) || String(DEFAULT_PER_PAGE), 10),
  );

  const paginatedHydratedUsers = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return hydratedUsers.slice(start, end);
  }, [hydratedUsers, page, perPage]);

  const columns: MRT_ColumnDef<User>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Name",
        accessorFn: (row) => row.name,
        size: 200,
        minSize: 200,
        maxSize: 200,
      },
      ...(isAdmin
        ? [
            {
              id: "email",
              header: "Email",
              accessorFn: (row) => row.email,
              size: 200,
              minSize: 200,
              maxSize: 200,
            } as MRT_ColumnDef<User>,
          ]
        : []),

      {
        id: "created_at",
        header: "Created",
        accessorFn: (row) => row.created_at ?? null,
        Cell: ({ cell }) =>
          cell.getValue<string | null>()
            ? dayjs(cell.getValue<string>()).format("MMM D, YYYY HH:mm")
            : "—",
      },
      {
        id: "updated_at",
        header: "Last Updated",
        accessorFn: (row) => row.updated_at ?? null,
        Cell: ({ cell }) =>
          cell.getValue<string | null>()
            ? dayjs(cell.getValue<string>()).format("MMM D, YYYY HH:mm")
            : "—",
      },
    ],
    [isAdmin],
  );

  const table = usePaginatedTable<User>({
    columns,
    data: paginatedHydratedUsers,
    rowCount: hydratedUsers.length,
    perPageDefault: DEFAULT_USERS_PER_PAGE,
    pageParam: PAGE_PARAM,
    perPageParam: PER_PAGE_PARAM,
    enableSorting: true,
    manualPagination: true,
    manualSorting: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection, sorting },
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
        refreshProps: {
          tag: TAG_ADMIN_USERS,
          label: "Refresh Users",
        },
      }}
      {...rest}
    />
  );
};

export default UserTable;
