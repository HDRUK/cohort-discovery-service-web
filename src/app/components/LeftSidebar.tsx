"use client";

import {
  Box,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const drawerWidth = 240;

export default function LeftSidebar() {
  return (
    <Box
      sx={(theme) => ({
        width: drawerWidth,
        flexShrink: 0,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRight: "1px solid #e0e0e0",
        height: "100vh",
        p: 2,
        boxSizing: "border-box",
      })}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Menu
        </Typography>
        <List>
          {["Home", "Settings", "Help"].map((text) => (
            <ListItem key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
