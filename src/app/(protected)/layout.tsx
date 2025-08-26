import { cookies } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { GATEWAY_TOKEN_NAME } from "@/config/internals";
import { TokenUser, Rquestroles } from "@/types/api";
import ProtectedPage from "./components/ProtectedPage";
import getMe from "@/actions/getMe";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get(GATEWAY_TOKEN_NAME)?.value;
  if (!token) {
    redirect("/login");
  }

  const decoded = jwt.decode(token);
  const user = decoded.user as TokenUser;

  const hasGeneralAccess = user.rquestroles.includes(
    Rquestroles.GENERAL_ACCESS
  );

  if (!hasGeneralAccess) {
    forbidden();
  }

  const me = await getMe(token);
  console.log(me);

  return <ProtectedPage user={user}>{children}</ProtectedPage>;
}
