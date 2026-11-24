import {
  CONCEPT_SCAN_DESCRIPTION,
  CONCEPT_SCAN_DETAIL_LABELS,
} from "@/config/conceptScan";
import { useTransposedTable } from "@/hooks/useTransposedTable";
import { ConceptScanDetailsData } from "@/types/collections";
import { getDatetime } from "@/utils/date";
import { formatNumber } from "@/utils/numbers";
import { Typography } from "@mui/material";
import Table from "../Table";
import ConceptScanChip from "./ConceptScanChip";
import { getLatestAttempt } from "./scanSummary";

interface ConceptScanDetailsProps {
  pid: string;
  data: ConceptScanDetailsData;
}

const ConceptScanDetails = ({ pid, data }: ConceptScanDetailsProps) => {
  const table = useTransposedTable<ConceptScanDetailsData>({
    data,
    labels: CONCEPT_SCAN_DETAIL_LABELS,
    formatters: {
      completed_at: (value) => getDatetime(value),
      rows_processed: (value) => formatNumber(value),
      nconcepts: (value) => formatNumber(value),
      latest_attempt: (file) =>
        file && <ConceptScanChip {...getLatestAttempt(file)} />,
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
          {CONCEPT_SCAN_DESCRIPTION}
        </Typography>
      }
    />
  );
};

export default ConceptScanDetails;
