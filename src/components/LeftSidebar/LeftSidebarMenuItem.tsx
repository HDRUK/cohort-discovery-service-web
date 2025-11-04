// RecursiveMenuItem.tsx
"use client";

import Link from "next/link";
import React, { Fragment, useMemo, useState } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { usePathname } from "next/navigation";

export type MenuItem = {
  icon?: React.ElementType;
  label: string;
  path?: string;
  key?: string;
  children?: MenuItem[];
};

type Props = {
  item: MenuItem;
  depth?: number;
};

const LeftSidebarMenuItem = ({ item, depth = 0 }: Props) => {
  const id = item.key ?? item.path ?? item.label;
  const hasChildren = !!item.children?.length;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const IconComp = item.icon as React.ElementType | undefined;

  const selected = useMemo(
    () =>
      !!item.path &&
      (pathname === item.path || pathname.startsWith(item.path + "/")),
    [pathname, item.path]
  );

  const onToggle = () => setOpen(!open);

  return (
    <Fragment key={id}>
      <ListItemButton
        component={item.path ? Link : "div"}
        href={item.path || undefined}
        selected={selected}
        onClick={() => {
          if (hasChildren && !item.path) onToggle();
        }}
        sx={{ pl: 2 + depth * 2 }}
      >
        <ListItemText primary={item.label} />
        {hasChildren && (
          <IconButton
            edge="end"
            size="small"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle();
            }}
          >
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </ListItemButton>

      {hasChildren && (
        <Collapse in={!!open} timeout="auto" unmountOnExit>
          <List disablePadding>
            {item.children!.map((child) => (
              <LeftSidebarMenuItem
                key={child.key ?? child.path ?? child.label}
                item={child}
                depth={depth + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Fragment>
  );
};

export default LeftSidebarMenuItem;
