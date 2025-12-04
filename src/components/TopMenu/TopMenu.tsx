// components/layout/TopMenu.tsx
"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import TabsShell from "@/components/TabsShell"; // <- adjust path as needed
import { routes } from "../../config/routes";
import { useDaphneStore } from "@/store/useDaphneStore";
import React from "react";

export default function TopMenu() {
  const pathname = usePathname();
  const {
    userData: { user },
    custodianData: { custodians },
  } = useDaphneStore();

  const teamIds = useMemo(
    () => user?.token_user?.cohort_admin_teams?.map((t) => t.id) ?? [],
    [user]
  );

  const userCustodians = useMemo(
    () => (custodians ?? []).filter((c) => teamIds.includes(c.gateway_team_id)),
    [custodians, teamIds]
  );

  const isAdmin = useMemo(() => user?.token_user?.is_admin, [user]);

  const tabs = useMemo(() => {
    const baseTabs = [
      {
        id: routes.dashboardNewQuery(),
        label: "Cohorts",
        href: routes.dashboardNewQuery(),
        page: null,
      },

      // each custodian becomes its own tab
      ...userCustodians.map((uc) => ({
        id: routes.teamCollections(uc.pid),
        label: `${uc.name} Management`,
        href: routes.teamCollections(uc.pid),
        page: null,
      })),
      {
        id: routes.profile,
        label: "My Account",
        href: routes.profile,
        page: null,
      },
    ];

    if (isAdmin) {
      baseTabs.push({
        id: routes.admin,
        label: "Admin",
        href: routes.admin,
        page: null,
      });
    }

    return baseTabs;
  }, [userCustodians, isAdmin]);

  const currentTabValue =
    tabs.find(
      (tab) =>
        tab.href &&
        (pathname === tab.href || pathname.startsWith(tab.href + "/"))
    )?.id ??
    tabs[0]?.id ??
    0;

  return (
    <TabsShell
      forceValue
      tabs={tabs}
      value={currentTabValue}
      sx={{ height: "auto" }}
      tabSx={(theme) => ({
        "&.Mui-selected": {
          bgcolor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
        },
      })}
      tabHeaderSx={(theme) => ({
        backgroundColor: theme.palette.background.paper,
      })}
    />
  );
}
