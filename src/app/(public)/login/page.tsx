import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "./components/LoginClient";
import { Box } from "@mui/material";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import TabsShell from "@/components/TabsShell";
import { isStandalone } from "@/utils/modes";

const applicationMode = process.env.APPLICATION_MODE;

export default async function LoginPage() {
  if ((await cookies()).get(ACCESS_TOKEN_NAME)) {
    redirect("/");
  }

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      page: (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "",
          }}
        >
          <LoginClient standalone={isStandalone(applicationMode)} />
        </Box>
      ),
    },
  ];

  return <TabsShell tabs={tabs} />;
}
