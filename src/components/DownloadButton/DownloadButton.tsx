"use client";

import { IconButton, IconButtonProps } from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";

export interface DownloadButtonProps
  extends Omit<IconButtonProps<"a">, "ref" | "href" | "component"> {
  id?: string;
  entity?: string;
  format?: "json" | "csv";
}

const DownloadButton = ({
  id,
  entity,
  format = "json",
  disabled,
  ...rest
}: DownloadButtonProps) => {
  return (
    <IconButton
      data-testid="download-button"
      {...rest}
      disabled={disabled}
      href={
        disabled || !id || !entity || !format
          ? "#"
          : `/api/download/${id}?entity=${entity}&format=${format}`
      }
    >
      <DownloadIcon />
    </IconButton>
  );
};

export default DownloadButton;
