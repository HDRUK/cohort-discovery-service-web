"use client";

import { Grid, Paper, Skeleton } from "@mui/material";
import { type MRT_ColumnDef } from "material-react-table";
import Table from "../Table";

const skeletonRows = Array.from({ length: 5 });

type SkeletonQuery = {
  created_at: React.ReactNode;
  pid: React.ReactNode;
  query: React.ReactNode;
  tasks: React.ReactNode;
  percentComplete: React.ReactNode;
};

const skeletonColumns: MRT_ColumnDef<SkeletonQuery>[] = [
  { accessorKey: "created_at", header: "Created" },
  { accessorKey: "pid", header: "Identifier" },
  { id: "query", header: "Raw Query" },
  { id: "tasks", header: "Dataset Count" },
  { id: "percentComplete", header: "Percent Complete" },
];

const QueriesTableSkeleton = () => {
  const data = skeletonRows.map(() => ({
    created_at: <Skeleton width={120} />,
    pid: <Skeleton width={80} />,
    query: <Skeleton width="100%" height={20} />,
    tasks: <Skeleton width={40} />,
    percentComplete: <Skeleton width={40} />,
  }));

  return (
    <Table
      columns={skeletonColumns}
      data={data}
      enablePagination={false}
      enableSorting={false}
      enableTopToolbar={false}
      enableBottomToolbar={false}
      state={{ isLoading: true }}
      muiTableBodyRowProps={{
        sx: { "& td": { verticalAlign: "middle" } },
      }}
      renderDetailPanel={() => (
        <Grid container spacing={2}>
          <Grid size={5}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                bgcolor: "grey.100",
              }}
            >
              <Skeleton height={80} />
            </Paper>
          </Grid>
          <Grid size={7}>
            <Skeleton variant="rectangular" height={80} />
          </Grid>
        </Grid>
      )}
    />
  );
};

export default QueriesTableSkeleton;
