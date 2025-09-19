"use client";
import { useState } from "react";
import { IconButton, CircularProgress, Tooltip } from "@mui/material";
import { DeleteForeverRounded } from "@mui/icons-material";

interface ActionDeleteButtonProps {
  onDelete?: () => Promise<void>;
}

const ActionDeleteButton = ({ onDelete }: ActionDeleteButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onDelete?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title={loading ? "Deleting…" : "Delete"}>
      <span>
        <IconButton
          onClick={handleClick}
          disabled={loading}
          aria-label="delete concept"
          size="small"
        >
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <DeleteForeverRounded color="error" />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default ActionDeleteButton;
