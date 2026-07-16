import { IconButton, type IconButtonProps } from "@mui/material";
import { CopyAllOutlined } from "@mui/icons-material";
import { useNotify } from "@/providers/NotifyProvider";

const CopyableTextButton = ({
  text,
  size,
  ariaLabel,
}: {
  text: string;
  size?: IconButtonProps["size"];
  ariaLabel?: string;
}) => {
  const notify = useNotify();
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    notify.success("Copied to clipboard");
  };

  return (
    <IconButton onClick={handleCopy} size={size} aria-label={ariaLabel}>
      <CopyAllOutlined fontSize={size === "small" ? "small" : "medium"} />
    </IconButton>
  );
};
export default CopyableTextButton;
