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
import useHoverable from "@/hooks/useHoverable";

export type AddChipProps = Omit<ChipProps, "action" | "onClick"> & {
  label: string;
  onClick: () => void | Promise<void>;
  hoverKey?: string;
};

const AddChip = ({
  label,
  onClick,
  disabled,
  hoverKey,
  sx,
  ...rest
}: AddChipProps) => {
  const { compact } = useActionMenuSection();
  const [loading, setLoading] = useState(false);
  console.log("addchip", label);
  const { setHoverRef, isHighlighted } = useHoverable<HTMLDivElement>(hoverKey);
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
          ref={setHoverRef}
          variant="outlined"
          icon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          disabled={isDisabled}
          onClick={handleClick}
          sx={{
            ...sx,
            justifyContent: "flex-start",
            textAlign: "left",
            py: 2,
            pl: 1,
            pr: 0.5,
            color: "text.primary",
            backgroundColor: isHighlighted ? "grey.300" : "white",
            borderColor: "text.secondary",
            borderWidth: "1px",
            "&.MuiChip-root:hover": {
              backgroundColor: isHighlighted ? "grey.300" : "white",
            },
          }}
          label={label}
          {...rest}
        />
      )}
    </>
  );
};

export default AddChip;
