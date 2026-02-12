"use client";

import { useMemo } from "react";
import { Box, List } from "@mui/material";

import { routes } from "../../config/routes";
import useUserStore from "@/hooks/useUserStore";
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
  const user = useUserStore((s) => s.user);
  const custodians = useUserStore((s) => s.custodians);

  const teamIds = useMemo(
    () => user?.token_user?.cohort_admin_teams?.map((t) => String(t.id)) ?? [],
    [user],
  );

  const userCustodians = useMemo(
    () =>
      (custodians ?? []).filter((c) =>
        teamIds.includes(String(c.external_custodian_id)),
      ),
    [custodians, teamIds],
  );

  const custodianChildren: MenuItem[] = userCustodians.map((uc) => ({
    label: uc.name,
    path: routes.teamCollections(uc.pid),
    key: `custodian-${uc.pid}`,
  }));

  const isAdmin = useMemo(() => user?.token_user?.is_admin, [user]);

  const menu: MenuItem[] = useMemo(
    () => [
      { label: "Cohorts", path: routes.dashboardNewQuery() },
      /*{ label: "My Definitions", path: routes.definitions },*/
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
      { label: "Profile", path: routes.profile },
    ],
    [custodianChildren, isAdmin],
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
