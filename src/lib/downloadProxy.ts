import { cookies } from "next/headers";
import { ACCESS_TOKEN_NAME } from "@/config/internals";

const baseURL = process.env.API_BASE_URL ?? "http://localhost:8100";

interface ProxyDownloadArgs {
  url: string;
  params?: URLSearchParams;
  fallbackFilename: string;
}

const proxyDownload = async ({
  url,
  params,
  fallbackFilename,
}: ProxyDownloadArgs): Promise<Response> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;

  const queryString = params?.toString();

  const backendRes = await fetch(
    `${baseURL}${url}${queryString ? `?${queryString}` : ""}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    },
  );

  if (!backendRes.ok) {
    return new Response("Download failed", { status: backendRes.status });
  }

  return new Response(backendRes.body, {
    status: 200,
    headers: {
      "Content-Type":
        backendRes.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition":
        backendRes.headers.get("content-disposition") ??
        `attachment; filename="${fallbackFilename}"`,
    },
  });
};

export default proxyDownload;
