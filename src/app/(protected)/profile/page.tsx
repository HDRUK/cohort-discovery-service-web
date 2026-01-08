"use server";

import { Paper, Typography } from "@mui/material";
import UserProfile from "./components/UserProfile";

export default async function ProfilePage() {
  return (
    <Paper sx={{ width: "100%", height: "100%", p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        User Profile
      </Typography>
      <UserProfile />
    </Paper>
  );
}
