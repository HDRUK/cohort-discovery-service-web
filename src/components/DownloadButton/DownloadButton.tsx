import { IconButtonProps } from "@mui/material";

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
  ids?: string[];
  entity?: string;
  formats?: AvailableFormats[];
  isIcon?: boolean;
}

const DownloadButton = ({
  ids,
  entity,
  formats = [AvailableFormats.JSON],
  disabled,
  isIcon = true,
}: DownloadButtonProps) => {
  const notify = useNotify();

  const download = async (format: AvailableFormats) => {
    if (disabled || !ids || ids.length === 0 || !entity) return;
    ids.map((id, idx) => {
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
      setTimeout(() => {
        a.click();
        notify.success(`Downloading ${entity} as ${format} has started`);
      }, 100 * idx);
    });
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
        fontWeight: "normal",
        fontSize: 14,
      }}
      size="medium"
    >
      Download
    </PositionedMenu>
  );
};

export default DownloadButton;
