"use client";

import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import userIcon from "@/assets/user_logo.svg";
import { useDaphneStore } from "@/store/useDaphneStore";
import PositionedMenu, { PositionedMenuItem } from "../PositionedMenu";
import { useRouter } from "next/navigation";

const HeaderBar = () => {
  const router = useRouter();
  const {
    userData: { user, setUser },
  } = useDaphneStore();

  const links: PositionedMenuItem[] = [
    {
      id: "logout",
      label: "Logout",
      onClick: () => {
        setUser(null);
        router.push("/api/auth/logout");
      },
    },
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
            <Image
              height={30}
              priority
              src={logo}
              alt={"cohort discovery logo"}
            />
          </Box>
        </Box>
        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PositionedMenu isIcon items={links}>
              <Image priority src={userIcon} alt={"user icon"} />
            </PositionedMenu>
            <Typography color="secondary.contrastText">{user.name}</Typography>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
