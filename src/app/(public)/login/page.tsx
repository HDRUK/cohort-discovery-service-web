import { redirect } from "next/navigation";
import LoginClient from "./components/LoginClient";
import { Box } from "@mui/material";
import TabsShell from "@/components/TabsShell";
import { getAccessToken } from "@/lib/auth";
import { isOidcEnabled } from "@/lib/oidc";
export default async function LoginPage() {
  if (await getAccessToken()) {
    redirect("/");
  }

  const oidcEnabled = isOidcEnabled();

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
          <LoginClient oidcEnabled={oidcEnabled} />
        </Box>
      ),
    },
  ];

  return <TabsShell tabs={tabs} />;
}
