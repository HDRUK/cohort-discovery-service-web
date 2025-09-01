import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "./components/LoginClient";
import { Box, Typography } from "@mui/material";
import Circles from "./components/Circles";
import { GATEWAY_TOKEN_NAME } from "@/config/internals";

export default async function LoginPage() {
  if ((await cookies()).get(GATEWAY_TOKEN_NAME)) {
    redirect("/");
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Circles scale={1.5}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Cohort Discovery{" "}
          <Typography
            component="span"
            variant="h5"
            sx={{ fontWeight: 400, color: "text.secondary" }}
          >
            Access
          </Typography>
        </Typography>
        <LoginClient />
      </Circles>
    </Box>
  );
}
