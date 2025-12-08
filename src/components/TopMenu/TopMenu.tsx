"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import TabsShell from "@/components/TabsShell";
import { routes } from "../../config/routes";
import { useDaphneStore } from "@/store/useDaphneStore";
import { TabType } from "../TabsShell/TabsShell";
import { isAdmin } from "@/utils/token";

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
    () =>
      (custodians ?? []).filter((c) =>
        teamIds.includes(c.external_custodian_id)
      ),
    [custodians, teamIds]
  );

  const tabs = useMemo<TabType[]>(() => {
    const baseTabs = [
      {
        id: routes.dashboardNewQuery(),
        label: "Cohorts",
        href: routes.dashboardNewQuery(),
        route: routes.dashboard,
        page: null,
      },
      ...userCustodians.map((uc) => ({
        id: routes.teamCollections(uc.pid),
        label: `${uc.name} Management`,
        href: routes.teamCollections(uc.pid),
        route: routes.teamHome(uc.pid),
        page: null,
      })),
      ...(user
        ? [
            {
              id: routes.profile,
              label: "My Account",
              href: routes.profile,
              page: null,
            },
          ]
        : []),
      ...(isAdmin(user?.token_user)
        ? [
            {
              id: routes.admin,
              label: "Admin",
              href: routes.admin,
              page: null,
            },
          ]
        : []),
    ];

    return baseTabs;
  }, [user, userCustodians]);

  const currentTabValue =
    tabs.find((tab) => {
      const matchPath = tab?.route ?? tab.href;
      if (!matchPath) return false;

      return pathname === matchPath || pathname.startsWith(matchPath + "/");
    })?.id ??
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
