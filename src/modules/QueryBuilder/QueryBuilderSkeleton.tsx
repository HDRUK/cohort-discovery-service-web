import { Paper, Typography } from "@mui/material";

export const QueryBuilderSkeleton = () => (
  <Paper
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      flexGrow: 1,
      maxWidth: "700px",
    }}
  >
    <Typography textAlign="center" px={3} fontSize="large">
      Start by typing your query keywords in the Natural Language search box, or
      build your query step-by-step using the buttons under &apos;Insert&apos;
      in the left-hand menu.
    </Typography>
  </Paper>
);
