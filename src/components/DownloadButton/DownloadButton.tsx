import DownloadIcon from "@mui/icons-material/Download";
import PositionedMenu, { PositionedMenuItem } from "../PositionedMenu";
import { useNotify } from "@/providers/NotifyProvider";
import {
  AvailableFormats,
  DownloadEntity,
  downloadHref,
} from "./downloadHref";

const NOTIFY_DURATION = 3000;

export interface DownloadButtonProps {
  entity: DownloadEntity;
  label: string;
  formats: AvailableFormats[];
  pids?: string[];
  params?: string;
  isIcon?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

const DownloadButton = ({
  entity,
  label,
  formats,
  pids,
  params,
  isIcon = true,
  disabled,
  tooltip,
}: DownloadButtonProps) => {
  const notify = useNotify();

  const triggerDownload = (url: string, notifyMessage: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_self";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);

    setTimeout(() => {
      a.click();
      a.remove();
      notify.success(notifyMessage, NOTIFY_DURATION);
    }, 100);
  };

  const download = (format: AvailableFormats) => {
    if (disabled) return;

    (pids ?? [undefined]).forEach((pid) =>
      triggerDownload(
        downloadHref({ entity, pid, format, params }),
        `Downloading ${label} as ${format.toUpperCase()} has started. Please allow some time for it to complete.`,
      ),
    );
  };

  const items: PositionedMenuItem[] = formats.map((format) => ({
    id: format,
    label: format.toUpperCase(),
    onClick: () => download(format),
  }));

  return isIcon ? (
    <PositionedMenu
      title={tooltip}
      data-testid="download-button"
      isIcon
      items={items}
    >
      <DownloadIcon />
    </PositionedMenu>
  ) : (
    <PositionedMenu
      title={tooltip}
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
        "&.MuiButton-root:hover": {
          backgroundColor: "highlight.main",
        },
      }}
      size="medium"
    >
      Download
    </PositionedMenu>
  );
};

export default DownloadButton;
