"use client";

import { useEffect, useMemo } from "react";
import { redirect, usePathname } from "next/navigation";

import TabsShell from "@/components/TabsShell";
import { routes } from "../../config/routes";
import { TabType } from "../TabsShell/TabsShell";
import { checkIsAdmin } from "@/utils/user";
import useUserStore from "@/hooks/useUserStore";
import { HelpIcon } from "@/icons/HelpIcon";
import HelpTooltip from "../HelpTooltip";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import theme from "@/config/theme";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";

export default function TopMenu() {
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const { isStandalone } = useApplicationMode();

  const { helpTooltipOpen, setHelpTooltipOpen } = useQueryBuilder((qb) => ({
    helpTooltipOpen: qb.helpTooltipOpen,
    setHelpTooltipOpen: qb.setHelpTooltipOpen,
  }));

  useEffect(() => {
    if (!helpTooltipOpen || !user) return;
    const id = setTimeout(() => setHelpTooltipOpen(false), 10000);
    return () => clearTimeout(id);
  }, [helpTooltipOpen, setHelpTooltipOpen, user]);

  const userCustodians = useMemo(
    () => user?.custodians ?? [],
    [user?.custodians],
  );

  const tabs = useMemo<TabType[]>(() => {
    const baseTabs = [
      {
        id: routes.dashboardNewQuery(),
        label: "Cohort Discovery",
        href: routes.dashboardNewQuery(),
        route: routes.dashboard,
        page: null,
      },
      ...userCustodians.map((uc) => ({
        id: routes.teamHosts(uc.pid),
        label: `${uc.name} Management`,
        href: routes.teamHosts(uc.pid),
        route: routes.teamHome(uc.pid),
        page: null,
      })),
      ...(user && isStandalone
        ? [
            {
              id: routes.profile,
              label: "My Account",
              href: routes.profile,
              page: null,
            },
          ]
        : []),
      ...(checkIsAdmin(user)
        ? [
            {
              id: routes.admin,
              label: "Admin",
              href: routes.adminWorkgroups,
              route: routes.admin,
              page: null,
            },
          ]
        : []),
      {
        id: routes.help(),
        label: "Help",
        href: routes.help(),
        route: routes.help(),
        page: null,
      },
    ];

    return baseTabs;
  }, [isStandalone, user, userCustodians]);

  const currentTabValue =
    tabs.find((tab) => {
      const matchPath = tab?.route ?? tab.href;
      if (!matchPath) return false;

      return pathname === matchPath || pathname.startsWith(matchPath + "/");
    })?.id ??
    tabs[0]?.id ??
    0;

  const handleTooltipClose = () => {
    setHelpTooltipOpen(false);
  };

  return (
    <>
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
        endIcon={
          <HelpTooltip
            title="Tool guidance can be found here"
            placement="left"
            open={helpTooltipOpen && !!user}
            onClose={handleTooltipClose}
            sx={{ zIndex: 1250 }}
          >
            <HelpIcon
              sx={{
                maxHeight: 20,
                maxWidth: 20,
                color: theme.palette.tooltip?.main,
                mr: 2,
              }}
              onClick={() => redirect(routes.help())}
            />
          </HelpTooltip>
        }
      />
    </>
  );
}
