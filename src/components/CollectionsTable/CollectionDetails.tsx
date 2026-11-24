import { useTable } from "@/hooks/useTable";
import { ResultFile } from "@/types/api";
import {
  Box,
  Chip,
  Skeleton,
  Stack,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { MRT_ColumnDef } from "material-react-table";
import { ReactNode, useMemo } from "react";
import Table from "../Table";
import Title from "../Title";
import { formatNumber } from "@/utils/numbers";
import { getDatetime } from "@/utils/date";
import useCollectionDetails from "./useCollectionDetails";
import {
  getLatestAttemptLabel,
  getScanSummary,
  isConceptFile,
  isEmptyConceptFile,
} from "./scanSummary";

const SCAN_REGION_NAME = "Last successful concept scan";

interface DetailRow {
  label: string;
  value: ReactNode;
}

const ConceptScanChip = ({
  file,
  successfulFileId,
}: {
  file: ResultFile;
  successfulFileId?: number;
}) => {
  if (file.id === successfulFileId) {
    return (
      <Chip
        size="small"
        variant="outlined"
        color="success"
        label="Used for concept count"
      />
    );
  }

  if (isEmptyConceptFile(file)) {
    return (
      <Chip
        size="small"
        variant="outlined"
        color="warning"
        label="Empty (0 rows)"
      />
    );
  }

  if (isConceptFile(file) && file.status === "failed") {
    return (
      <Chip size="small" variant="outlined" color="error" label="Failed" />
    );
  }

  return null;
};

const CollectionDetails = ({ pid }: { pid: string }) => {
  const { data: details, isLoading } = useCollectionDetails(pid);

  const { successful, latest } = getScanSummary(details);
  const latestFailed = latest?.status === "failed";
  const showLatestAttempt = !!latest && latest.id !== successful?.id;

  const detailRows: DetailRow[] = [
    ...(successful
      ? [
          { label: "Task ID", value: successful.task?.id },
          { label: "Result file ID", value: successful.id },
          { label: "Name", value: successful.file_description },
          {
            label: "Completed at",
            value: getDatetime(
              successful.task?.completed_at ?? successful.created_at,
            ),
          },
          {
            label: "Rows processed",
            value: formatNumber(successful.rows_processed),
          },
          {
            label: "Number of concepts",
            value: formatNumber(details?.nconcepts),
          },
        ]
      : [
          {
            label: "Number of concepts",
            value: "No successful concept scan yet",
          },
        ]),
    ...(showLatestAttempt
      ? [
          {
            label: "Latest attempt",
            value: (
              <Chip
                size="small"
                variant="outlined"
                color={latestFailed ? "error" : "warning"}
                label={getLatestAttemptLabel(latest)}
              />
            ),
          },
        ]
      : []),
    { label: "Collection created", value: getDatetime(details?.created_at) },
    { label: "Collection updated", value: getDatetime(details?.updated_at) },
  ];

  const filesColumns = useMemo<MRT_ColumnDef<ResultFile>[]>(
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
        accessorFn: (row) => getDatetime(row.task?.completed_at ?? undefined),
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
        Cell: ({ row }) => (
          <ConceptScanChip
            file={row.original}
            successfulFileId={successful?.id}
          />
        ),
      },
    ],
    [successful?.id],
  );

  const filesTable = useTable<ResultFile>({
    enableRowSelection: false,
    columns: filesColumns,
    data: details?.result_files ?? [],
  });

  if (isLoading) return <Skeleton />;

  return (
    <Stack direction={"column"} gap={2}>
      <Box role="region" aria-label={SCAN_REGION_NAME}>
        <Title title="Details" subTitle={pid} />
        <Title title={SCAN_REGION_NAME} size="small" useSeparator={false} />
        <MuiTable size="small">
          <TableBody>
            {detailRows.map((row) => (
              <TableRow key={row.label}>
                <TableCell sx={{ fontWeight: 600, width: "40%" }}>
                  {row.label}
                </TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </Box>
      <Table
        table={filesTable}
        leftAction={{
          titleProps: {
            title: "Result Files",
            subTitle: pid,
          },
        }}
      />
    </Stack>
  );
};

export default CollectionDetails;
