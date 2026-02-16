"use client";

import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import Image from "next/image";
import userIcon from "@/assets/user_logo.svg";
import PositionedMenu, { PositionedMenuItem } from "../PositionedMenu";
import { useRouter } from "next/navigation";
import useUserStore from "@/hooks/useUserStore";

const NEXT_PUBLIC_LOGIN_URL =
  process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://healthdatagateway.org";

const DefaultHeaderBar = ({ standalone = false }: { standalone: boolean }) => {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  const links: PositionedMenuItem[] = [
    ...(standalone
      ? [
          {
            id: "logout",
            label: "Logout",
            onClick: () => {
              setUser(null);
              router.push("/api/auth/logout");
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
          <Box sx={{ py: 0.5 }}>
            <b> image</b>
          </Box>
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
