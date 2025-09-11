"use client";

import Link from "next/link";
import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { usePathname } from "next/navigation";
import { routes } from "../../config/routes";
import { useDaphneStore } from "@/store/useDaphneStore";

const drawerWidth = 240;

const userMenuItems = [
  { label: "Home", path: routes.dashboard },
  { label: "Profile", path: routes.profile },
];

const adminMenuItems = [{ label: "Admin", path: routes.admin }];

export default function LeftSidebar() {
  const pathname = usePathname();
  const firstSegment = pathname?.split("/")[1] || "";
  const {
    userData: { user },
  } = useDaphneStore();

  const menuItems = [
    ...userMenuItems,
    ...(user?.gateway_user?.is_admin ? adminMenuItems : []),
  ];

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
