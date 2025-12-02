import { cookies, headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { GATEWAY_TOKEN_NAME } from "@/config/internals";
import { TokenUser, CombinedUser, Roles } from "@/types/api";
import ProtectedPage from "./components/ProtectedPage";
import getMe from "@/actions/getMe";
import getCustodians from "@/actions/getCustodians";

const applicationMode = process.env.APPLICATION_MODE;

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value;
  const decoded = token ? (jwt.decode(token) as JwtPayload) : undefined;
  if (!token || !decoded) {
    if (applicationMode === "standalone") {
      // No token — render the client SignIn component so users can sign in.
      redirect("/login");
    } else {
      forbidden();
    }
  }

  const h = await headers();
  const requestNow = h?.get("x-request-now");
  const now = requestNow !== null ? Number(requestNow) : 0;
  if (decoded.exp && now >= decoded.exp) {
    redirect("/api/auth/logout");
  }

  const user = decoded.user as TokenUser;

  const hasGeneralAccess = user?.cohort_discovery_roles?.includes(
    Roles.GENERAL_ACCESS
  );

  const roles = user?.cohort_discovery_roles || [];

  const hasAdminAccess =
    roles.includes(Roles.ADMIN) || roles.includes(Roles.SYSTEM_ADMIN);

  if (!(hasGeneralAccess || hasAdminAccess)) {
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

  const combinedUser = { ...me, token_user: user } as unknown as CombinedUser;

  return (
    <ProtectedPage user={combinedUser} custodians={custodians}>
      {children}
    </ProtectedPage>
  );
}
