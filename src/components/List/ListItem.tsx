import useRightClickMenu from "@/hooks/useRightClickMenu";
import { ListItemButton, ListItemText } from "@mui/material";
import RightClickMenu from "../RightClickMenu/RightClickMenu";
import { RightClickAction } from "@/hooks/useNodeActions";

export interface ListItemType {
  id?: string | number;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  rightClickActions?: RightClickAction[];
}

const ListItem = ({
  id,
  label,
  disabled,
  onClick,
  rightClickActions,
}: ListItemType) => {
  const { handleContextMenu, ...rightClickMenuMethods } = useRightClickMenu();

  return (
    <ListItemButton
      disabled={disabled}
      key={id ?? label}
      component="div"
      onClick={onClick}
      onContextMenu={handleContextMenu}
    >
      <ListItemText sx={{ color: "text.primary" }} primary={label} />
      {rightClickActions && (
        <RightClickMenu
          {...rightClickMenuMethods}
          actions={rightClickActions}
        />
      )}
    </ListItemButton>
  );
};

export default ListItem;
