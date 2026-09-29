import { redirect } from "next/navigation";

interface SsoCallbackPageProps {
  searchParams: Promise<{ code?: string; error?: string; provider?: string }>;
}

export default async function SsoCallbackPage({
  searchParams,
}: SsoCallbackPageProps) {
  const { code, error, provider } = await searchParams;

  const params = new URLSearchParams();
  if (code) params.append("code", code);
  if (error) params.append("error", error);
  if (provider) params.append("provider", provider);

  redirect(`/api/auth/sso/callback?${params.toString()}`);
}
