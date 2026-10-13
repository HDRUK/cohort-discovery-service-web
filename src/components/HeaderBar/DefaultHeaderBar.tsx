"use client";

import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import userIcon from "@/assets/user_logo.svg";
import logo from "@branding/assets/logo.svg";
import branding from "@branding/branding.config";
import PositionedMenu, { PositionedMenuItem } from "../PositionedMenu";
import { useRouter } from "next/navigation";
import useUserStore from "@/hooks/useUserStore";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";
import { useSignOutStore } from "@/store/signOutStore";
import { routes } from "@/config/routes";
import { checkIsAdmin } from "@/utils/user";
import { getOrganisationUrl } from "@/config/externalLinks";

const NEXT_PUBLIC_LOGIN_URL = getOrganisationUrl();

const DefaultHeaderBar = () => {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const { isStandalone } = useApplicationMode();
  const setSigningOut = useSignOutStore((s) => s.setSigningOut);
  const logoHref = user ? routes.dashboardNewQuery() : routes.login;

  const links: PositionedMenuItem[] = [
    ...(isStandalone
      ? [
          {
            id: "profile",
            label: "My Profile",
            onClick: () => router.push(routes.profile),
          },
        ]
      : []),
    ...(checkIsAdmin(user)
      ? [
          {
            id: "config",
            label: "Configuration",
            onClick: () => router.push(routes.config),
          },
          {
            id: "regression",
            label: "Regression Tests",
            onClick: () => router.push(routes.adminRegression),
          },
        ]
      : []),
    ...(isStandalone
      ? [
          {
            id: "logout",
            label: "Logout",
            onClick: () => {
              setSigningOut(true);
              setUser(null);
              window.location.href = routes.logout;
            },
          },
        ]
      : [
          {
            id: "back",
            label: "Back",
            onClick: () => {
              router.push(NEXT_PUBLIC_LOGIN_URL);
            },
          },
        ]),
  ];

  return (
    <AppBar
      position="static"
      sx={(theme) => ({
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        border: 0,
      })}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href={logoHref} style={{ display: "flex", padding: "4px 0" }}>
            <Image height={30} priority src={logo} alt={branding.logoAlt} />
          </Link>
        </Box>

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PositionedMenu isIcon items={links}>
              <Image priority src={userIcon} alt="user icon" />
            </PositionedMenu>
            <Typography color="secondary.contrastText">{user.name}</Typography>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default DefaultHeaderBar;
