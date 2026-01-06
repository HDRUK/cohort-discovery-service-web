import { Error as MuiErrorIcon } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

const ErrorIcon = ({ message }: { message?: string }) => {
  return (
    <Tooltip title={message}>
      <MuiErrorIcon color="error" />
    </Tooltip>
  );
};

export default ErrorIcon;
