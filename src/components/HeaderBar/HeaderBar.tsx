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
      color="default"
      elevation={1}
      sx={(theme) => ({
        backgroundColor: "#fff",
        color: theme.palette.background.paper,
      })}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ py: 2 }}>
            <Image priority src={logo} alt={"cohort discovery logo"} />
          </Box>
        </Box>
        {user && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="inherit">
              <Image priority src={userIcon} alt={"user icon"} />
            </IconButton>
            <Typography color="primary.dark">{user.name}</Typography>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
