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
  onClick?: () => void; // optional
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

  if (!onClick) {
    return (
      <MuiListItem
        component="li"
        disableGutters
        sx={{ display: "list-item", p: 0 }}
        key={id ?? label}
      >
        <ListItemText
          sx={{ color: "text.primary" }}
          primary={label}
          slotProps={{
            primary: {
              fontWeight: "bold",
            },
          }}
        />
      </MuiListItem>
    );
  }

  return (
    <ListItemButton
      disabled={disabled}
      key={id ?? label}
      component="div"
      onClick={onClick}
      onContextMenu={handleContextMenu}
      selected={selected}
      sx={{ display: "list-item" }}
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
