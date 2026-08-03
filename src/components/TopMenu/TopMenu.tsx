"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Stack } from "@mui/material";

import TabsShell from "@/components/TabsShell";
import { routes } from "../../config/routes";
import { TabType } from "../TabsShell/TabsShell";
import { checkIsAdmin } from "@/utils/user";
import useUserStore from "@/hooks/useUserStore";
import { HelpIcon } from "@/icons/HelpIcon";
import HelpTooltip from "../HelpTooltip";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";
import { TermDirectoryIcon } from "@/icons/TermDirectoryIcon";
import NavIconButton from "./NavIconButton";

export default function TopMenu() {
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const { isStandalone } = useApplicationMode();

  const { helpTooltipOpen, setHelpTooltipOpen } = useQueryBuilder((qb) => ({
    helpTooltipOpen: qb.helpTooltipOpen,
    setHelpTooltipOpen: qb.setHelpTooltipOpen,
  }));

  const [helpHoverOpen, setHelpHoverOpen] = useState(false);

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

  const isRouteActive = (route: string) =>
    pathname === route || pathname.startsWith(route + "/");

  const currentTabValue =
    tabs.find((tab) => {
      const matchPath = tab?.route ?? tab.href;
      if (!matchPath) return false;

      return isRouteActive(matchPath);
    })?.id ??
    tabs[0]?.id ??
    0;

  const handleTooltipClose = () => {
    setHelpHoverOpen(false);
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
          <Stack direction="row" sx={{ height: "100%" }}>
            <HelpTooltip
              title="Tool guidance can be found here"
              placement="left"
              open={(helpTooltipOpen && !!user) || helpHoverOpen}
              onOpen={() => setHelpHoverOpen(true)}
              onClose={handleTooltipClose}
              sx={{ zIndex: 1250 }}
            >
              <NavIconButton
                component={Link}
                href={routes.help()}
                aria-label="Help"
                selected={isRouteActive(routes.help())}
              >
                <HelpIcon />
              </NavIconButton>
            </HelpTooltip>
            <HelpTooltip title="Term Directory">
              <NavIconButton
                component={Link}
                href={routes.termDirectory}
                aria-label="Term Directory"
                selected={isRouteActive(routes.termDirectory)}
                sx={{ mr: 2 }}
              >
                <TermDirectoryIcon />
              </NavIconButton>
            </HelpTooltip>
          </Stack>
        }
      />
    </>
  );
}
