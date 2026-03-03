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
import { Tooltip, Typography } from "@mui/material";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import Table from "@/components/Table";
import CopyableVariable from "../CopyableVariable";
import useSearchParams from "@/hooks/useSearchParams";
import { capitaliseFirstLetter } from "@/utils/string";
import { getDatetime } from "@/utils/date";
import { formatNumber, trueKeys } from "@/utils/numbers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import getCustodianCollections from "@/actions/collection/getCustodianCollections";
import getAdminCollections from "@/actions/collection/getAdminCollections";
import { isEqualTask } from "@/utils/distributions";
import { useLogDependencyChanges } from "@/utils/deps";
import useAdminStore from "@/hooks/useAdminStore";
import useCustodianStore from "@/hooks/useCustodianStore";
import useUserStore from "@/hooks/useUserStore";
import { useNotify } from "@/providers/NotifyProvider";
import {
  getTagCustodianCollection,
  TAG_COLLECTIONS_ADMIN,
} from "@/config/tags";
import { buildCollectionParams } from "@/utils/params";
import StatusChip from "@/components/StatusChip";
import { TableProps } from "../Table/Table";
import { useDefaults } from "@/providers/DefaultProvider";

export interface CollectionsTableProps extends TableProps {
  showPid?: boolean;
  refreshRate?: number;
  tableTitle?: string;
  tableSubTitle?: string;
  deleteOverride?: (ids: string[]) => Promise<void>;
}

const CollectionsTable = ({
  showPid = false,
  refreshRate = 5,
  tableTitle,
  tableSubTitle,
  deleteOverride,
  ...rest
}: CollectionsTableProps) => {
  const defaults = useDefaults();
  const { searchParams, getSearchParam } = useSearchParams("collection_filter");
  const filter_name = getSearchParam() || "all";

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const currentCustodian = useCustodianStore((s) => s.current.custodian);
  const isAdmin = useMemo(() => !currentCustodian, [currentCustodian]);
  const deleteCollectionAdmin = useAdminStore((s) => s.deleteCollection);
  const deleteCollection = useCustodianStore((s) => s.deleteCollection);
  const selectedCollections = useUserStore((s) => s.selectedCollections);
  const setSelectedCollections = useUserStore((s) => s.setSelectedCollections);

  const adminCollections = useAdminStore((s) => s.collections);
  const custodianCollections = useCustodianStore((s) => s.current.collections);

  // initial data is fetch from the store to speed up rendering
  // - fallsback to client side fetch if we need to refresh
  // - may need further improvement here as it's still confusing to follow
  //   where the initial data is set
  const initialData = isAdmin ? adminCollections : custodianCollections;

  const notify = useNotify();

  const queryKey = useMemo(
    () => [
      `collections-${
        currentCustodian?.pid ? currentCustodian.pid : "admin"
      }-${searchParams.toString()}`,
    ],
    [searchParams, currentCustodian],
  );
  const qc = useQueryClient();
  const { data: collections } = useQuery<Paginated<CollectionWithHosts>>({
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
        currentCustodian?.pid && !isAdmin
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
    staleTime: 2 * refreshRate * defaults.tableRefresh,
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
              c.latest_demographic?.task,
            ) || !isEqualTask(c?.latest_concept_task, c.latest_concept?.task),
        ) ?? [];

      const hasIncomplete = runningCollections?.length > 0;
      return hasIncomplete ? refreshRate * defaults.tableRefresh : false;
    },
  });

  useEffect(() => {
    qc.setQueryData(queryKey, initialData);
  }, [qc, queryKey, initialData]);

  const selectedCollectionIds = useMemo(
    () => trueKeys(rowSelection ?? {}),
    [rowSelection],
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
        size: 150,
        minSize: 100,
        maxSize: 200,
      },
      {
        id: "custodian",
        header: "Custodian",
        accessorFn: (row) => row.custodian.name,
        size: 100,
        minSize: 100,
        maxSize: 200,
      },
      {
        id: "network",
        header: "Network",
        accessorFn: (row) => row.custodian.network?.name ?? " - ",
        size: 100,
        minSize: 100,
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
            row.original?.latest_demographic?.count ?? 0,
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
    [showPid],
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
          }),
        );
        notify.success(
          `${ids.length} Collection${ids.length > 1 ? "s" : ""} deleted`,
        );
      }
    },
    [
      currentCustodian,
      deleteCollection,
      deleteCollectionAdmin,
      deleteOverride,
      notify,
    ],
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

  return (
    <Table
      key="custodian-collection-table"
      emptyMessage={"Collections will appear here when they are created"}
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
            currentCustodian?.pid && !isAdmin
              ? getTagCustodianCollection(currentCustodian.pid)
              : TAG_COLLECTIONS_ADMIN,
          label: "Refresh Collections",
        },
      }}
      {...rest}
    />
  );
};

export default CollectionsTable;
