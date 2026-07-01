"use client";

import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { TermDirectoryEntry, Paginated } from "@/types/api";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import Table from "@/components/Table";
import { formatNumber } from "@/utils/numbers";
import { DEFAULT_PER_PAGE } from "@/config/defaults";

const TermDirectory = ({
  entries,
}: {
  entries: Paginated<TermDirectoryEntry>;
}) => {
  const columns = useMemo<MRT_ColumnDef<TermDirectoryEntry>[]>(
    () => [
      {
        id: "concept_id",
        header: "OMOP ID",
        accessorFn: (row) => row.concept_id,
        size: 120,
      },
      {
        id: "concept_name",
        header: "Term Name",
        accessorFn: (row) => row.concept_name,
        size: 400,
      },
      {
        id: "count",
        header: "Count",
        accessorFn: (row) => row.count,
        Cell: ({ cell }) => formatNumber(cell.getValue<number>()),
        size: 100,
      },
      {
        id: "ncollections",
        header: "Associated Collections",
        accessorFn: (row) => row.ncollections,
        size: 160,
      },
    ],
    [],
  );

  const table = usePaginatedTable<TermDirectoryEntry>({
    columns,
    data: entries.data,
    rowCount: entries.total,
    perPageDefault: DEFAULT_PER_PAGE,
    getRowId: (row) => String(row.concept_id),
    enableStickyHeader: true,
  });

  return <Table table={table} emptyMessage="No terms found." />;
};

export default TermDirectory;
