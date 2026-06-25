import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CombinedUser } from "@/types/api";
import { RoleName } from "@/types/roles";
import ProtectedPage from "./components/ProtectedPage";
import getMe from "@/actions/getMe";
import getCustodians from "@/actions/custodian/getCustodians";
import getFeatureFlags from "@/actions/getFeatureFlags";
import { isStandalone } from "@/utils/modes";
import { isOidcEnabled } from "@/lib/oidc";
import { ErrorMode } from "@/lib/apiClient";
import getWorkgroups from "@/actions/workgroup/getWorkgroups";
import getUserCollections from "@/actions/collection/getUserCollections";
import { getAccessToken, getTokenUser } from "@/lib/auth";

const applicationMode = process.env.APPLICATION_MODE;

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getAccessToken();
  if (!token) {
    if (isOidcEnabled()) {
      redirect("/auth/signin/oidc?callbackUrl=%2F");
    }
    if (isStandalone(applicationMode)) {
      redirect("/login");
    }
    redirect("/403?reason=no-token");
  }

  if (!isOidcEnabled()) {
    const decoded = jwt.decode(token) as JwtPayload;
    const h = await headers();
    const requestNow = h?.get("x-request-now");
    const now = requestNow !== null ? Math.floor(Number(requestNow)) : 0;
    if (decoded.exp && now >= Math.floor(decoded.exp)) {
      redirect("/auth/logout");
    }
  }

  const { user } = await getTokenUser();

  const { data: me, error } = await getMe({ errorMode: ErrorMode.RESULT });
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

  const { data: flags } = await getFeatureFlags();
  const { data: custodians } = await getCustodians();
  const { data: workgroups } = await getWorkgroups();
  const { data: collections } = await getUserCollections();

  const combinedUser = { ...me, token_user: user } as unknown as CombinedUser;

  return (
    <ProtectedPage
      user={combinedUser}
      collections={collections}
      custodians={custodians}
      workgroups={workgroups}
      featureFlags={flags}
    >
      {children}
    </ProtectedPage>
  );
}
