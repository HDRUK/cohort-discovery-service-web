import { useTable } from "@/hooks/useTable";
import { ResultFile } from "@/types/api";
import {
  ConceptScanChipConfig,
  ConceptScanChipState,
} from "@/types/collections";
import { getDatetime } from "@/utils/date";
import { Chip } from "@mui/material";
import { MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import Table from "../Table";
import { getConceptScanChipState } from "./scanSummary";

const CONCEPT_SCAN_CHIPS: Record<ConceptScanChipState, ConceptScanChipConfig> =
  {
    used: { label: "Used for concept count", color: "success" },
    empty: { label: "Empty (0 rows)", color: "warning" },
    failed: { label: "Failed", color: "error" },
  };

interface ResultFilesTableProps {
  pid: string;
  files: ResultFile[];
  successfulFileId?: number;
}

const ResultFilesTable = ({
  pid,
  files,
  successfulFileId,
}: ResultFilesTableProps) => {
  const columns = useMemo<MRT_ColumnDef<ResultFile>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "task.id",
        header: "Task ID",
        accessorFn: (row) => row.task.id,
      },
      {
        accessorKey: "task.completed_at",
        header: "Completed At",
        accessorFn: (row) => getDatetime(row.task.completed_at ?? undefined),
      },
      {
        accessorKey: "file_description",
        header: "Name",
      },
      {
        accessorKey: "rows_processed",
        header: "Rows Processed",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        id: "concept_scan",
        header: "Concept scan",
        Cell: ({ row }) => {
          const state = getConceptScanChipState(row.original, successfulFileId);
          if (!state) return null;

          const { label, color } = CONCEPT_SCAN_CHIPS[state];

          return (
            <Chip size="small" variant="outlined" color={color} label={label} />
          );
        },
      },
    ],
    [successfulFileId],
  );

  const table = useTable<ResultFile>({
    enableRowSelection: false,
    columns,
    data: files,
  });

  return (
    <Table
      table={table}
      leftAction={{
        titleProps: {
          title: "Result Files",
          subTitle: pid,
        },
      }}
    />
  );
};

export default ResultFilesTable;
