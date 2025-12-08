"use client";

import Link from "next/link";
import React, { useMemo, useState, MouseEvent } from "react";
import {
  Box,
  ListItemButton,
  ListItemText,
  IconButton,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { usePathname } from "next/navigation";

// If you prefer, import this type from your existing file instead:
// import type { MenuItem } from "./LeftSidebarMenuItem";
export type MenuItem = {
  icon?: React.ElementType;
  label: string;
  path?: string;
  key?: string;
  children?: MenuItem[];
};

type Props = {
  item: MenuItem;
};

const TopMenuItem = ({ item }: Props) => {
  const id = item.key ?? item.path ?? item.label;
  const pathname = usePathname();
  const hasChildren = !!item.children?.length;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const selected = useMemo(
    () =>
      !!item.path &&
      (pathname === item.path || pathname.startsWith(item.path + "/")),
    [pathname, item.path]
  );

  const open = Boolean(anchorEl);

  const handleToggleMenu = (
    event: MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => {
    if (!hasChildren) return;
    setAnchorEl((prev) => (prev ? null : (event.currentTarget as HTMLElement)));
  };

  const handleCloseMenu = () => setAnchorEl(null);

  const rootProps = item.path
    ? { component: Link, href: item.path }
    : { component: "div" as const };

  return (
    <Box key={id}>
      <ListItemButton
        {...rootProps}
        selected={selected}
        onClick={hasChildren && !item.path ? handleToggleMenu : undefined}
        sx={{
          width: "auto",
          px: 2,
          py: 1,
          borderRadius: 1,
          // make it look “navvy” instead of full-width list item
          "&.MuiListItemButton-root": {
            display: "inline-flex",
          },
          "&.Mui-selected": {
            backgroundColor: (theme) => theme.palette.action.selected,
          },
          "&:hover": {
            backgroundColor: (theme) => theme.palette.action.hover,
          },
        }}
      >
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{ variant: "body2" }}
        />
        {hasChildren && (
          <IconButton
            edge="end"
            size="small"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggleMenu(e);
            }}
          >
            <ExpandMore
              sx={{
                fontSize: 18,
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.15s ease-out",
              }}
            />
          </IconButton>
        )}
      </ListItemButton>

      {hasChildren && (
        <MuiMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          {item.children!.map((child) => {
            const childId = child.key ?? child.path ?? child.label;
            const childSelected =
              !!child.path &&
              (pathname === child.path ||
                pathname.startsWith(child.path + "/"));

            return (
              <MuiMenuItem
                key={childId}
                component={Link}
                href={child.path ?? "#"}
                selected={childSelected}
                onClick={handleCloseMenu}
              >
                {child.label}
              </MuiMenuItem>
            );
          })}
        </MuiMenu>
      )}
    </Box>
  );
};

export default TopMenuItem;
