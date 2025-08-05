"use client";

import Link from "next/link";
import {
  Box,
  Toolbar,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const drawerWidth = 240;

const menuItems = [
  { label: "Home", path: "/dashboard" },
  { label: "Settings", path: "/settings" },
  { label: "Help", path: "/help" },
];

export default function LeftSidebar() {
  return (
    <Box
      sx={(theme) => ({
        width: drawerWidth,
        flexShrink: 0,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRight: "1px solid #e0e0e0",
        height: "100vh",
        p: 2,
        boxSizing: "border-box",
      })}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", p: 2 }}>
        <List>
          {menuItems.map(({ label, path }) => (
            <ListItemButton
              key={label}
              component={Link}
              href={path}
              sx={{ color: "inherit" }}
            >
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
}
