import { CollectionWithHosts, DistributionType } from "@/types/api";
import { Box, Stack, Typography } from "@mui/material";
import FormLabel from "@/components/FormLabel";
import { ReRunButton } from "./ReRunButton";
import { useLogDependencyChanges } from "@/utils/deps";
import { useCallback } from "react";
import LastDistributionChip from "./LastDistributionChip";
import { useRouter } from "next/navigation";
import MetadataPanel from "@/components/MetadataPanel";
import rerunDistributions from "@/actions/rerunDistributions";

const DistributionStatus = ({
  collection,
  disabled = false,
}: {
  collection: CollectionWithHosts;
  disabled?: boolean;
}) => {
  const latestDemographicFile =
    collection.latest_successful_demographic_result_file;
  const latestConceptFile = collection.latest_successful_concept_result_file;

  const handleRunDemographicsNow = useCallback(async () => {
    const { data } = await rerunDistributions(collection.pid, {
      query_type: DistributionType.DEMOGRAPHICS,
    });
    return data;
  }, [collection]);

  const handleRunConceptsNow = useCallback(async () => {
    const { data } = await rerunDistributions(collection.pid, {
      query_type: DistributionType.GENERIC,
    });
    return data;
  }, [collection]);

  const router = useRouter();
  const handleRefresh = () => router.refresh();

  useLogDependencyChanges("DistributionStatus", {
    collection,
    handleRunDemographicsNow,
    handleRunConceptsNow,
  });

  const metadata = collection?.latest_metadata;

  return (
    <Stack spacing={1} height={"100%"} justifyContent={"center"}>
      <FormLabel underlined> Distribution Status</FormLabel>
      <Box>
        <Typography variant="body2" component={"div"}>
          Demographics:{" "}
          <LastDistributionChip file={latestDemographicFile}>
            {!disabled && (
              <ReRunButton
                onClick={handleRunDemographicsNow}
                onSuccess={handleRefresh}
              />
            )}
          </LastDistributionChip>
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2" component={"div"}>
          Concepts:{" "}
          <LastDistributionChip file={latestConceptFile}>
            {!disabled && (
              <ReRunButton
                onClick={handleRunConceptsNow}
                onSuccess={handleRefresh}
              />
            )}
          </LastDistributionChip>
        </Typography>
      </Box>

      {metadata && <MetadataPanel metadata={metadata} />}
    </Stack>
  );
};

export default DistributionStatus;
