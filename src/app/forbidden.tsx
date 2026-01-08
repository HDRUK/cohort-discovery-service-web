import { Paper, Typography } from "@mui/material";
import Link from "next/link";

export default function Forbidden() {
  return (
    <Paper>
      <Typography variant="h2" color="error.main">
        Forbidden
      </Typography>
      <p>You are not authorized to access this resource.</p>
      <Link href="/">Return Home</Link>
    </Paper>
  );
}
