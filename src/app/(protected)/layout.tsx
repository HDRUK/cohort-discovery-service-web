import { cookies } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { GATEWAY_TOKEN_NAME } from "@/config/internals";
import { TokenUser, Rquestroles, CombinedUser } from "@/types/api";
import ProtectedPage from "./components/ProtectedPage";
import getMe from "@/actions/getMe";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value;
  if (!token) {
    redirect("/login");
  }

  const decoded = jwt.decode(token);

  const now = Math.floor(Date.now() / 1000);
  if (decoded.exp && now >= decoded.exp) {
    redirect("/api/auth/logout");
  }

  const user = decoded.user as TokenUser;

  const hasGeneralAccess = user.rquestroles.includes(
    Rquestroles.GENERAL_ACCESS
  );

  if (!hasGeneralAccess) {
    forbidden();
  }

  let me;
  try {
    const { data } = await getMe(token);
    me = data;
  } catch {
    forbidden();
  }

  const combinedUser = { ...me, gateway_user: user } as unknown as CombinedUser;

  return <ProtectedPage user={combinedUser}>{children}</ProtectedPage>;
}
