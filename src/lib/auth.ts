import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, TokenUser, User } from "@/types/api";
import { RoleName } from "@/types/roles";
import { redirect } from "next/navigation";
import { isStandalone } from "@/utils/modes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthOptions";
import { isOidcEnabled } from "@/lib/oidc";

const applicationMode = process.env.APPLICATION_MODE;
const baseURL = process.env.API_BASE_URL ?? "http://localhost:8100";

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

export async function getAccessToken(): Promise<string | undefined> {
  if (isOidcEnabled()) {
    const session = await getActiveOidcSession();
    return session?.accessToken;
  }

  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_NAME)?.value;
}

type StringOrNamed = string | { name: string };

const normaliseTokenUser = (
  raw: Omit<TokenUser, "workgroups" | "cohort_discovery_roles"> & {
    workgroups?: StringOrNamed[];
    cohort_discovery_roles?: StringOrNamed[];
  },
): TokenUser => ({
  ...raw,
  workgroups:
    raw.workgroups?.map((item) =>
      typeof item === "string" ? item : item.name,
    ) ?? [],
  cohort_discovery_roles:
    raw.cohort_discovery_roles
      ?.map((item) => (typeof item === "string" ? item : item.name))
      .filter((name): name is RoleName =>
        Object.values(RoleName).includes(name as RoleName),
      ) ?? [],
});

const mapUserToTokenUser = (user: User): TokenUser => {
  const fullName = (user.name ?? "").trim();
  const [firstname = "", lastname = ""] = fullName.split(/\s+/, 2);

  return {
    id: user.id,
    email: user.email,
    orcid: "",
    name: fullName,
    firstname,
    lastname,
    is_admin: user.roles.some((role) => role.name === RoleName.ADMIN),
    is_nhse_sde_approval: false,
    organisation: "",
    provider: "oidc",
    workgroups: user.workgroups?.map((workgroup) => workgroup.name) ?? [],
    cohort_discovery_roles: user.roles
      .map((role) => role.name)
      .filter((name): name is RoleName =>
        Object.values(RoleName).includes(name as RoleName),
      ),
    cohort_admin_teams: user.custodians.map((custodian) => ({
      id: Number(custodian.external_custodian_id),
      name: custodian.name,
    })),
  };
};

const fetchMe = async (token: string): Promise<User | null> => {
  try {
    const response = await fetch(`${baseURL}${API_ROUTES.getMe}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as ApiResponse<User>;
    return json.data ?? null;
  } catch {
    return null;
  }
};

export async function getTokenUser(): Promise<{
  user: TokenUser;
}> {
  if (isOidcEnabled()) {
    const token = await getAccessToken();
    if (!token) {
      if (isStandalone(applicationMode)) {
        redirect("/login");
      } else {
        redirect("/user-not-found");
      }
    }

    const me = await fetchMe(token);
    if (me) {
      return { user: mapUserToTokenUser(me) };
    }

    if (isStandalone(applicationMode)) {
      redirect("/login");
    }

    redirect("/user-not-found");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;

  const decoded = token ? (jwt.decode(token) as JwtPayload) : undefined;

  const user = decoded?.user
    ? normaliseTokenUser(
        decoded.user as Omit<TokenUser, "workgroups" | "cohort_discovery_roles"> & {
          workgroups?: StringOrNamed[];
          cohort_discovery_roles?: StringOrNamed[];
        },
      )
    : undefined;

  if (!user) {
    if (isStandalone(applicationMode)) {
      redirect("/login");
    } else {
      redirect("/user-not-found");
    }
  }

  return { user };
}
