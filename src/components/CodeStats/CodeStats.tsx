"use client";

import { formatNumber } from "@/utils/numbers";
import { usePaginatedTable } from "../../hooks/usePaginatedTable";
import { CodeStat, Paginated } from "../../types/api";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";

const DEFAULT_PER_PAGE = 20;

const CodeStats = ({ codes }: { codes: Paginated<CodeStat[]> }) => {
  const columns = useMemo<MRT_ColumnDef<CodeStat>[]>(
    () => [
      {
        id: "name",
        header: "OMOP code",
        accessorFn: (row) => row.name,
        size: 20,
      },
      {
        id: "description",
        header: "Description",
        accessorFn: (row) => row.description,
        Cell: ({ cell }) => (
          <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            {cell.getValue<string>()}
          </div>
        ),
        size: 400,
        maxSize: 400,
      },
      {
        id: "category",
        header: "Category",
        accessorFn: (row) => row.category,
        minSize: 30,
      },
      {
        id: "count",
        header: "Total Count",
        accessorFn: (row) => row.total_count,
        Cell: ({ cell }) => formatNumber(cell.getValue<number>()),
        minSize: 30,
      },
      {
        id: "ndatasets",
        header: "Number of datasets",
        accessorFn: (row) => row.collections_count,
        size: 70,
        maxSize: 70,
        Cell: ({ cell }) => cell.getValue<number>(),
      },
      {
        id: "pdatasets",
        header: "Percentage of datasets",
        accessorFn: (row) => row.collections_pct,
        Cell: ({ cell }) => <> {cell.getValue<number>()} %</>,
      },
    ],
    []
  );

  const table = usePaginatedTable<CodeStat>({
    columns,
    data: codes.data,
    rowCount: codes.total,
    perPageDefault: DEFAULT_PER_PAGE,
    getRowId: (row) => row.name,
  });

  return <MaterialReactTable table={table} />;
};

export default CodeStats;
