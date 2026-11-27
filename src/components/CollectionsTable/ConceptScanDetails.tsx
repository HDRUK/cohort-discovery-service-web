import { useTransposedTable } from "@/hooks/useTransposedTable";
import { ConceptScanDetailsData } from "@/types/collections";
import { getDatetime } from "@/utils/date";
import { formatNumber } from "@/utils/numbers";
import { Chip, Typography } from "@mui/material";
import Table from "../Table";
import { getLatestAttempt } from "./scanSummary";

interface ConceptScanDetailsProps {
  pid: string;
  data: ConceptScanDetailsData;
}

const ConceptScanDetails = ({ pid, data }: ConceptScanDetailsProps) => {
  const table = useTransposedTable<ConceptScanDetailsData>({
    data,
    labels: {
      last_successful_scan: "Last successful scan",
      task_id: "Task ID",
      result_file_id: "Result file ID",
      name: "Name",
      completed_at: "Completed at",
      rows_processed: "Rows processed",
      nconcepts: "Number of concepts",
      latest_attempt: "Latest attempt",
    },
    formatters: {
      completed_at: (value) => getDatetime(value),
      rows_processed: (value) => formatNumber(value),
      nconcepts: (value) => formatNumber(value),
      latest_attempt: (file) => {
        if (!file) return null;

        const { label, color } = getLatestAttempt(file);

        return (
          <Chip size="small" variant="outlined" color={color} label={label} />
        );
      },
    },
  });

  return (
    <Table
      table={table}
      leftAction={{
        titleProps: {
          title: "Concepts",
          subTitle: pid,
        },
      }}
      details={
        <Typography variant="body2" color="text.secondary">
          From the most recent scan that returned concepts.
        </Typography>
      }
    />
  );
};

export default ConceptScanDetails;
