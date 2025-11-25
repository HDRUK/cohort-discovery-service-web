"use client";

import {
  Collection,
  CollectionStatus,
  CollectionWithHosts,
  Paginated,
} from "@/types/api";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Chip } from "@mui/material";
import { getCollectionStatus } from "@/utils/colours";
import dayjs from "dayjs";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import Table from "../Table";

const CollectionsTable = ({
  collections,
}: {
  collections: Paginated<CollectionWithHosts[]>;
}) => {
  const columns = useMemo<MRT_ColumnDef<Collection>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        accessorFn: (row) => row.name,
        size: 50,
      },
      {
        id: "last_active",
        header: "Last Active",
        accessorFn: (row) =>
          row.last_active ? dayjs(row.last_active).format("DD/MM/YYYY") : "—",
        size: 50,
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (row) => row.status,
        Cell: ({ cell }) => {
          const status = cell.getValue<CollectionStatus>();
          const { label, color } = getCollectionStatus(status);
          return <Chip label={label} color={color} />;
        },
        size: 20,
      },
    ],
    []
  );

  const table = usePaginatedTable({
    columns,
    data: collections.data,
    rowCount: collections.total,
    perPageDefault: collections.per_page,
    enableSorting: false,
  });

  return <Table table={table} />;
};

export default CollectionsTable;
