import { Suspense } from "react";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { hasLiveSession } from "@/server/session";
import { getAuthMethods } from "@/server/data/auth";
import { safeReturnTo } from "@/utils/returnTo";
import { getCopyrightYear } from "@/utils/getCopyrightText";
import Login from "@/modules/Login";

interface LoginPageProps {
  searchParams: Promise<{ return_to?: string }>;
}

const LoginContent = async ({ searchParams }: LoginPageProps) => {
  if (await hasLiveSession()) redirect(routes.home);

  const [{ return_to: returnToParam }, { data: methods }, copyrightYear] =
    await Promise.all([searchParams, getAuthMethods(), getCopyrightYear()]);

  return (
    <Login
      methods={methods}
      returnTo={safeReturnTo(returnToParam)}
      copyrightYear={copyrightYear}
    />
  );
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <Suspense>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}
