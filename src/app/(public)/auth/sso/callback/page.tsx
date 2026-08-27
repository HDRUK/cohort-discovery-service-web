import { redirect } from "next/navigation";
import ssoExchange from "@/actions/standalone/ssoExchange";

interface SsoCallbackPageProps {
  searchParams: Promise<{ code?: string; error?: string; provider?: string }>;
}

export default async function SsoCallbackPage({
  searchParams,
}: SsoCallbackPageProps) {
  const { code, error } = await searchParams;

  // SSO_FRONTEND_ERROR_URL falls back to SSO_FRONTEND_CALLBACK_URL when unset,
  // so an error redirect can land here instead of on the dedicated error page.
  if (error) {
    redirect(`/auth/sso/error?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    redirect("/auth/sso/error?error=invalid_callback");
  }

  const success = await ssoExchange(code);

  redirect(success ? "/" : "/auth/sso/error?error=exchange_failed");
}
