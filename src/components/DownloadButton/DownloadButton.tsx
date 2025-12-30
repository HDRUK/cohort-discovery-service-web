"use client";

import { IconButtonProps } from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import PositionedMenu, { PositionedMenuItem } from "../PositionedMenu";
import { useNotify } from "@/providers/NotifyProvider";

export enum AvailableFormats {
  JSON = "json",
  CSV = "csv",
}

export interface DownloadButtonProps
  extends Omit<IconButtonProps<"a">, "ref" | "href" | "component"> {
  id?: string;
  entity?: string;
  formats?: AvailableFormats[];
}

const DownloadButton = ({
  id,
  entity,
  formats = [AvailableFormats.JSON],
  disabled,
  ...rest
}: DownloadButtonProps) => {
  const notify = useNotify();

  const download = (format: AvailableFormats) => {
    if (disabled || !id || !entity) return;

    const url = `/api/download/${encodeURIComponent(
      id
    )}?entity=${encodeURIComponent(entity)}&format=${encodeURIComponent(
      format
    )}`;

    const a = document.createElement("a");
    a.href = url;
    a.target = "_self";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
    notify.success(`Downloading ${entity} as ${format} has started`);
  };

  const items: PositionedMenuItem[] = formats.map((format) => ({
    id: format,
    label: format.toUpperCase(),
    onClick: () => download(format),
  }));

  return (
    <PositionedMenu isIcon items={items} {...rest}>
      <DownloadIcon />
    </PositionedMenu>
  );
};

export default DownloadButton;
