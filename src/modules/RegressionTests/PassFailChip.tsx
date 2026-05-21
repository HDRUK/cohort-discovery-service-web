import { Chip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const PassFailChip = ({ value }: { value: boolean | null | undefined }) => {
  if (value === true)
    return (
      <Chip icon={<CheckIcon />} label="Pass" color="success" size="small" />
    );
  if (value === false)
    return (
      <Chip icon={<CloseIcon />} label="Fail" color="error" size="small" />
    );
  return null;
};

export default PassFailChip;
