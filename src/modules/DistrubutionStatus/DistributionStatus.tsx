import { CollectionWithHosts, DistributionType } from "@/types/api";
import { getDatetime } from "@/utils/date";
import { Box, Chip, Stack, Typography } from "@mui/material";
import FormLabel from "@/components/FormLabel";
import { ReRunButton } from "./ReRunButton";
import { useLogDependencyChanges } from "@/utils/deps";
import useUserStore from "@/store/useUserStore";
import { useCallback } from "react";

const DistributionStatus = ({
  collection,
  disabled = false,
}: {
  collection: CollectionWithHosts;
  disabled?: boolean;
}) => {
  const demographic = collection.latest_demographic;
  const concept = collection.latest_concept;

  const runDistributions = useUserStore((s) => s.runDistributions);

  const handleRunDemographicsNow = useCallback(async () => {
    return await runDistributions(collection, DistributionType.DEMOGRAPHICS);
  }, [runDistributions, collection]);

  const handleRunConceptsNow = useCallback(async () => {
    return await runDistributions(collection, DistributionType.GENERIC);
  }, [runDistributions, collection]);

  useLogDependencyChanges("DistributionStatus", {
    collection,
    demographic,
    concept,
    handleRunDemographicsNow,
    handleRunConceptsNow,
  });

  return (
    <Stack spacing={1} height={"100%"} justifyContent={"center"}>
      <FormLabel underlined> Distribution Status</FormLabel>
      <Box>
        <Typography variant="body2" component={"div"}>
          Demographics:{" "}
          <Chip
            label={`Last Distribution ${getDatetime(demographic?.created_at)}`}
          />
          {!disabled && (
            <ReRunButton
              task={collection.latest_demographic_task}
              lastSuccessfullTask={demographic?.task}
              onClick={handleRunDemographicsNow}
            />
          )}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2" component={"div"}>
          Concepts:{" "}
          <Chip
            label={`Last Distribution ${getDatetime(concept?.created_at)}`}
          />
          {!disabled && (
            <ReRunButton
              task={collection.latest_concept_task}
              lastSuccessfullTask={concept?.task}
              onClick={handleRunConceptsNow}
            />
          )}
        </Typography>
      </Box>
    </Stack>
  );
};

export default DistributionStatus;
