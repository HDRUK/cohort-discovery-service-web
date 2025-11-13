import { Switch as MuiSwitch, Box } from "@mui/material";
import { SwitchProps } from "@mui/material/Switch";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export const Switch = (props: SwitchProps) => (
  <Box sx={{ p: 1 }}>
    <MuiSwitch
      icon={
        <CloseIcon
          fontSize="small"
          sx={{ color: "white", bgcolor: "error.main", borderRadius: 10 }}
        />
      }
      checkedIcon={
        <CheckIcon
          fontSize="small"
          sx={{ color: "white", bgcolor: "#3db28c", borderRadius: 10 }}
        />
      }
      {...props}
    />
  </Box>
);
