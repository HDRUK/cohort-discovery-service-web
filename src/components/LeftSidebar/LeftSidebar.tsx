"use client";

import { useMemo } from "react";
import { Box, List } from "@mui/material";

import { routes } from "../../config/routes";
import { useDaphneStore } from "@/store/useDaphneStore";
import LeftSidebarMenuItem from "./LeftSidebarMenuItem";

const drawerWidth = 240;

type MenuItem = {
  icon?: React.ElementType;
  label: string;
  path?: string;
  key?: string;
  children?: MenuItem[];
};

export default function LeftSidebar() {
  const {
    userData: { user },
    custodianData: { custodians },
  } = useDaphneStore();

  const teamIds = useMemo(
    () => user?.gateway_user?.admin_teams?.map((t) => t.id) ?? [],
    [user]
  );
  const userCustodians = useMemo(
    () => (custodians ?? []).filter((c) => teamIds.includes(c.gateway_team_id)),
    [custodians, teamIds]
  );

  const custodianChildren: MenuItem[] = userCustodians.map((uc) => ({
    label: uc.name,
    path: routes.team(uc.pid),
    key: `custodian-${uc.pid}`,
  }));

  const isAdmin = useMemo(() => user?.gateway_user?.is_admin, [user]);

  const menu: MenuItem[] = useMemo(
    () => [
      { label: "Home", path: routes.dashboard },
      { label: "Profile", path: routes.profile },
      { label: "My Definitions", path: routes.definitions },
      ...(custodianChildren.length > 0
        ? [
            {
              label: "Custodians",
              key: "custodians-root",
              children: custodianChildren,
            },
          ]
        : []),
      ...(isAdmin
        ? [
            {
              label: "Admin",
              path: routes.admin,
            },
          ]
        : []),
    ],
    [custodianChildren, isAdmin]
  );
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
        {menu.map((item) => (
          <LeftSidebarMenuItem
            key={item.key ?? item.path ?? item.label}
            item={item}
          />
        ))}
      </List>
    </Box>
  );
}
