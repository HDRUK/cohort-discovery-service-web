"use client";

import { Stack } from "@mui/material";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { TermDirectoryEntry, Paginated } from "@/types/api";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import CopyableTextButton from "@/components/CopyableTextButton";
import Table from "@/components/Table";
import { formatNumber } from "@/utils/numbers";
import { DEFAULT_PER_PAGE } from "@/config/defaults";
import DomainFilterTabs from "./DomainFilterTabs";
import AssociatedCollectionsChip from "./AssociatedCollectionsChip";

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
        Cell: ({ cell }) => (
          <Stack direction="row" alignItems="center">
            {cell.getValue<number>()}
            <CopyableTextButton
              text={String(cell.getValue<number>())}
              size="small"
              ariaLabel={`Copy OMOP ID ${cell.getValue<number>()}`}
            />
          </Stack>
        ),
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
        Cell: ({ cell }) => (
          <AssociatedCollectionsChip count={cell.getValue<number>()} />
        ),
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
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
    getRowId: (row) => String(row?.concept_id),
    enableStickyHeader: true,
    enableSorting: false,
  });

  return (
    <Table
      table={table}
      emptyMessage="No terms found."
      leftAction={{
        searchProps: {
          placeholder: "Search by term name or OMOP ID...",
        },
      }}
      details={<DomainFilterTabs />}
      boxSxProps={{
        "& > .MuiGrid-container": {
          bgcolor: "table.main",
          p: 1,
          borderRadius: 1,
        },
      }}
    />
  );
};

export default TermDirectory;
