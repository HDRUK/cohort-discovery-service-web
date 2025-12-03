"use client";

import React from "react";
import { AppBar, Toolbar, IconButton, Box, Typography } from "@mui/material";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import userIcon from "@/assets/user_logo.svg";
import { useDaphneStore } from "@/store/useDaphneStore";

const HeaderBar = () => {
  const {
    userData: { user },
  } = useDaphneStore();

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
          <Box sx={{ py: 2 }}>
            <Image
              height={30}
              priority
              src={logo}
              alt={"cohort discovery logo"}
            />
          </Box>
        </Box>
        {user && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="inherit">
              <Image priority src={userIcon} alt={"user icon"} />
            </IconButton>
            <Typography color="secondary.contrastText">{user.name}</Typography>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
