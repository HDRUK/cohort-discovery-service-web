import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "./components/LoginClient";
import { Box } from "@mui/material";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import TabsShell from "@/components/TabsShell";
import getAuthMethods from "@/actions/standalone/getAuthMethods";
export default async function LoginPage() {
  if ((await cookies()).get(ACCESS_TOKEN_NAME)) {
    redirect("/");
  }

  const methods = await getAuthMethods();

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      page: (
        <Box
          sx={{
            width: "100%",
            minHeight: 500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "",
          }}
        >
          <LoginClient methods={methods} />
        </Box>
      ),
    },
  ];

  return <TabsShell tabs={tabs} />;
}
