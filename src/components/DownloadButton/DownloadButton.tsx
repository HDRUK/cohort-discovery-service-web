import DownloadIcon from "@mui/icons-material/Download";
import PositionedMenu, { PositionedMenuItem } from "../PositionedMenu";
import { useNotify } from "@/providers/NotifyProvider";

const NOTIFY_DURATION = 3000;

export enum AvailableFormats {
  JSON = "json",
  CSV = "csv",
}

export interface DownloadButtonProps {
  label: string;
  formats: AvailableFormats[];
  buildHref: (format: AvailableFormats) => string;
  isIcon?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

const DownloadButton = ({
  label,
  formats,
  buildHref,
  isIcon = true,
  disabled,
  tooltip,
}: DownloadButtonProps) => {
  const notify = useNotify();

  const download = (format: AvailableFormats) => {
    if (disabled) return;

    const a = document.createElement("a");
    a.href = buildHref(format);
    a.target = "_self";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);

    setTimeout(() => {
      a.click();
      a.remove();
      notify.success(
        `Downloading ${label} as ${format.toUpperCase()} has started. Please allow some time for it to complete.`,
        NOTIFY_DURATION,
      );
    }, 100);
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
