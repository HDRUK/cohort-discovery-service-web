"use client";

import useQueryBuilder from "@/store/useQueryBuilder";

import { useEffect, useState } from "react";
import { Query, Paginated } from "../../types/api";
import {
  MRT_ExpandedState,
  MRT_RowSelectionState,
  type MRT_ColumnDef,
} from "material-react-table";
import { Grid, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { revalidateAction } from "@/actions/revalidate";
import { usePaginatedTable } from "../../hooks/usePaginatedTable";
import { formatNumber } from "@/utils/numbers";
import Link from "next/link";
import { Link as MuiLink } from "@mui/material";
import { routes } from "../../config/routes";
import Table from "../Table";
import { getTasksStatus, getTotalAllTasks } from "@/utils/tasks";
import QueryResultsTable from "../QueryResultsTable";
import ControlledSearchBox from "@/modules/ControlledSearchBox";
import Title from "../Title";
import { queryToText } from "@/utils/queryBuilder";
import { useRouter } from "next/navigation";

interface QueriesTableProps {
  queries: Paginated<Query[]>;
  hasIncomplete: boolean;
  columnVisibility?: Record<string, boolean>;
}

const QueriesTable = ({
  queries,
  hasIncomplete,
  columnVisibility = { pid: false, "mrt-row-expand": false },
}: QueriesTableProps) => {
  const router = useRouter();

  const { setQueryBuilderJson, setSelectedDatasets } = useQueryBuilder(
    (qb) => ({
      setSelectedDatasets: qb.setSelectedDatasets,
      setQueryBuilderJson: qb.setQueryBuilderJson,
    })
  );

  useEffect(() => {
    if (!hasIncomplete) return;
    const interval = setInterval(() => {
      revalidateAction("queries");
    }, 1000);
    return () => clearInterval(interval);
  }, [hasIncomplete]);

  const columns: MRT_ColumnDef<Query>[] = [
    {
      id: "pid",
      accessorKey: "pid",
      header: "Query ID",
      minSize: 80,
      maxSize: 150,
      Cell: ({ cell, row }) => {
        const pid = cell.getValue<string>();
        return (
          <MuiLink
            component={Link}
            href={{
              pathname: routes.dashboardNewQuery(pid),
              query: { query: pid },
            }}
            onClick={() => {
              setSelectedDatasets(
                row.original.tasks.map((t) => t.collection.pid)
              );
            }}
          >
            {pid}
          </MuiLink>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Query Name",
      minSize: 100,
      maxSize: 300,
      Cell: ({ cell }) => cell.getValue<string>(),
    },
    {
      accessorKey: "created_at",
      header: "Started(UTC)",
      minSize: 80,
      maxSize: 80,
      Cell: ({ cell }) =>
        dayjs(cell.getValue<string>()).format("DD/MM/YYYY, HH:MM:ss"),
    },
    {
      id: "status",
      accessorFn: (row) => getTasksStatus(row.tasks),
      header: "Status",
      minSize: 50,
      maxSize: 80,
      Cell: ({ cell }) => cell.getValue<string>().toString(),
    },
    {
      id: "total",
      header: "Total",
      minSize: 50,
      maxSize: 80,
      Cell: ({ cell }) => formatNumber(cell.getValue<number>()),
      accessorFn: (row) => {
        const tasks = row.tasks || [];
        return getTotalAllTasks(tasks);
      },
    },
  ];

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({
    [queries.data[0]?.pid]: true,
  });
  const [expanded, setExpanded] = useState<MRT_ExpandedState>({
    [queries.data[0]?.pid]: true,
  });

  const table = usePaginatedTable<Query>({
    columns,
    data: queries.data,
    enableSorting: false,
    rowCount: queries.total,
    perPageDefault: queries.per_page,
    expandFirstRow: true,
    initialState: { columnVisibility },
    enableRowSelection: true,
    manualExpanding: true,
    enableExpanding: true,
    onRowSelectionChange: (updaterOrValue) => {
      setRowSelection((prev) => {
        const nextSelection =
          typeof updaterOrValue === "function"
            ? updaterOrValue(prev)
            : updaterOrValue;

        setExpanded(() => {
          const nextExpanded: Record<string, boolean> = {};
          for (const rowId of Object.keys(nextSelection)) {
            nextExpanded[rowId] = true;
          }
          return nextExpanded;
        });

        return nextSelection;
      });
    },
    state: {
      rowSelection,
      expanded,
    },
    renderDetailPanel: ({ row }) => (
      <Paper
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <QueryResultsTable
          query={row.original}
          useTableProps={{ enableRowSelection: false }}
          tableProps={{
            leftAction: (
              <Title title={row.original.name} subTitle={"Results"} />
            ),
            details: (
              <Grid container sx={{ pt: 1 }}>
                <Grid size={10}>
                  <Typography>
                    {queryToText(row.original.definition)}
                  </Typography>
                </Grid>
                <Grid size={1}>
                  <Typography>
                    Total{" "}
                    <b> {formatNumber(getTotalAllTasks(row.original.tasks))}</b>
                  </Typography>
                </Grid>
                <Grid size={1}>
                  <Typography>
                    {dayjs(row.original.created_at).format(
                      "DD/MM/YYYY, HH:MM:ss"
                    )}
                  </Typography>
                </Grid>
              </Grid>
            ),
            rightAction: {
              downloadProps: {
                id: row.original.pid,
                entity: "queries",
                format: "json",
              },
              refreshProps: { tag: row.original.pid, disabled: true },
              editProps: {
                onClick: () => {
                  setQueryBuilderJson(row.original.definition);
                  router.push(routes.dashboardNewQuery());
                },
              },
              deleteProps: { disabled: true },
            },
          }}
        />
      </Paper>
    ),
  });

  return (
    <Table
      table={table}
      leftAction={
        <ControlledSearchBox placeholder="Search your historical queries..." />
      }
      rightAction={{
        refreshProps: { tag: "queries" },
        downloadProps: { disabled: true },
        deleteProps: {
          disabled: true,
          onClick: (rows) => {
            // to be implemented...
            console.log(rows);
          },
        },
        sortProps: { field: "name" },
      }}
    />
  );
};

export default QueriesTable;
