import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { TokenUser, CombinedUser } from "@/types/api";
import { RoleName } from "@/types/roles";
import ProtectedPage from "./components/ProtectedPage";
import AppShell from "@/components/AppShell";
import { routes } from "@/config/routes";
import { getCurrentUser } from "@/server/data/user";
import { getCustodians } from "@/server/data/custodians";
import { getFeatureFlags } from "@/server/data/features";
import { isStandalone } from "@/utils/modes";
import { getWorkgroups } from "@/server/data/workgroups";
import { getUserCollections } from "@/server/data/collections";

const applicationMode = process.env.APPLICATION_MODE;

export const instant = false;

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;
  const decoded = token ? (jwt.decode(token) as JwtPayload) : undefined;
  const h = await headers();

  if (!token || !decoded) {
    if (isStandalone(applicationMode)) {
      // No token — render the client SignIn component so users can sign in.
      const requestedPath = h?.get("x-pathname");
      redirect(
        requestedPath ? routes.loginWithReturn(requestedPath) : routes.login,
      );
    } else {
      redirect("/403?reason=no-token");
    }
  }

  const requestNow = h?.get("x-request-now");
  const now = requestNow !== null ? Math.floor(Number(requestNow)) : 0;
  if (decoded.exp && now >= Math.floor(decoded.exp)) {
    redirect("/api/auth/logout");
  }

  const user = decoded.user as TokenUser;

  const { data: me, error } = await getCurrentUser();
  const { code: errorCode } = error ?? {};

  if (errorCode === 404) {
    if (isStandalone(applicationMode)) {
      notFound();
    }
    redirect("/user-not-found");
  }

  const roles = me.roles.map((r) => r.name) ?? [];

  const hasGeneralAccess = roles?.includes(RoleName.USER);
  const hasAdminAccess = roles.includes(RoleName.ADMIN);
  const hasTeamAccess = me.custodians.length > 0;

  if (!(hasGeneralAccess || hasAdminAccess || hasTeamAccess)) {
    redirect("/403?reason=missing-role");
  }

  const [
    { data: flags },
    { data: custodians },
    { data: workgroups },
    { data: collections },
  ] = await Promise.all([
    getFeatureFlags(),
    getCustodians(),
    getWorkgroups(),
    getUserCollections(),
  ]);

  const combinedUser = { ...me, token_user: user } as unknown as CombinedUser;

  return (
    <AppShell>
      <ProtectedPage
        user={combinedUser}
        collections={collections}
        custodians={custodians}
        workgroups={workgroups}
        featureFlags={flags}
      >
        {children}
      </ProtectedPage>
    </AppShell>
  );
}
