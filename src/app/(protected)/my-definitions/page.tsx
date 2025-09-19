"use server";

import { Paper, Typography } from "@mui/material";
import MyDefinitions from "./components/MyDefinitions";
import getConceptSets from "@/actions/getConceptSets";

export default async function ProfilePage() {
  const { data: conceptSets } = await getConceptSets();

  return (
    <Paper sx={{ width: "100%", minHeight: "100%", p: 2 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        My Definitions
      </Typography>
      <MyDefinitions conceptSets={conceptSets} />
    </Paper>
  );
}
