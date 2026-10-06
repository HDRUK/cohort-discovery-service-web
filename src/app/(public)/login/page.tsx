import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import getAuthMethods from "@/actions/standalone/getAuthMethods";
import { routes } from "@/config/routes";
import { safeReturnTo } from "@/utils/returnTo";
import Login from "@/modules/Login";

interface LoginPageProps {
  searchParams: Promise<{ return_to?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if ((await cookies()).get(ACCESS_TOKEN_NAME)) {
    redirect(routes.home);
  }

  const { return_to: returnToParam } = await searchParams;
  const { data: methods } = await getAuthMethods();

  return (
    <Login
      methods={methods}
      returnTo={safeReturnTo(returnToParam)}
      copyrightYear={new Date().getFullYear()}
    />
  );
}
