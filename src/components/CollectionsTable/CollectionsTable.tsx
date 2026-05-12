"use client";

import { Collection, CollectionStatus } from "@/types/api";
import {
  MRT_RowSelectionState,
  type MRT_ColumnDef,
} from "material-react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Paper, Stack, Typography } from "@mui/material";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import Table from "@/components/Table";
import CopyableVariable from "../CopyableVariable";
import useSearchParams from "@/hooks/useSearchParams";
import { capitaliseFirstLetter } from "@/utils/string";
import { getDatetime } from "@/utils/date";
import { trueKeys } from "@/utils/numbers";
import { useLogDependencyChanges } from "@/utils/deps";
import useAdminStore from "@/hooks/useAdminStore";
import useCustodianStore from "@/hooks/useCustodianStore";
import useUserStore from "@/hooks/useUserStore";
import { useConfirm } from "@/hooks/useConfirm";
import { useNotify } from "@/providers/NotifyProvider";
import {
  getTagCollection,
  getTagCustodianCollection,
  TAG_COLLECTIONS_ADMIN,
} from "@/config/tags";
import StatusChip from "@/components/StatusChip";
import { TableProps } from "../Table/Table";
import SyntheticChip from "../SyntheticChip";
import CollectionDetails from "./CollectionDetails";
import usePrefetchCollectionDetails from "./usePrefetchCollectionDetails";
import useFeatures from "@/hooks/useFeatures";
import { useQueryClient } from "@tanstack/react-query";
import { revalidateAction } from "@/actions/revalidate";

export interface CollectionsTableProps extends TableProps {
  showPid?: boolean;
  tableTitle?: string;
  tableSubTitle?: string;
  deleteOverride?: (ids: string[]) => Promise<void>;
  emptyMessageOverride?: string;
}

const CollectionsTable = ({
  showPid = false,
  tableTitle,
  tableSubTitle,
  deleteOverride,
  emptyMessageOverride,
  ...rest
}: CollectionsTableProps) => {
  const { adminMoreCollectionDetails } = useFeatures();
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

  //rely on server side data only
  const collections = isAdmin ? adminCollections : custodianCollections;

  const notify = useNotify();

  const selectedCollectionIds = useMemo(
    () => trueKeys(rowSelection ?? {}),
    [rowSelection],
  );

  const queryClient = useQueryClient();

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
        id: "last_ping",
        header: "Last Ping",
        accessorFn: (row) =>
          row.last_ping?.a?.updated_at
            ? getDatetime(row.last_ping.a.updated_at)
            : "—",
        size: 50,
        minSize: 50,
        maxSize: 50,
      },
      {
        id: "last_query",
        header: "Last Query",
        accessorFn: (row) =>
          row.last_successful_query?.completed_at
            ? getDatetime(row.last_successful_query.created_at)
            : "—",
        size: 50,
        minSize: 50,
        maxSize: 50,
      },
      {
        id: "last_demographic",
        header: "Last Distribution Demographics",
        accessorFn: (row) =>
          row.latest_successful_demographic_result_file?.updated_at
            ? getDatetime(
                row.latest_successful_demographic_result_file.updated_at,
              )
            : "—",
        size: 50,
        minSize: 50,
        maxSize: 50,
        Cell: ({ cell }) => {
          const date = cell.getValue<string>();
          return <Typography>{date}</Typography>;
        },
      },
      {
        id: "last_concept",
        header: "Last Distribution Concepts",
        accessorFn: (row) =>
          row.latest_successful_concept_result_file?.updated_at
            ? getDatetime(row.latest_successful_concept_result_file.updated_at)
            : "—",
        size: 50,
        minSize: 50,
        maxSize: 50,
        Cell: ({ cell }) => {
          const date = cell.getValue<string>();
          return <Typography>{date}</Typography>;
        },
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (row) => row.model_state?.state_id,
        Cell: ({ cell, row }) => {
          const status = cell.getValue<CollectionStatus>();
          return (
            <Stack gap={1} direction={"row"}>
              <StatusChip state_id={status} />{" "}
              <SyntheticChip isSynthetic={!!row.original?.is_synthetic} />
            </Stack>
          );
        },
        size: 20,
        minSize: 20,
        maxSize: 20,
      },
    ],
    [showPid],
  );

  usePrefetchCollectionDetails({
    pids: adminMoreCollectionDetails ? collections.data.map((c) => c.pid) : [],
  });

  const table = usePaginatedTable<Collection>({
    columns,
    data: collections.data,
    rowCount: collections.total,
    perPageDefault: collections.per_page,
    enableSorting: false,
    ...(setRowSelection && { onRowSelectionChange: setRowSelection }),
    ...(rowSelection && { state: { rowSelection } }),
    getRowId: (row) => String(row?.id),
    ...(isAdmin &&
      adminMoreCollectionDetails && {
        manualExpanding: true,
        renderDetailPanel: ({ row }) => (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor: "grey.100",
            }}
          >
            <CollectionDetails pid={row.original.pid} />
          </Paper>
        ),
      }),
  });

  const handleDeleteClick = async () => {
    const ok = await confirm({
      props: {
        action: `delete the collection${selectedCollections.length > 1 ? "s" : ""} ${selectedCollections.map((c) => c.name).join(", ")}`,
      },
      confirmText: "Delete",
      confirmColor: "error",
    });
    if (!ok || ok === "cancel") {
      return;
    }
    handleDeleteCollections(selectedCollections.map((c) => c.id.toString()));
  };

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

  const confirm = useConfirm();

  return (
    <Table
      key="custodian-collection-table"
      emptyMessage={
        emptyMessageOverride ??
        "Collections will appear here when they are created"
      }
      table={table}
      leftAction={{
        titleProps: {
          title: tableTitle || "Collections",
          subTitle: tableSubTitle || capitaliseFirstLetter(filter_name),
        },
      }}
      rightAction={{
        deleteProps: {
          onClick: handleDeleteClick,
        },
        refreshProps: {
          tag:
            currentCustodian?.pid && !isAdmin
              ? getTagCustodianCollection(currentCustodian.pid)
              : TAG_COLLECTIONS_ADMIN,
          label: "Refresh Collections",
          onRefreshed: async () => {
            if (!adminMoreCollectionDetails) return;
            const tags = collections.data.map((c) => getTagCollection(c.pid));
            tags.map((t) => revalidateAction(t));
            await queryClient.invalidateQueries({
              queryKey: ["collectionDetails"],
            });
            await queryClient.refetchQueries({
              queryKey: ["collectionDetails"],
              type: "all",
            });
          },
        },
      }}
      {...rest}
    />
  );
};

export default CollectionsTable;
