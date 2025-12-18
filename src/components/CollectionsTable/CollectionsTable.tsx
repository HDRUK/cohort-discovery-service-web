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
import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Chip, Tooltip, Typography } from "@mui/material";
import { getCollectionStatus } from "@/utils/colours";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import Table from "@/components/Table";
import CopyableVariable from "../CopyableVariable";
import Title from "@/components/Title";
import useSearchParams from "@/hooks/useSearchParams";
import { capitaliseFirstLetter } from "@/utils/string";
import { getDatetime } from "@/utils/date";
import { formatNumber, trueKeys } from "@/utils/numbers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DEFAULT_INTERVAL } from "@/config/defaults";
import getCustodianCollections from "@/actions/getCustodianCollections";
import getAdminCollections from "@/actions/getAdminCollections";
import { isEqualTask } from "@/utils/distributions";
import { useLogDependencyChanges } from "@/utils/deps";
import useAdminStore from "@/store/useAdminStore";
import useCustodianStore from "@/store/useCustodianStore";
import useUserStore from "@/store/useUserStore";

export interface CollectionsTableProps {
  initialData: Paginated<CollectionWithHosts[]>;
  showPid?: boolean;
  admin?: boolean;
  refreshRate?: number;
  tableTitle?: string;
  tableSubTitle?: string;
}

const CollectionsTable = ({
  initialData,
  showPid = false,
  admin = false,
  refreshRate = 5,
  tableTitle,
  tableSubTitle,
}: CollectionsTableProps) => {
  const { searchParams, getSearchParam } = useSearchParams("collection_filter");
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const deleteCollectionAdmin = useAdminStore((s) => s.deleteCollection);
  const deleteCollection = useCustodianStore((s) => s.deleteCollection);
  const currentCustodian = useCustodianStore((s) => s.currentCustodian);
  const selectedCollection = useUserStore((s) => s.selectedCollection);
  const setSelectedCollection = useUserStore((s) => s.setSelectedCollection);

  const queryKey = useMemo(
    () => [
      `collections-${
        currentCustodian?.pid ? currentCustodian.pid : "admin"
      }-${searchParams.toString()}`,
    ],
    [searchParams, currentCustodian]
  );
  const qc = useQueryClient();
  const { data: collections } = useQuery<Paginated<CollectionWithHosts[]>>({
    queryKey,
    queryFn: async () => {
      const res =
        currentCustodian?.pid && !admin
          ? await getCustodianCollections(currentCustodian.pid, searchParams, {
              fresh: true,
            })
          : await getAdminCollections(searchParams, { fresh: true });

      return res.data;
    },
    initialData,
    staleTime: 2 * refreshRate * DEFAULT_INTERVAL,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.total === 0) return false;

      const runningCollections =
        data?.data.filter(
          (c) =>
            !isEqualTask(
              c?.latest_demographic_task,
              c.latest_demographic?.task
            ) || !isEqualTask(c?.latest_concept_task, c.latest_concept?.task)
        ) ?? [];

      const hasIncomplete = runningCollections?.length > 0;
      return hasIncomplete ? refreshRate * DEFAULT_INTERVAL : false;
    },
  });

  useEffect(() => {
    qc.setQueryData(queryKey, initialData);
  }, [qc, queryKey, initialData]);

  const selectedCollectionIds = useMemo(
    () => trueKeys(rowSelection ?? {}),
    [rowSelection]
  );

  useEffect(() => {
    const newSelectedCollection =
      selectedCollectionIds.length > 0
        ? collections.data.find(
            (h) =>
              String(h.id) ===
              selectedCollectionIds[selectedCollectionIds.length - 1]
          ) ?? null
        : null;
    setSelectedCollection(newSelectedCollection);
  }, [
    collections.data,
    selectedCollection,
    selectedCollectionIds,
    setSelectedCollection,
  ]);

  const filter_name = getSearchParam() || "all";

  const columns = useMemo<MRT_ColumnDef<Collection>[]>(
    () => [
      ...(showPid
        ? [
            {
              id: "pid",
              header: "Identifier",
              accessorFn: (row) => row.pid,
              size: 200,
              minSize: 200,
              maxSize: 200,
              Cell: ({ cell }) => {
                const pid = cell.getValue<string>();
                return <CopyableVariable value={pid} />;
              },
            } as MRT_ColumnDef<Collection>,
          ]
        : []),
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
        header: "Last Query",
        accessorFn: (row) =>
          row.last_active ? getDatetime(row.last_active) : "—",
        size: 50,
        minSize: 50,
        maxSize: 50,
      },
      {
        id: "last_demographic",
        header: "Last Distribution Demographics",
        accessorFn: (row) =>
          row.latest_demographic?.task
            ? getDatetime(row.latest_demographic.created_at)
            : "—",
        size: 50,
        minSize: 50,
        maxSize: 50,
        Cell: ({ cell, row }) => {
          const counts = formatNumber(
            row.original?.latest_demographic?.count ?? 0
          );
          const date = cell.getValue<string>();
          return (
            <Tooltip title={`Number of studies = ${counts}`}>
              <Typography>{date}</Typography>
            </Tooltip>
          );
        },
      },
      {
        id: "last_concept",
        header: "Last Distribution Concepts",
        accessorFn: (row) =>
          row.latest_concept?.created_at
            ? getDatetime(row.latest_concept.created_at)
            : "—",
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
    [showPid]
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

  const handleDeleteCollections = useCallback(
    async (ids: string[]) => {
      await Promise.all(
        ids.map((id) => {
          if (currentCustodian) {
            deleteCollection(id, currentCustodian.pid);
          } else {
            deleteCollectionAdmin(id);
          }
        })
      );
    },
    [currentCustodian, deleteCollection, deleteCollectionAdmin]
  );

  useLogDependencyChanges("collectionsTable", {
    queryKey,
    table,
    filter_name,
    handleDeleteCollections,
    collections,
    searchParams,
    getSearchParam,
    rowSelection,
    setRowSelection,
    setSelectedCollection,
    deleteCollection,
    deleteCollectionAdmin,
  });

  if (collections.total === 0)
    return (
      <Box
        sx={{
          px: 2,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        <Title
          title={tableTitle || "Collections"}
          subTitle={tableSubTitle || capitaliseFirstLetter(filter_name)}
        />
        <Box sx={{ mx: "auto", my: "auto" }}>
          <Typography variant="h5">
            Collections will appear here when they are created
          </Typography>
        </Box>
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
        leftAction={{
          titleProps: {
            title: tableTitle || "Collections",
            subTitle: tableSubTitle || capitaliseFirstLetter(filter_name),
          },
        }}
        rightAction={{
          deleteProps: { onClick: handleDeleteCollections },
          refreshProps: {
            tag: currentCustodian?.pid
              ? `collections-${currentCustodian.pid}`
              : "collections",
          },
        }}
      />
    </Box>
  );
};

export default CollectionsTable;
