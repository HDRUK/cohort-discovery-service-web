import { Skeleton, Stack } from "@mui/material";
import ConceptScanDetails from "./ConceptScanDetails";
import ResultFilesTable from "./ResultFilesTable";
import { getConceptScanDetailsData, getScanSummary } from "./scanSummary";
import useCollectionDetails from "./useCollectionDetails";

const CollectionDetails = ({ pid }: { pid: string }) => {
  const { data: details, isLoading } = useCollectionDetails(pid);

  if (isLoading) return <Skeleton />;

  const summary = getScanSummary(details);

  return (
    <Stack direction={"column"} gap={2}>
      <ConceptScanDetails
        pid={pid}
        data={getConceptScanDetailsData(details, summary)}
      />
      <ResultFilesTable
        pid={pid}
        files={details?.result_files ?? []}
        successfulFileId={summary.successful?.id}
      />
    </Stack>
  );
};

export default CollectionDetails;
