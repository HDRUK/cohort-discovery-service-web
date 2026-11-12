"use client";

import {
  Collection,
  CollectionStatus,
  CollectionWithHosts,
  Paginated,
} from "@/types/api";
import { DEFAULT_PER_PAGE } from "@/config/defaults";
import {
  MRT_RowSelectionState,
  type MRT_ColumnDef,
} from "material-react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Chip, Paper, Stack, Typography } from "@mui/material";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import Table from "@/components/Table";
import CopyableVariable from "../CopyableVariable";
import useSearchParams from "@/hooks/useSearchParams";
import { capitaliseFirstLetter } from "@/utils/string";
import { getDatetime } from "@/utils/date";
import { trueKeys } from "@/utils/numbers";
import deleteCollections from "@/actions/collection/deleteCollections";
import restoreCollection from "@/actions/collection/restoreCollection";
import { useConfirm } from "@/hooks/useConfirm";
import { useNotify } from "@/providers/NotifyProvider";
import { QUERY_KEYS } from "@/config/tags";
import StatusChip from "@/components/StatusChip";
import { TableProps } from "../Table/Table";
import SyntheticChip from "../SyntheticChip";
import CollectionDetails from "./CollectionDetails";
import useFeatures from "@/hooks/useFeatures";
import { useQueryClient } from "@tanstack/react-query";
import { CollectionFilterStatus } from "@/types/collections";
import { useCustodianSection } from "@/contexts/CustodianSectionContext";
import { useSelectionStore } from "@/store/selectionStore";
import { selectAllById } from "@/utils/selection";

export interface CollectionsTableProps extends TableProps {
  collections?: Paginated<CollectionWithHosts>;
  showPid?: boolean;
  tableTitle?: string;
  tableSubTitle?: string;
  deleteOverride?: (ids: string[]) => Promise<void>;
  emptyMessageOverride?: string;
}

const CollectionsTable = ({
  collections,
  showPid = false,
  tableTitle,
  tableSubTitle,
  deleteOverride,
  emptyMessageOverride,
  ...rest
}: CollectionsTableProps) => {
  const { adminMoreCollectionDetails } = useFeatures();
  const { getSearchParam } = useSearchParams("collection_filter");
  const filter_name = getSearchParam() || "all";
  const isDeletedView = filter_name === CollectionFilterStatus.DELETED;

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const currentCustodian = useCustodianSection()?.custodian;
  const isAdmin = useMemo(() => !currentCustodian, [currentCustodian]);
  const setSelectedCollectionIds = useSelectionStore(
    (s) => s.setSelectedCollectionIds,
  );

  const rows = collections?.data;

  const notify = useNotify();

  const selectedCollectionIds = useMemo(
    () => trueKeys(rowSelection ?? {}),
    [rowSelection],
  );

  const selectedCollections = useMemo(
    () => selectAllById(rows ?? [], selectedCollectionIds),
    [rows, selectedCollectionIds],
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    setSelectedCollectionIds(selectedCollectionIds);
  }, [selectedCollectionIds, setSelectedCollectionIds]);

  useEffect(
    () => () => setSelectedCollectionIds([]),
    [setSelectedCollectionIds],
  );

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
              {row.original.deleted_at ? (
                <Chip label="Deleted" color="error" />
              ) : (
                <StatusChip state_id={status} />
              )}{" "}
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

  const table = usePaginatedTable<Collection>({
    columns,
    data: rows,
    rowCount: collections?.total ?? 0,
    perPageDefault: collections?.per_page ?? DEFAULT_PER_PAGE,
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
    const isPlural = selectedCollections.length > 1;
    const ok = await confirm({
      props: {
        action: `delete the collection${isPlural ? "s" : ""} ${selectedCollections.map((c) => c.name).join(", ")}`,
      },
      title: deleteOverride
        ? "Confirm"
        : `Delete collection${isPlural ? "s" : ""}`,
      ...(!deleteOverride && {
        description: `${selectedCollections.map((c) => c.name).join(", ")} will be hidden from users and will stop receiving queries. ${isPlural ? "They" : "It"} can be restored from Deleted Collections.`,
      }),
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
        const { deleted, failed } = await deleteCollections(ids.map(Number));
        const isPlural = ids.length > 1;

        if (failed.length > 0) {
          const failedNames = selectedCollections
            .filter((c) => failed.includes(c.id))
            .map((c) => c.name)
            .join(", ");
          notify.error(
            `Deleted ${deleted.length} of ${ids.length} collection${isPlural ? "s" : ""}. Could not delete ${failedNames} — check the details and try again`,
          );
        } else {
          notify.success(
            `${deleted.length} Collection${isPlural ? "s" : ""} deleted`,
          );
        }
        setRowSelection(
          Object.fromEntries(failed.map((id) => [String(id), true])),
        );
      }
    },
    [deleteOverride, notify, selectedCollections],
  );

  const handleRestoreClick = async () => {
    const isPlural = selectedCollections.length > 1;
    const ok = await confirm({
      title: `Restore collection${isPlural ? "s" : ""}`,
      description: `${selectedCollections.map((c) => c.name).join(", ")} will come back as Draft and must be approved again before users can see ${isPlural ? "them" : "it"}.`,
      confirmText: "Restore",
    });
    if (ok !== "confirm") {
      return;
    }

    const results = await Promise.all(
      selectedCollections.map(async (collection) => ({
        collection,
        result: await restoreCollection(collection.id),
      })),
    );
    const failed = results.filter(({ result }) => result.error);
    const restoredCount = results.length - failed.length;

    if (failed.length > 0) {
      notify.error(
        `Restored ${restoredCount} of ${results.length} collection${isPlural ? "s" : ""}. Could not restore ${failed.map(({ collection, result }) => `${collection.name} (${result.error?.text})`).join(", ")} — check the details and try again`,
      );
    } else {
      notify.success(
        `${restoredCount} Collection${isPlural ? "s" : ""} restored`,
      );
    }
    setRowSelection(
      Object.fromEntries(
        failed.map(({ collection }) => [String(collection.id), true]),
      ),
    );
  };

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
        ...(isDeletedView
          ? { restoreProps: { onClick: handleRestoreClick } }
          : { deleteProps: { onClick: handleDeleteClick } }),
        refreshProps: {
          label: "Refresh Collections",
          onRefreshed: async () => {
            if (!adminMoreCollectionDetails) return;
            await queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.collectionDetails(),
              refetchType: "all",
            });
          },
        },
      }}
      {...rest}
    />
  );
};

export default CollectionsTable;
