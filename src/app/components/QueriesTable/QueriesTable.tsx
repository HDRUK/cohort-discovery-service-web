"use client";

import { useDaphneStore } from "@/store/useDaphneStore";

import { useEffect } from "react";
import { Query, Paginated } from "@/types/api";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Grid, Paper } from "@mui/material";
import dayjs from "dayjs";
import TaskResults from "@/components/TaskResults";
import { getNaturalLanguage } from "@/utils/queryBuilder";
import { Field } from "react-querybuilder";
import { revalidateAction } from "@/actions/revalidate";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/utils/numbers";
import Link from "next/link";
import { Link as MuiLink } from "@mui/material";
import { routes } from "@/config/routes";

const QueriesTable = ({
  queries,
  hasIncomplete,
  fields,
}: {
  queries: Paginated<Query[]>;
  hasIncomplete: boolean;
  fields: Field[];
}) => {
  const router = useRouter();
  const {
    queryBuilder: { setQueryBuilderJson, setSelectedDatasets },
  } = useDaphneStore();

  useEffect(() => {
    if (!hasIncomplete) return;
    const interval = setInterval(() => {
      revalidateAction("queries");
    }, 1000);
    return () => clearInterval(interval);
  }, [hasIncomplete]);

  const columns: MRT_ColumnDef<Query>[] = [
    {
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
              pathname: routes.dashboardNewQuery,
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
      minSize: 80,
      maxSize: 80,
      Cell: ({ cell }) => cell.getValue<string>(),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      minSize: 80,
      maxSize: 150,
      Cell: ({ cell }) =>
        dayjs(cell.getValue<string>()).format("MMM D, YYYY h:mm A"),
    },
    {
      accessorFn: (row) => row.tasks?.length ?? 0,
      id: "tasks",
      header: "Dataset Count",
      minSize: 50,
      maxSize: 80,
      Cell: ({ cell }) => cell.getValue<number>().toString(),
    },
    {
      id: "total",
      header: "Total Count",
      minSize: 50,
      maxSize: 80,
      Cell: ({ cell }) => formatNumber(cell.getValue<number>()),
      accessorFn: (row) => {
        const tasks = row.tasks || [];
        const count = tasks
          .filter((t) => t.completed_at !== null)
          .filter((t) => !!t.result)
          .reduce((sum, t) => sum + (t.result?.count || 0), 0);
        return count;
      },
    },
    {
      id: "percentComplete",
      header: "Percent Complete",
      minSize: 50,
      maxSize: 80,
      accessorFn: (row) => {
        const tasks = row.tasks || [];
        if (tasks.length === 0) return "0%";
        const completedCount = tasks.filter(
          (t) => t.completed_at !== null
        ).length;
        const percent = Math.round((completedCount / tasks.length) * 100);
        return `${percent}%`;
      },
      Cell: ({ cell }) => (
        <span data-testid="percent-complete">{cell.getValue<string>()}</span>
      ),
    },
  ];

  const table = usePaginatedTable<Query>({
    columns,
    data: queries.data,
    rowCount: queries.total,
    perPageDefault: queries.per_page,
    expandFirstRow: true,
    renderDetailPanel: ({ row }) => (
      <Grid
        container
        spacing={2}
        sx={{
          p: 4,
          borderRadius: 4,
          border: 1,
          borderColor: "grey.300",
          backgroundColor: "#fff",
        }}
      >
        <Grid size={12}>
          <TaskResults tasks={row.original.tasks} />
        </Grid>
        <Grid size={6}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor: "grey.200",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: "grey.300",
                boxShadow: 3,
              },
            }}
            onClick={() => {
              if (row.original.definition) {
                setQueryBuilderJson(row.original.definition);
                setSelectedDatasets(
                  row.original.tasks.map((t) => t.collection.pid)
                );
                router.push("new-query");
              }
            }}
          >
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
              }}
            >
              {getNaturalLanguage(row.original.definition, fields)}
            </pre>
          </Paper>
        </Grid>
      </Grid>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default QueriesTable;
