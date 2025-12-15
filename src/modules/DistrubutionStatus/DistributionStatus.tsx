import { revalidateCustodian } from "@/actions/revalidate";
import { useDaphneStore } from "@/store/useDaphneStore";
import { Collection } from "@/types/api";
import { getDate } from "@/utils/date";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";

const DistributionStatus = ({ collection }: { collection: Collection }) => {
  const demographic = collection.size;
  const latestConcept = collection.latest_concept;

  const rerunTask = useDaphneStore((s) => s.userData.rerunTask);

  const handleRunDemographicsNow = () => {
    const pid = demographic?.task?.pid;
    if (pid) {
      rerunTask(pid);
      revalidateCustodian(collection.custodian);
    }
  };

  const handleRunConceptsNow = () => {
    const pid = latestConcept?.task?.pid;
    if (pid) {
      rerunTask(pid);
      revalidateCustodian(collection.custodian);
    }
  };

  return (
    <Stack spacing={1} height={"100%"}>
      <Typography> Distribution (Demographics) Status</Typography>
      <Box>
        <Chip label={`Last Distribution ${getDate(demographic?.created_at)}`} />
        <Button
          color="inherit"
          size="small"
          variant="text"
          onClick={handleRunDemographicsNow}
        >
          Run now
        </Button>
      </Box>

      <Typography> Distribution (Generic) Status</Typography>
      <Box>
        <Chip
          label={`Last Distribution ${getDate(latestConcept?.created_at)}`}
        />
        <Button
          color="inherit"
          size="small"
          variant="text"
          onClick={handleRunConceptsNow}
        >
          Run now
        </Button>
      </Box>
    </Stack>
  );
};

export default DistributionStatus;
