import { Paper, Typography } from "@mui/material";

export default async function NotFoundUser() {
  return (
    <Paper sx={{ minHeight: 200, p: 1 }}>
      <Typography variant="h2" color="error.main">
        User does not exist
      </Typography>
      <p>No valid user found with your current token.</p>
    </Paper>
  );
}
