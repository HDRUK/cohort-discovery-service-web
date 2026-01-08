import useRightClickMenu from "@/hooks/useRightClickMenu";
import { Menu, MenuItem } from "@mui/material";

interface Action {
  action: () => void;
  label: string;
}

interface RightClickMenuProps
  extends Omit<ReturnType<typeof useRightClickMenu>, "handleContextMenu"> {
  actions?: Action[];
}

const RightClickMenu = ({
  actions,
  open,
  menuPos,
  handleClose,
}: RightClickMenuProps) => {
  return (
    actions && (
      <Menu
        open={open}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          menuPos !== null
            ? { top: menuPos.mouseY, left: menuPos.mouseX }
            : undefined
        }
      >
        {actions.map(({ action, label }) => (
          <MenuItem
            key={label}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClose();
              action();
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    )
  );
};

export default RightClickMenu;
