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
import { Box, Tooltip, Typography } from "@mui/material";
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
import { useNotify } from "@/providers/NotifyProvider";
import { getTagCustodianCollection, TAG_COLLECTION_ADMIN } from "@/config/tags";
import { buildCollectionParams } from "@/utils/params";
import StatusChip from "@/components/StatusChip";

export interface CollectionsTableProps {
  initialData: Paginated<CollectionWithHosts[]>;
  showPid?: boolean;
  admin?: boolean;
  refreshRate?: number;
  tableTitle?: string;
  tableSubTitle?: string;
  deleteOverride?: (ids: string[]) => Promise<void>;
}

const CollectionsTable = ({
  initialData,
  showPid = false,
  admin = false,
  refreshRate = 5,
  tableTitle,
  tableSubTitle,
  deleteOverride,
}: CollectionsTableProps) => {
  const { searchParams, getSearchParam } = useSearchParams("collection_filter");
  const filter_name = getSearchParam() || "all";

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const deleteCollectionAdmin = useAdminStore((s) => s.deleteCollection);
  const deleteCollection = useCustodianStore((s) => s.deleteCollection);
  const currentCustodian = useCustodianStore((s) => s.currentCustodian);
  const selectedCollections = useUserStore((s) => s.selectedCollections);
  const setSelectedCollections = useUserStore((s) => s.setSelectedCollections);

  const notify = useNotify();

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
      const workgroupFilter =
        searchParams?.get("workgroup_filter") ?? undefined;
      const searchTerm = searchParams?.get("search_term") ?? undefined;

      const collectionFilter =
        searchParams?.get("collection_filter") ?? undefined;

      const collectionParams = {
        page: Number(searchParams?.get("page")) ?? initialData.current_page,
        per_page: Number(searchParams?.get("per_page")) ?? initialData.per_page,
        ...(workgroupFilter
          ? { workgroup_filter: Number(workgroupFilter) }
          : {}),
        ...(searchTerm ? { search_term: searchTerm } : {}),
        ...(collectionFilter ? { collection_filter: collectionFilter } : {}),
      };

      const params = buildCollectionParams(collectionParams).toString();

      const res =
        currentCustodian?.pid && !admin
          ? await getCustodianCollections(currentCustodian.pid, {
              params,
              cacheOptions: {
                useCache: false,
              },
            })
          : await getAdminCollections({
              params,
              cacheOptions: {
                useCache: false,
              },
            });
      return res.data;
    },
    initialData,
    staleTime: 2 * refreshRate * DEFAULT_INTERVAL,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
    const newSelectedCollections = selectedCollectionIds
      .map((id) => collections.data.find((c) => String(c.id) === id) || null)
      .filter((c) => c !== null);

    setSelectedCollections(newSelectedCollections);
  }, [
    collections.data,
    selectedCollections,
    selectedCollectionIds,
    setSelectedCollections,
  ]);

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
        id: "custodian",
        header: "Custodian",
        accessorFn: (row) => row.custodian.name,
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
          const counts = row.original.n_concepts || "-";
          const date = cell.getValue<string>();
          return (
            <Tooltip title={`Number of concepts = ${counts}`}>
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
        id: "status",
        header: "Status",
        accessorFn: (row) => row.model_state?.state_id,
        Cell: ({ cell }) => {
          const status = cell.getValue<CollectionStatus>();
          return <StatusChip state_id={status} />;
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
      if (deleteOverride) {
        await deleteOverride(ids);
      } else {
        await Promise.all(
          ids.map((id) => {
            if (currentCustodian) {
              deleteCollection(id, currentCustodian.pid);
            } else {
              deleteCollectionAdmin(id);
            }
          })
        );
        notify.success(
          `${ids.length} Collection${ids.length > 1 ? "s" : ""} deleted`
        );
      }
    },
    [
      currentCustodian,
      deleteCollection,
      deleteCollectionAdmin,
      deleteOverride,
      notify,
    ]
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
    setSelectedCollections,
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
            tag:
              currentCustodian?.pid && !admin
                ? getTagCustodianCollection(currentCustodian.pid)
                : TAG_COLLECTION_ADMIN,
            label: "Refresh Collections",
          },
        }}
      />
    </Box>
  );
};

export default CollectionsTable;
