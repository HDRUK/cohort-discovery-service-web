import { IconButton } from "@mui/material";
import { CopyAllOutlined } from "@mui/icons-material";
import { useNotify } from "@/providers/NotifyProvider";

const CopyableTextButton = ({ text }: { text: string }) => {
  const notify = useNotify();
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    notify.success("Copied to clipboard");
  };

  return (
    <IconButton onClick={handleCopy}>
      <CopyAllOutlined />
    </IconButton>
  );
};
export default CopyableTextButton;
