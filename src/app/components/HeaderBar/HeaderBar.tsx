"use client";

import React from "react";
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import userIcon from "@/assets/user_logo.svg";

const HeaderBar = () => {
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

        <Box>
          <IconButton color="inherit">
            <Image priority src={userIcon} alt={"user icon"} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
