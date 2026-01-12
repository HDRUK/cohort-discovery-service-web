import { cookies, headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { TokenUser, CombinedUser } from "@/types/api";
import { RoleName } from "@/types/roles";
import ProtectedPage from "./components/ProtectedPage";
import getMe from "@/actions/getMe";
import getCustodians from "@/actions/getCustodians";
import getFeatureFlags from "@/actions/getFeatureFlags";

const applicationMode = process.env.APPLICATION_MODE;

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;
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
  const now = requestNow !== null ? Math.floor(Number(requestNow)) : 0;
  if (decoded.exp && now >= Math.floor(decoded.exp)) {
    redirect("/api/auth/logout");
  }

  const user = decoded.user as TokenUser;

  let me;
  try {
    const { data } = await getMe();
    me = data;
  } catch {
    forbidden();
  }

  const roles = me.roles.map((r) => r.name) ?? [];

  const hasGeneralAccess = roles?.includes(RoleName.USER);

  const hasAdminAccess =
    roles.includes(RoleName.ADMIN) || roles.includes(RoleName.ADMIN);

  const hasTeamAccess = me.custodians.length > 0;

  if (!(hasGeneralAccess || hasAdminAccess || hasTeamAccess)) {
    forbidden();
  }

  const { data: flags } = await getFeatureFlags();
  const { data: custodians } = await getCustodians();

  const combinedUser = { ...me, token_user: user } as unknown as CombinedUser;

  return (
    <ProtectedPage
      user={combinedUser}
      custodians={custodians}
      featureFlags={flags}
    >
      {children}
    </ProtectedPage>
  );
}
