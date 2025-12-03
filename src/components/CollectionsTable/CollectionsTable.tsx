"use client";

import {
  Collection,
  CollectionStatus,
  CollectionWithHosts,
  Paginated,
} from "@/types/api";
import {
  MRT_RowSelectionState,
  type MRT_ColumnDef,
} from "material-react-table";
import { Dispatch, SetStateAction, useMemo } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { getCollectionStatus } from "@/utils/colours";
import dayjs from "dayjs";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import Table from "../Table";
import { useDaphneStore } from "@/store/useDaphneStore";

export interface CollectionsTableProps {
  collections: Paginated<CollectionWithHosts[]>;
  rowSelection?: MRT_RowSelectionState;
  setRowSelection?: Dispatch<SetStateAction<MRT_RowSelectionState>>;
}

const CollectionsTable = ({
  collections,
  rowSelection,
  setRowSelection,
}: CollectionsTableProps) => {
  const {
    custodianData: { deleteCollection, currentCustodian },
    adminData: { deleteCollection: deleteCollectionAdmin },
  } = useDaphneStore();

  const columns = useMemo<MRT_ColumnDef<Collection>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        accessorFn: (row) => row.name,
        size: 200,
        minSize: 200,
        maxSize: 200,
      },
      {
        id: "last_active",
        header: "Last Active",
        accessorFn: (row) =>
          row.last_active ? dayjs(row.last_active).format("DD/MM/YYYY") : "—",
        size: 50,
        minSize: 50,
        maxSize: 50,
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (row) => row.model_state?.state_id,
        Cell: ({ cell }) => {
          const status = cell.getValue<CollectionStatus>();
          const { label, color } = getCollectionStatus(status);
          return <Chip label={label} color={color} />;
        },
        size: 20,
        minSize: 20,
        maxSize: 20,
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
    ...(setRowSelection && { onRowSelectionChange: setRowSelection }),
    ...(rowSelection && { state: { rowSelection } }),
    getRowId: (row) => String(row?.id),
  });

  const handleDeleteCollections = async (ids: string[]) => {
    await Promise.all(
      ids.map((id) => {
        if (currentCustodian) {
          deleteCollection(id, currentCustodian.pid);
        } else {
          deleteCollectionAdmin(id);
        }
      })
    );
  };

  if (collections.total === 0)
    return (
      <Box sx={{ mx: "auto", my: "auto" }}>
        <Typography variant="h5">
          Collections will appear here when they are created
        </Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        px: 1,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      <Table
        key="custodian-collection-table"
        table={table}
        rightAction={{ deleteProps: { onClick: handleDeleteCollections } }}
      />
    </Box>
  );
};

export default CollectionsTable;
