import { useDaphneStore } from "@/store/useDaphneStore";
import { Collection } from "@/types/api";
import { getDate } from "@/utils/date";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";

const DistributionStatus = ({
  collection,
  disabled = false,
}: {
  collection: Collection;
  disabled?: boolean;
}) => {
  const demographic = collection.size;
  const latestConcept = collection.latest_concept;

  const rerunTask = useDaphneStore((s) => s.userData.rerunTask);

  const handleRunDemographicsNow = () => {
    const pid = demographic?.task?.pid;
    if (pid) {
      rerunTask(pid);
    }
  };

  const handleRunConceptsNow = () => {
    const pid = latestConcept?.task?.pid;
    if (pid) {
      rerunTask(pid);
    }
  };

  return (
    <Stack spacing={1} height={"100%"}>
      <Typography> Distribution (Demographics) Status</Typography>
      <Box>
        <Chip label={`Last Distribution ${getDate(demographic?.created_at)}`} />
        {!disabled && (
          <Button
            color="inherit"
            size="small"
            variant="text"
            onClick={handleRunDemographicsNow}
          >
            Run now
          </Button>
        )}
      </Box>

      <Typography> Distribution (Generic) Status</Typography>
      <Box>
        <Chip
          label={`Last Distribution ${getDate(latestConcept?.created_at)}`}
        />
        {!disabled && (
          <Button
            color="inherit"
            size="small"
            variant="text"
            onClick={handleRunConceptsNow}
          >
            Run now
          </Button>
        )}
      </Box>
    </Stack>
  );
};

export default DistributionStatus;
