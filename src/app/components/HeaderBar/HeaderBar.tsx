"use client";

import React from "react";
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Image from "next/image";
import logo from "@/assets/logo.svg";

const HeaderBar = () => {
  return (
    <AppBar
      position="static"
      color="default"
      elevation={1}
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        color: theme.palette.background.paper,
      })}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ py: 2 }}>
            <Image priority src={logo} alt={"cohort discovery logo"} />
          </Box>
        </Box>

        <Box>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
