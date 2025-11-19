import * as React from "react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import {
  ClickAwayListener,
  Grow,
  IconButton,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";

export interface PositionedMenuItem {
  id: string;
  label: string | React.ReactNode;
  onClick: () => void;
}

interface PositionedMenuProps {
  children: React.ReactNode;
  isIcon?: boolean;
  active?: boolean;
  items?: PositionedMenuItem[];
}

const PositionedMenu = ({
  children,
  isIcon = false,
  active = false,
  items,
}: PositionedMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (open) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = (
    event: MouseEvent | TouchEvent | React.SyntheticEvent
  ) => {
    if (
      buttonRef.current &&
      event.target instanceof Node &&
      buttonRef.current.contains(event.target)
    ) {
      return;
    }

    setAnchorEl(null);
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      buttonRef.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      {isIcon ? (
        <IconButton
          ref={buttonRef}
          onClick={handleToggle}
          sx={{
            bgcolor: "white",
            borderRadius: 10,
            border: 2,
            borderColor: active ? "success.main" : "transparent",
          }}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
        >
          {children}
        </IconButton>
      ) : (
        <Button
          ref={buttonRef}
          variant="text"
          onClick={handleToggle}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
        >
          {children}
        </Button>
      )}
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        transition
        disablePortal
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 12],
            },
          },
        ]}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-end" ? "right top" : "right bottom",
            }}
          >
            <Paper sx={{ bgcolor: "white" }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                >
                  {items?.map(({ id, label, onClick }) => (
                    <MenuItem
                      key={id}
                      onClick={(e) => {
                        onClick();
                        handleClose(e);
                      }}
                    >
                      {label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default PositionedMenu;
