import { useState } from "react";
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip,
  Box,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { CopyAllOutlined } from "@mui/icons-material";
import { useNotify } from "@/providers/NotifyProvider";

interface CopyableVariableProps {
  value: string | number;
  hidden?: boolean;
}

const CopyableVariable = ({ value, hidden = false }: CopyableVariableProps) => {
  const [show, setShow] = useState(!hidden);
  const notify = useNotify();

  const handleToggleShow = () => {
    setShow((prev) => !prev);
  };

  const handleCopy = async (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    await navigator.clipboard.writeText(String(value));
    notify.success("Copied to clipboard");
  };

  return (
    <Stack direction="row" alignItems="center">
      <TextField
        value={value}
        variant="filled"
        type={show ? "text" : "password"}
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: hidden ? (
              <InputAdornment position="end">
                <Tooltip title={show ? "Hide value" : "Show value"}>
                  <IconButton
                    aria-label={show ? "Hide value" : "Show value"}
                    onClick={handleToggleShow}
                    edge="end"
                    tabIndex={-1}
                  >
                    {show ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : undefined,
          },
        }}
        fullWidth
      />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <IconButton onClick={handleCopy}>
          <CopyAllOutlined />
        </IconButton>
      </Box>
    </Stack>
  );
};

export default CopyableVariable;
