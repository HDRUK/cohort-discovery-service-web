import { useDaphneStore } from "@/store/useDaphneStore";
import { CollectionWithHosts, DistributionType } from "@/types/api";
import { getDatetime } from "@/utils/date";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { ReRunButton } from "./ReRunButton";

const DistributionStatus = ({
  collection,
  disabled = false,
}: {
  collection: CollectionWithHosts;
  disabled?: boolean;
}) => {
  const demographic = collection.size;
  const latestConcept = collection.latest_concept;

  const runDistributions = useDaphneStore((s) => s.userData.runDistributions);

  const handleRunDemographicsNow = async () => {
    return await runDistributions(collection, DistributionType.DEMOGRAPHICS);
  };
  const handleRunConceptsNow = async () => {
    return await runDistributions(collection, DistributionType.GENERIC);
  };

  return (
    <Stack spacing={1} height={"100%"} justifyContent={"center"}>
      <Typography> Distribution Status</Typography>
      <Box sx={{ px: 1 }}>
        <Typography variant="body2" component={"div"}>
          Demographics:{" "}
          <Chip
            label={`Last Distribution ${getDatetime(demographic?.created_at)}`}
          />
          {!disabled && (
            <ReRunButton
              lastSuccessfullTask={demographic?.task}
              task={collection.latest_demographic_task}
              onClick={handleRunDemographicsNow}
            />
          )}
        </Typography>
      </Box>
      <Box sx={{ px: 1 }}>
        <Typography variant="body2" component={"div"}>
          Concepts:{" "}
          <Chip
            label={`Last Distribution ${getDatetime(
              latestConcept?.created_at
            )}`}
          />
          {!disabled && (
            <ReRunButton
              task={collection.latest_concept_task}
              lastSuccessfullTask={latestConcept?.task}
              onClick={handleRunConceptsNow}
            />
          )}
        </Typography>
      </Box>
    </Stack>
  );
};

export default DistributionStatus;
