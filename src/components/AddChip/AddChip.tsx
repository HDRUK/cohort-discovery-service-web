import {
  Chip,
  ChipProps,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useActionMenuSection } from "../ActionMenuSection";
import { useState } from "react";

export type AddChipProps = Omit<ChipProps, "action" | "onClick"> & {
  label: string;
  onClick: () => void | Promise<void>;
};

const AddChip = ({ label, onClick, disabled, ...rest }: AddChipProps) => {
  const { compact } = useActionMenuSection();
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    if (loading) return;
    e.stopPropagation();
    try {
      setLoading(true);
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = Boolean(disabled) || loading;

  return (
    <>
      {compact ? (
        <Tooltip title={`Add ${label}`} disableHoverListener={!compact}>
          <span>
            <IconButton disabled={isDisabled} onClick={handleClick}>
              {loading ? <CircularProgress size={20} /> : <AddIcon />}
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <Chip
          icon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          disabled={isDisabled}
          onClick={handleClick}
          sx={{
            justifyContent: "flex-start",
            textAlign: "left",
            color: "text.primary",
          }}
          label={label}
          {...rest}
        />
      )}
    </>
  );
};

export default AddChip;
