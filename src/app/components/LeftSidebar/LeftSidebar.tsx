"use client";

import Link from "next/link";
import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { usePathname } from "next/navigation";
import { routes } from "@/config/routes";

const drawerWidth = 240;

const menuItems = [{ label: "Home", path: routes.dashboard }];

export default function LeftSidebar() {
  const pathname = usePathname();
  const firstSegment = pathname?.split("/")[1] || "";

  return (
    <Box
      sx={(theme) => ({
        width: drawerWidth,
        flexShrink: 0,
        backgroundColor: "#fff",
        color: theme.palette.background.paper,
      })}
    >
      <List sx={{ py: 0 }}>
        {menuItems.map(({ label, path }) => {
          const menuSegment = path.split("/")[1];
          const isActive = firstSegment === menuSegment;

          return (
            <ListItemButton
              key={label}
              component={Link}
              href={path}
              selected={isActive}
            >
              <ListItemText primary={label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
