import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

interface SsoCallbackPageProps {
  searchParams: Promise<{ code?: string; error?: string }>;
}

export default async function SsoCallbackPage({
  searchParams,
}: SsoCallbackPageProps) {
  const { code, error } = await searchParams;

  const params = new URLSearchParams();
  if (code) params.append("code", code);
  if (error) params.append("error", error);

  redirect(`${routes.ssoCallback}?${params.toString()}`);
}
