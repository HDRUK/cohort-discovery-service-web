import { Box, IconButtonProps, Typography } from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import PositionedMenu, { PositionedMenuItem } from "../PositionedMenu";
import { useNotify } from "@/providers/NotifyProvider";

export enum AvailableFormats {
  JSON = "json",
  CSV = "csv",
}

export interface DownloadButtonProps extends Omit<
  IconButtonProps<"a">,
  "ref" | "href" | "component"
> {
  id?: string;
  entity?: string;
  formats?: AvailableFormats[];
  isIcon?: boolean;
}

const DownloadButton = ({
  id,
  entity,
  formats = [AvailableFormats.JSON],
  disabled,
  isIcon = true,
}: DownloadButtonProps) => {
  const notify = useNotify();

  const download = async (format: AvailableFormats) => {
    if (disabled || !id || !entity) return;

    const url = `/api/download/${encodeURIComponent(
      id,
    )}?entity=${encodeURIComponent(entity)}&format=${encodeURIComponent(
      format,
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

  return isIcon ? (
    <PositionedMenu data-testid="download-button" isIcon items={items}>
      <DownloadIcon />
    </PositionedMenu>
  ) : (
    <PositionedMenu
      data-testid="download-button"
      items={items}
      startIcon={<DownloadIcon />}
      variant="text"
      sx={{
        justifyContent: "flex-start",
        textAlign: "left",
        color: "text.primary",
      }}
    >
      Download
    </PositionedMenu>
  );
};

export default DownloadButton;
