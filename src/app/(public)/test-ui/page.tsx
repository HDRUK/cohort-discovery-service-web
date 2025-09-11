import { Box } from "@mui/material";
import Component from "./component";

export default async function TestPage() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        bgcolor: "white",
        p: 2,
      }}
    >
      <Component />{" "}
    </Box>
  );
}
