import { redirect } from "next/navigation";
import ssoExchange from "@/actions/standalone/ssoExchange";

interface SsoCallbackPageProps {
  searchParams: Promise<{ code?: string; error?: string; provider?: string }>;
}

export default async function SsoCallbackPage({
  searchParams,
}: SsoCallbackPageProps) {
  const { code, error } = await searchParams;

  if (error) {
    redirect(`/auth/sso/error?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    redirect("/auth/sso/error?error=invalid_callback");
  }

  const success = await ssoExchange(code);

  redirect(success ? "/" : "/auth/sso/error?error=exchange_failed");
}
