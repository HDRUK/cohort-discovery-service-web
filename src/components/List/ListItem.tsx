import useRightClickMenu from "@/hooks/useRightClickMenu";
import {
  ListItemButton,
  ListItemText,
  ListItem as MuiListItem,
} from "@mui/material";
import RightClickMenu from "../RightClickMenu/RightClickMenu";
import { RightClickAction } from "@/hooks/useNodeActions";

export interface ListItemType {
  id?: string | number;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  rightClickActions?: RightClickAction[];
  selected?: boolean;
}

const ListItem = ({
  id,
  label,
  disabled,
  onClick,
  rightClickActions,
  selected,
}: ListItemType) => {
  const { handleContextMenu, ...rightClickMenuMethods } = useRightClickMenu();

  const key = id ?? label;

  if (!onClick) {
    return (
      <MuiListItem
        key={key}
        sx={{ display: "list-item", color: "text.primary" }}
      >
        <ListItemText primary={label} />
      </MuiListItem>
    );
  }

  return (
    <ListItemButton
      key={key}
      disabled={disabled}
      component="div"
      onClick={onClick}
      onContextMenu={handleContextMenu}
      selected={selected}
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
