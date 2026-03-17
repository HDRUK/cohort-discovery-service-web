import { CollectionWithHosts, DistributionType } from "@/types/api";
import { getDatetime } from "@/utils/date";
import { Box, Chip, Stack, Typography } from "@mui/material";
import FormLabel from "@/components/FormLabel";
import { ReRunButton } from "./ReRunButton";
import { useLogDependencyChanges } from "@/utils/deps";
import useUserStore from "@/hooks/useUserStore";
import { useCallback } from "react";
import LastDistributionChip from "./LastDistributionChip";

const DistributionStatus = ({
  collection,
  disabled = false,
}: {
  collection: CollectionWithHosts;
  disabled?: boolean;
}) => {
  const latestDemographicTask = collection.latest_demographic_task;
  const latestConceptTask = collection.latest_concept_task;

  const runDistributions = useUserStore((s) => s.runDistributions);

  const handleRunDemographicsNow = useCallback(async () => {
    return await runDistributions(collection, DistributionType.DEMOGRAPHICS);
  }, [runDistributions, collection]);

  const handleRunConceptsNow = useCallback(async () => {
    return await runDistributions(collection, DistributionType.GENERIC);
  }, [runDistributions, collection]);

  useLogDependencyChanges("DistributionStatus", {
    collection,
    handleRunDemographicsNow,
    handleRunConceptsNow,
  });

  return (
    <Stack spacing={1} height={"100%"} justifyContent={"center"}>
      <FormLabel underlined> Distribution Status</FormLabel>
      <Box>
        <Typography variant="body2" component={"div"}>
          Demographics:{" "}
          <LastDistributionChip
            task={latestDemographicTask}
            onRunNow={handleRunDemographicsNow}
            disabled={disabled}
          />
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2" component={"div"}>
          Concepts:{" "}
          <LastDistributionChip
            task={latestConceptTask}
            disabled={disabled}
            onRunNow={handleRunConceptsNow}
          />
        </Typography>
      </Box>
    </Stack>
  );
};

export default DistributionStatus;
