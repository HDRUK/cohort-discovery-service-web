"use client";

import { useDaphneStore } from "@/store/useDaphneStore";
import { useEffect, useState } from "react";
import { Query, Paginated } from "@/types/api";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import CodeIcon from "@mui/icons-material/Code";
import { Box, Grid, Paper } from "@mui/material";
import dayjs from "dayjs";
import CodeBlock from "@/components/CodeBlock";
import ShowOnClick from "@/components/ShowOnClick";
import TaskResults from "@/components/TaskResults";
import { getNaturalLanguage } from "@/utils/queryBuilder";
import { useTable } from "@/hooks/useTable";
import { Field } from "react-querybuilder";
import { revalidateAction } from "@/actions/revalidate";
import { useRouter, useSearchParams } from "next/navigation";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";

const QueriesTable = ({
  queries,
  hasIncomplete,
  fields,
}: {
  queries: Paginated<Query[]>;
  hasIncomplete: boolean;
  fields: Field[];
}) => {
  const {
    queryBuilder: { setQueryBuilderJson },
  } = useDaphneStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(
    searchParams.get("per_page") || queries.per_page.toString()
  );

  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: perPage,
  });

  useEffect(() => {
    const page = pagination.pageIndex + 1;
    const per_page = pagination.pageSize;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    params.set("per_page", per_page.toString());

    router.replace(`?${params.toString()}`);
  }, [pagination.pageIndex, pagination.pageSize, router, searchParams]);

  useEffect(() => {
    if (!hasIncomplete) return;
    const interval = setInterval(() => {
      revalidateAction("queries");
    }, 1000);
    return () => clearInterval(interval);
  }, [hasIncomplete]);

  const columns: MRT_ColumnDef<Query>[] = [
    {
      accessorKey: "created_at",
      header: "Created",
      minSize: 80,
      maxSize: 150,
      Cell: ({ cell }) =>
        dayjs(cell.getValue<string>()).format("MMM D, YYYY h:mm A"),
    },
    {
      accessorKey: "pid",
      header: "Identifier",
      minSize: 80,
      maxSize: 150,
    },
    {
      id: "query",
      header: "Raw Query",
      accessorFn: (row) => {
        return (
          <ShowOnClick icon={<CodeIcon />}>
            <CodeBlock code={row.definition} />
          </ShowOnClick>
        );
      },
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
      <Grid container spacing={2}>
        <Grid size={5}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor: "grey.100",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: "grey.200",
                boxShadow: 3,
              },
            }}
            onClick={() => {
              if (row.original.definition) {
                setQueryBuilderJson(row.original.definition);
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
        <Grid size={7}>
          <TaskResults tasks={row.original.tasks} />
        </Grid>
      </Grid>
    ),
  });

  return (
    <Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default QueriesTable;
