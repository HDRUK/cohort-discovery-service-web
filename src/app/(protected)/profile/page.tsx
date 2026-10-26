"use server";

import { Paper } from "@mui/material";
import Title from "@/components/Title";
import UserProfile from "./components/UserProfile";

export default async function ProfilePage() {
  return (
    <Paper sx={{ width: "100%", height: "100%", p: 3 }}>
      <Title title="User profile" size="medium" wrapperSx={{ mb: 3 }} />
      <UserProfile />
    </Paper>
  );
}
