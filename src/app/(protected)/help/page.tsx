"use server";

import { Paper } from "@mui/material";
import Help from "./components/Help";

export default async function HelpPage() {
  return (
    <Paper sx={{ width: "100%", height: "100%", p: 2 }}>
      <Help />
    </Paper>
  );
}
