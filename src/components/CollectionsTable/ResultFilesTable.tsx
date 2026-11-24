import { CONCEPT_SCAN_CHIPS } from "@/config/conceptScan";
import { useTable } from "@/hooks/useTable";
import { ResultFile } from "@/types/api";
import { getDatetime } from "@/utils/date";
import { MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import Table from "../Table";
import ConceptScanChip from "./ConceptScanChip";
import { getConceptScanChipState } from "./scanSummary";

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

          return state && <ConceptScanChip {...CONCEPT_SCAN_CHIPS[state]} />;
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
