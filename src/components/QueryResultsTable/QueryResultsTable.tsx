"use client";

import { Query, Task, Result } from "../../types/api";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import {
  Box,
  CircularProgress,
  Divider,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { revalidateAction } from "@/actions/revalidate";
import { useCallback, useEffect, useMemo } from "react";
import { useTable } from "../../hooks/useTable";
import { formatNumber } from "@/utils/numbers";
import Title from "../Title";
import useQueryBuilder from "@/store/useQueryBuilder";

import ControlledSearchBox from "@/modules/ControlledSearchBox";
import DownloadButton from "../DownloadButton";
import SortButton from "../SortButton";
import { SortAscendingIcon } from "@/icons/SortAscendingIcon";
import { SortDescendingIcon } from "@/icons/SortDescendingIcon";
import useSearchParams from "@/hooks/useSearchParams";
import { SortDirection } from "@/types/common";
import { STATUS_LABELS } from "@/config/defaults";

const QueryResultsTable = ({ query }: { query: Query }) => {
  const { setQueryName, setQueryBuilderJson, queryAsText } = useQueryBuilder(
    (qb) => ({
      setQueryName: qb.setQueryName,
      setQueryBuilderJson: qb.setQueryBuilderJson,
      queryAsText: qb.queryAsText,
    })
  );

  const { tasks, name, definition } = query;

  useEffect(() => {
    setQueryBuilderJson(definition);
  }, [definition, setQueryBuilderJson]);

  useEffect(() => {
    setQueryName(name);
  }, [name, setQueryName]);

  const isPending = tasks.some((t) => !t.result);

  useEffect(() => {
    if (!isPending) return;
    const interval = setInterval(() => {
      revalidateAction(query.pid);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPending, query.pid]);

  const columns: MRT_ColumnDef<Task>[] = [
    {
      accessorKey: "custodian_name",
      accessorFn: (row) => row.collection.custodian?.name,
      header: "Custodian",
      size: 250,
      minSize: 250,
      maxSize: 250,
    },
    {
      accessorKey: "collection_name",
      accessorFn: (row) => ({
        name: row.collection.name,
        url: row.collection.url || "#",
      }),
      Cell: ({ cell }) => {
        const { name, url } = cell.getValue<{ name: string; url: string }>();
        return (
          <Link component="a" href={url}>
            {name}
          </Link>
        );
      },
      header: "Dataset",
      size: 400,
      minSize: 400,
      maxSize: 400,
    },
    {
      accessorKey: "total",
      accessorFn: (row) => row.result,
      header: "Total",
      Cell: ({ cell }) => {
        const result = cell.getValue<Result>();
        const { count, status } = result || {};
        if (status === "error") {
          return <ErrorIcon color="error" />;
        }

        return count === undefined || count === null ? (
          <CircularProgress size={12} />
        ) : (
          formatNumber(count)
        );
      },
      size: 100,
      minSize: 100,
      maxSize: 100,
    },
    {
      accessorKey: "status",
      accessorFn: (row) => row.result,
      header: "Status",
      Cell: ({ cell }) => {
        const result = cell.getValue<Result>();
        const rawStatus = result?.status ?? "pending";
        const displayStatus = STATUS_LABELS[rawStatus] ?? rawStatus;
        return displayStatus;
      },
      size: 100,
      minSize: 100,
      maxSize: 100,
    },
  ];

  const { getSearchParam, setSearchParam } = useSearchParams("sort");
  const currentSortDirection = getSearchParam()?.split(":")[1];

  const handleSort = useCallback(
    (direction: SortDirection) => {
      setSearchParam(
        direction !== currentSortDirection
          ? `collection.name:${direction}`
          : null
      );
    },
    [currentSortDirection, setSearchParam]
  );

  // ideally this would be done on the BE
  // - made a note of this for the BE
  // - we should definitely do this on the BE
  //   if the results are to be paginated in the future
  const sortedTasks = useMemo(() => {
    if (!currentSortDirection) {
      return [...tasks].sort(
        (a, b) => (b.result?.count ?? 0) - (a.result?.count ?? 0)
      );
    }
    return tasks;
  }, [tasks, currentSortDirection]);

  const table = useTable<Task>({
    columns,
    data: sortedTasks,
  });

  return (
    <Box sx={{ p: 2, gap: 2, display: "flex", flexDirection: "column" }}>
      <Title title={"Query Results"} subTitle={query.pid} />
      <Typography variant="h6">{queryAsText}</Typography>
      <Divider />
      <ControlledSearchBox
        placeholder="Search your query results..."
        actions={[
          <SortButton
            key="sort"
            active={!!currentSortDirection}
            items={[
              {
                id: SortDirection.ASCENDING,
                label: (
                  <Typography
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}
                    fontWeight={
                      currentSortDirection == SortDirection.ASCENDING
                        ? "bold"
                        : "normal"
                    }
                  >
                    <SortAscendingIcon sx={{ mr: 1 }} /> Sort alphabetically
                    (A-Z)
                  </Typography>
                ),
                onClick: () => handleSort(SortDirection.ASCENDING),
              },
              {
                id: SortDirection.DESCENDING,
                label: (
                  <Typography
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}
                    fontWeight={
                      currentSortDirection == SortDirection.DESCENDING
                        ? "bold"
                        : "normal"
                    }
                  >
                    <SortDescendingIcon sx={{ mr: 1 }} /> Sort alphabetically
                    (Z-A)
                  </Typography>
                ),
                onClick: () => handleSort(SortDirection.DESCENDING),
              },
            ]}
          />,
          <DownloadButton
            key="download"
            id={query.pid}
            entity="queries"
            format="json"
          />,
        ]}
      />

      <Paper sx={{ p: 2, gap: 2, display: "flex", flexDirection: "column" }}>
        <MaterialReactTable table={table} />
      </Paper>
    </Box>
  );
};

export default QueryResultsTable;
