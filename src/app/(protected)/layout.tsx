import { cookies } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { GATEWAY_TOKEN_NAME } from "@/config/internals";
import { TokenUser, CombinedUser, Roles } from "@/types/api";
import ProtectedPage from "./components/ProtectedPage";
import SignIn from "@/app/signin";
import getMe from "@/actions/getMe";
import getCustodians from "@/actions/getCustodians";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const applicationMode = process.env.APPLICATION_MODE;

  const cookieStore = await cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value;
  if (!token) {
    if (applicationMode === "standalone") {
      // No token — render the client SignIn component so users can sign in.
      return <SignIn />;
    } else {
      forbidden();
    }
  }

  const decoded = jwt.decode(token);
  const user = decoded.user as TokenUser;

  const hasGeneralAccess = user?.cohort_discovery_roles?.includes(Roles.GENERAL_ACCESS);
  const hasAdminAccess = (user?.cohort_discovery_roles?.includes(Roles.ADMIN) || 
    user?.cohort_discovery_roles.includes(Roles.SYSTEM_ADMIN));

  const now = Math.floor(Date.now() / 1000);
  if (decoded.exp && now >= decoded.exp) {
    redirect("/api/auth/logout");
  }

  if (!hasGeneralAccess || !hasAdminAccess) {
    forbidden();
  }

  let me;
  try {
    const { data } = await getMe(token);
    me = data;
  } catch {
    forbidden();
  }

  const { data: custodians } = await getCustodians();

  const combinedUser = { ...me, gateway_user: user } as unknown as CombinedUser;

  return (
    <ProtectedPage user={combinedUser} custodians={custodians}>
      {children}
    </ProtectedPage>
  );
}
