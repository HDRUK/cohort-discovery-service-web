import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { TokenUser } from "@/types/api";
import { redirect } from "next/navigation";
import { isStandalone } from "@/utils/modes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthOptions";
import { isOidcEnabled } from "@/lib/oidc";

const applicationMode = process.env.APPLICATION_MODE;

const getActiveOidcSession = async () => {
  const session = await getServerSession(authOptions);
  const now = Math.floor(Date.now() / 1000);

  if (!session?.accessToken) {
    return null;
  }

  if (session.accessTokenExpiresAt && now >= session.accessTokenExpiresAt) {
    return null;
  }

  return session;
};

const fallbackTokenUserFromSession = (
  sessionUser?: { id?: string; name?: string | null; email?: string | null } | null,
): TokenUser | null => {
  if (!sessionUser) {
    return null;
  }

  const fullName = (sessionUser.name ?? "").trim();
  const [firstname = "", lastname = ""] = fullName.split(/\s+/, 2);

  // Build a deterministic numeric id for cache tagging when no API-specific user claim exists.
  const stringId = sessionUser.id ?? sessionUser.email ?? "0";
  const numericId = Array.from(stringId).reduce(
    (acc, char) => (acc * 31 + char.charCodeAt(0)) % 2147483647,
    7,
  );

  return {
    id: numericId,
    email: sessionUser.email ?? "",
    orcid: "",
    name: fullName,
    firstname,
    lastname,
    is_admin: false,
    is_nhse_sde_approval: false,
    organisation: "",
    provider: "oidc",
    workgroups: [],
    cohort_discovery_roles: [],
    cohort_admin_teams: [],
  };
};

export async function getAccessToken(): Promise<string | undefined> {
  if (isOidcEnabled()) {
    const session = await getActiveOidcSession();
    if (session?.accessToken) {
      return session.accessToken;
    }
  }

  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_NAME)?.value;
}

export async function getTokenUser(): Promise<{
  user: TokenUser;
}> {
  const token = await getAccessToken();

  const decoded = token ? (jwt.decode(token) as JwtPayload) : undefined;

  const user = decoded?.user as TokenUser | undefined;
  if (user) {
    return { user };
  }

  if (isOidcEnabled()) {
    const session = await getActiveOidcSession();
    const fallbackUser = fallbackTokenUserFromSession(session?.user);
    if (fallbackUser) {
      return { user: fallbackUser };
    }
  }

  if (!token) {
    if (isStandalone(applicationMode)) {
      redirect("/login");
    } else {
      redirect("/user-not-found");
    }
  }

  if (isStandalone(applicationMode)) {
    redirect("/login");
  }

  redirect("/user-not-found");
}
