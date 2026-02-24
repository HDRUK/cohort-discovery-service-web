import { Button, ButtonProps } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useNodeActions from "@/hooks/useNodeActions";
import { RuleNodeType } from "@/types/rules";

export interface ConvertToGroupMenuItemProps extends ButtonProps {
  label: string;
  action: () => void;
  selectedNode: RuleNodeType | undefined;
}

const ConvertToGroupMenuItem = ({
  label,
  action,
  selectedNode,
  ...rest
}: ConvertToGroupMenuItemProps) => {
  const { handleConvertToGroup } = useNodeActions(selectedNode);

  return (
    <Button
      variant="text"
      startIcon={<AddIcon />}
      onClick={() => handleConvertToGroup()}
      sx={{
        justifyContent: "flex-start",
        textAlign: "left",
        color: "text.primary",
      }}
      {...rest}
    >
      {label}
    </Button>
  );
};
export default ConvertToGroupMenuItem;
