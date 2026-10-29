import { Chip } from "@mui/material";
import { CollectionHostWithCredentials } from "@/types/api";
import ShowOnClick from "../ShowOnClick";
import CodeBlock from "../CodeBlock";

const CollectionHostChip = ({
  ch,
  disabled = false,
  ...rest
}: {
  ch?: CollectionHostWithCredentials;
  disabled?: boolean;
}) => {
  if (!ch) return;

  return (
    <ShowOnClick
      dialogTitle={"Host"}
      disabled={disabled}
      icon={<Chip label={ch.name} size="small" color="secondary" {...rest} />}
    >
      Client ID: <CodeBlock code={ch.client_id} />
      Client Secret: <CodeBlock code={ch.client_secret} />
    </ShowOnClick>
  );
};

export default CollectionHostChip;
