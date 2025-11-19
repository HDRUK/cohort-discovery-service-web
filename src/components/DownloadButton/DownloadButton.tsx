"use client";

import { IconButton } from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";

interface DownloadButtonProps {
  id: string;
  entity: string;
  format?: "json" | "csv";
}

const DownloadButton = ({
  id,
  entity,
  format = "json",
}: DownloadButtonProps) => {
  return (
    <IconButton href={`/api/download/${id}?entity=${entity}&format=${format}`}>
      <DownloadIcon />
    </IconButton>
  );
};

export default DownloadButton;
