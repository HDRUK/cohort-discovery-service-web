import { getCollectionStatus } from "@/utils/colours";
import { Chip, ChipProps } from "@mui/material";

interface StatusChipProps extends ChipProps {
  state_id?: number;
}
const StatusChip = ({ state_id, ...restProps }: StatusChipProps) => {
  if (state_id) {
    const { label, color } = getCollectionStatus(state_id);
    return <Chip label={label} color={color} {...restProps} />;
  }
  return;
};

export default StatusChip;
